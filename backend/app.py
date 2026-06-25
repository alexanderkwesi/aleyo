from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Dict, Optional, Any
from datetime import datetime, timedelta
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from sqlalchemy import desc
import asyncio
import json
import uuid
import secrets
from enum import Enum
import jwt
from passlib.context import CryptContext
from database import (
    get_db, User, PasswordResetToken, Project, ProjectDesign,
    CreditTransaction, Integration, DesignTemplate, DesignComponent,
    ProjectComponent, AnalyticsEvent, init_db
)

app = FastAPI(title="Aleyo AI Website Builder API")

# Security
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Configuration
SECRET_KEY = "your-secret-key-change-in-production"  # Change this in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:4000", "http://127.0.0.1:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()

# ==================== Pydantic Models ====================

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    credits: int
    created_at: datetime
    subscription_tier: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class DesignComponent(BaseModel):
    id: str
    type: str
    styles: Dict[str, Any]
    content: Dict[str, Any]

class DesignTemplate(BaseModel):
    id: str
    name: str
    category: str
    layout: Dict[str, Any]
    styles: Dict[str, Any]
    components: List[DesignComponent]

class WebsiteProject(BaseModel):
    id: str
    name: str
    designs: List[str]
    customizations: Dict[str, Any]
    html_code: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    user_id: str
    published_url: Optional[str] = None

class ProjectCreate(BaseModel):
    name: str
    designs: List[str] = []
    customizations: Dict[str, Any] = {}

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    customizations: Optional[Dict[str, Any]] = None
    html_code: Optional[str] = None

class IntegrationConfig(BaseModel):
    type: str  # 'forms', 'payment', 'email', 'calendar', 'ads'
    provider: str
    api_key: Optional[str] = None
    settings: Dict[str, Any]

class CreditPurchase(BaseModel):
    amount: int  # Number of credits to purchase
    payment_method: str

# ==================== Helper Functions ====================

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password"""
    return pwd_context.verify(plain_password, hashed_password)
    


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
            )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return user

def deduct_credits(db: Session, user_id: str, amount: int) -> bool:
    user = db.query(User).filter(User.id == user_id).first()
    if user and user.credits >= amount:
        # Create transaction record (credit will be updated by trigger)
        transaction = CreditTransaction(
            user_id=user_id,
            amount=-amount,
            type="usage",
            description="Website building usage"
        )
        db.add(transaction)
        db.commit()
        db.refresh(user)
        return True
    return False

def add_credits(db: Session, user_id: str, amount: int, description: str = "Credit purchase"):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        # Create transaction record (credit will be updated by trigger)
        transaction = CreditTransaction(
            user_id=user_id,
            amount=amount,
            type="purchase",
            description=description
        )
        db.add(transaction)
        db.commit()
        db.refresh(user)
        return True
    return False

def get_predefined_designs(db: Session) -> Dict[str, Any]:
    """Get all predefined designs from database"""
    designs = db.query(DesignTemplate).all()
    result = {}
    for design in designs:
        components = db.query(DesignComponent).filter(
            DesignComponent.design_id == design.id
        ).order_by(DesignComponent.position).all()
        
        result[design.id] = {
            "id": design.id,
            "name": design.name,
            "category": design.category,
            "layout": design.layout,
            "styles": design.styles,
            "components": [
                {
                    "id": comp.component_id,
                    "type": comp.component_type,
                    "styles": comp.styles,
                    "content": comp.content
                }
                for comp in components
            ]
        }
    return result

def generate_html_from_designs(designs: List[Dict], customizations: Dict, project_name: str) -> str:
    """Generate HTML from merged designs"""
    merged_styles = {}
    merged_components = []
    
    for design in designs:
        # Merge styles
        for key, value in design.get("styles", {}).items():
            merged_styles[key] = value
        
        # Merge components
        merged_components.extend(design.get("components", []))
    
    # Apply customizations
    merged_styles.update(customizations)
    
    # Generate HTML
    components_html = ""
    for component in merged_components:
        components_html += generate_component_html(component, merged_styles)
    
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{project_name}</title>
        <style>
            * {{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }}
            
            body {{
                font-family: {merged_styles.get('font_family', 'Inter, sans-serif')};
                background: {merged_styles.get('background_color', '#0F172A')};
                color: {merged_styles.get('text_color', '#FFFFFF')};
            }}
            
            .container {{
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
            }}
            
            .hero {{
                background: linear-gradient(135deg, {merged_styles.get('primary_color', '#3B82F6')}, {merged_styles.get('secondary_color', '#10B981')});
                padding: 80px 20px;
                text-align: center;
                border-radius: {merged_styles.get('border_radius', '8px')};
            }}
            
            button {{
                background: {merged_styles.get('primary_color', '#3B82F6')};
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: {merged_styles.get('border_radius', '8px')};
                cursor: pointer;
                font-size: 16px;
            }}
            
            button:hover {{
                opacity: 0.9;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            {components_html}
        </div>
        <script>
            console.log('Website built with Aleyo AI Website Builder');
        </script>
    </body>
    </html>
    """

def generate_component_html(component: Dict, styles: Dict) -> str:
    """Generate HTML for a single component"""
    comp_type = component.get("type", "")
    content = component.get("content", {})
    
    if comp_type == "hero":
        return f"""
        <div class="hero">
            <h1>{content.get('title', 'Welcome to Your Website')}</h1>
            <p>{content.get('subtitle', 'Create something amazing')}</p>
            <button>{content.get('buttonText', 'Get Started')}</button>
        </div>
        """
    
    return ""

def generate_integration_code(config: IntegrationConfig) -> str:
    """Generate HTML/JS code for the integration"""
    if config.type == "forms":
        if config.provider == "formspree":
            return f"""
            <form action="https://formspree.io/f/{config.api_key}" method="POST">
                <input type="email" name="email" placeholder="Your email" required>
                <textarea name="message" placeholder="Your message" required></textarea>
                <button type="submit">Send Message</button>
            </form>
            """
    
    elif config.type == "payment":
        if config.provider == "stripe":
            return f"""
            <script src="https://js.stripe.com/v3/"></script>
            <div id="payment-element"></div>
            <button id="payment-button">Pay Now</button>
            <script>
                const stripe = Stripe('{config.api_key}');
                // Add payment logic here
            </script>
            """
    
    elif config.type == "email":
        if config.provider == "mailchimp":
            return f"""
            <div id="mc_embed_signup">
                <form action="https://{config.settings.get('dc', 'usX')}.list-manage.com/subscribe/post" method="POST">
                    <input type="email" name="EMAIL" placeholder="Subscribe to newsletter" required>
                    <button type="submit">Subscribe</button>
                </form>
            </div>
            """
    
    elif config.type == "calendar":
        if config.provider == "calendly":
            return f"""
            <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">
            <script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript" async></script>
            <div class="calendly-inline-widget" data-url="https://calendly.com/{config.settings.get('username')}" style="min-width:320px;height:630px;"></div>
            """
    
    elif config.type == "ads":
        if config.provider == "google_ads":
            return f"""
            <script async src="https://www.googletagmanager.com/gtag/js?id={config.api_key}"></script>
            <script>
                window.dataLayer = window.dataLayer || [];
                function gtag(){{dataLayer.push(arguments);}}
                gtag('js', new Date());
                gtag('config', '{config.api_key}');
            </script>
            """
        elif config.provider == "meta_ads":
            return f"""
            <script>
                !function(f,b,e,v,n,t,s)
                {{if(f.fbq)return;n=f.fbq=function(){{n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)}};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '{config.api_key}');
                fbq('track', 'PageView');
            </script>
            """
    
    return "<!-- Integration code not available -->"

# ==================== Authentication Endpoints ====================

@app.post("/api/auth/signup", response_model=Token)
async def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    """Create a new user account with 50 free credits"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = hash_password(user_data.password)
    
    user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_password,
        credits=50,  # Free credits
        subscription_tier="free"
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "name": user.name,
            "email": user.email,
            "credits": user.credits,
            "created_at": user.created_at,
            "subscription_tier": user.subscription_tier
        }
    }

@app.post("/api/auth/login", response_model=Token)
async def login(login_data: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user and return JWT token"""
    # Find user by email
    user = db.query(User).filter(User.email == login_data.email).first()
    
    # Fix: Remove hash_password from verify_password call
    # The verify_password function should hash the input password and compare
    # with the stored hash, not double-hash the provided password
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "name": user.name,
            "email": user.email,
            "credits": user.credits,
            "created_at": user.created_at,
            "subscription_tier": user.subscription_tier
        }
    }

@app.post("/api/auth/forgot-password")
async def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Send password reset email"""
    # Find user by email
    user = db.query(User).filter(User.email == request.email).first()
    
    if not user:
        # Return success even if user not found for security
        return {"message": "If your email is registered, you will receive a password reset link"}
    
    # Generate reset token
    reset_token = secrets.token_urlsafe(32)
    reset_record = PasswordResetToken(
        token=reset_token,
        user_id=user.id,
        expires_at=datetime.utcnow() + timedelta(hours=24)
    )
    
    db.add(reset_record)
    db.commit()
    
    # In production, send email with reset link
    # For now, return token for testing
    return {
        "message": "Password reset email sent",
        "reset_token": reset_token  # Remove in production
    }

@app.post("/api/auth/reset-password")
async def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Reset password using token"""
    reset_data = db.query(PasswordResetToken).filter(
        PasswordResetToken.token == request.token,
        PasswordResetToken.expires_at > datetime.utcnow()
    ).first()
    
    if not reset_data:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    user = db.query(User).filter(User.id == reset_data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update password
    user.password_hash = hash_password(request.new_password)
    
    # Delete used token
    db.delete(reset_data)
    db.commit()
    
    return {"message": "Password reset successfully"}

@app.get("/api/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current authenticated user info"""
    return {
        "id": str(current_user.id),
        "name": current_user.name,
        "email": current_user.email,
        "credits": current_user.credits,
        "created_at": current_user.created_at,
        "subscription_tier": current_user.subscription_tier
    }

@app.post("/api/auth/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """Logout user (client-side token removal)"""
    return {"message": "Logged out successfully"}

# ==================== Credit Management Endpoints ====================

@app.get("/api/credits/balance")
async def get_credit_balance(current_user: User = Depends(get_current_user)):
    """Get current user's credit balance"""
    return {
        "credits": current_user.credits,
        "subscription_tier": current_user.subscription_tier
    }

@app.get("/api/credits/transactions")
async def get_credit_transactions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get credit transaction history"""
    transactions = db.query(CreditTransaction).filter(
        CreditTransaction.user_id == current_user.id
    ).order_by(desc(CreditTransaction.created_at)).all()
    
    return [
        {
            "id": str(tx.id),
            "amount": tx.amount,
            "type": tx.type,
            "description": tx.description,
            "created_at": tx.created_at
        }
        for tx in transactions
    ]

@app.post("/api/credits/purchase")
async def purchase_credits(
    purchase: CreditPurchase,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Purchase additional credits"""
    # Credit pricing (in cents per credit)
    credit_prices = {
        50: 2.99,
        100: 4.99,
        500: 19.99,
        1000: 34.99,
        5000: 149.99
    }
    
    # Find the closest package
    package_price = None
    for credits, price in credit_prices.items():
        if purchase.amount <= credits:
            package_price = price
            break
    
    if not package_price:
        package_price = 299.99  # Custom pricing for large amounts
    
    # In production, integrate with Stripe/PayPal here
    # For demo, just add credits
    add_credits(db, str(current_user.id), purchase.amount, f"Purchase of {purchase.amount} credits")
    
    # Refresh user data
    db.refresh(current_user)
    
    return {
        "success": True,
        "credits_added": purchase.amount,
        "total_credits": current_user.credits,
        "amount_charged": package_price,
        "payment_method": purchase.payment_method
    }

# ==================== Project Management Endpoints ====================

@app.post("/api/projects")
async def create_project(
    project_data: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new website project"""
    # Check if user has enough credits (1 credit per project)
    if not deduct_credits(db, str(current_user.id), 1):
        raise HTTPException(status_code=402, detail="Insufficient credits")
    
    project = Project(
        name=project_data.name,
        user_id=current_user.id,
        customizations=project_data.customizations
    )
    
    db.add(project)
    db.commit()
    db.refresh(project)
    
    # Add designs to project
    for design_id in project_data.designs:
        project_design = ProjectDesign(
            project_id=project.id,
            design_id=design_id
        )
        db.add(project_design)
    
    db.commit()
    
    return {
        "id": str(project.id),
        "name": project.name,
        "designs": project_data.designs,
        "customizations": project.customizations,
        "html_code": project.html_code,
        "created_at": project.created_at,
        "updated_at": project.updated_at,
        "user_id": str(project.user_id),
        "published_url": project.published_url
    }

@app.get("/api/projects")
async def get_user_projects(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all projects for current user"""
    projects = db.query(Project).filter(
        Project.user_id == current_user.id
    ).order_by(desc(Project.updated_at)).all()
    
    result = []
    for project in projects:
        # Get designs for this project
        designs = db.query(ProjectDesign).filter(
            ProjectDesign.project_id == project.id
        ).all()
        design_ids = [d.design_id for d in designs]
        
        result.append({
            "id": str(project.id),
            "name": project.name,
            "designs": design_ids,
            "customizations": project.customizations,
            "html_code": project.html_code,
            "created_at": project.created_at,
            "updated_at": project.updated_at,
            "user_id": str(project.user_id),
            "published_url": project.published_url
        })
    
    return result

@app.get("/api/projects/{project_id}")
async def get_project(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific project"""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if str(project.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Get designs for this project
    designs = db.query(ProjectDesign).filter(
        ProjectDesign.project_id == project.id
    ).all()
    design_ids = [d.design_id for d in designs]
    
    return {
        "id": str(project.id),
        "name": project.name,
        "designs": design_ids,
        "customizations": project.customizations,
        "html_code": project.html_code,
        "created_at": project.created_at,
        "updated_at": project.updated_at,
        "user_id": str(project.user_id),
        "published_url": project.published_url
    }

@app.put("/api/projects/{project_id}")
async def update_project(
    project_id: str,
    updates: ProjectUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a project"""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if str(project.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Update fields
    if updates.name:
        project.name = updates.name
    if updates.customizations:
        project.customizations = updates.customizations
    if updates.html_code:
        project.html_code = updates.html_code
    
    project.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(project)
    
    # Get designs for this project
    designs = db.query(ProjectDesign).filter(
        ProjectDesign.project_id == project.id
    ).all()
    design_ids = [d.design_id for d in designs]
    
    return {
        "id": str(project.id),
        "name": project.name,
        "designs": design_ids,
        "customizations": project.customizations,
        "html_code": project.html_code,
        "created_at": project.created_at,
        "updated_at": project.updated_at,
        "user_id": str(project.user_id),
        "published_url": project.published_url
    }

@app.delete("/api/projects/{project_id}")
async def delete_project(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a project"""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if str(project.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Access denied")
    
    db.delete(project)
    db.commit()
    
    return {"message": "Project deleted successfully"}

@app.post("/api/projects/{project_id}/publish")
async def publish_project(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Publish a website"""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if str(project.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Check if user has enough credits (5 credits to publish)
    if not deduct_credits(db, str(current_user.id), 5):
        raise HTTPException(status_code=402, detail="Insufficient credits to publish")
    
    # Generate a unique URL
    publish_url = f"https://aleyo.app/{project_id}"
    project.published_url = publish_url
    project.updated_at = datetime.utcnow()
    db.commit()
    
    return {
        "success": True,
        "published_url": publish_url,
        "message": "Website published successfully"
    }

@app.post("/api/projects/{project_id}/generate")
async def generate_website_code(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate HTML/CSS/JS code for the website"""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if str(project.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Get designs for this project
    project_designs = db.query(ProjectDesign).filter(
        ProjectDesign.project_id == project.id
    ).all()
    
    designs = []
    for pd in project_designs:
        design_template = db.query(DesignTemplate).filter(
            DesignTemplate.id == pd.design_id
        ).first()
        if design_template:
            components = db.query(DesignComponent).filter(
                DesignComponent.design_id == design_template.id
            ).order_by(DesignComponent.position).all()
            
            designs.append({
                "id": design_template.id,
                "name": design_template.name,
                "category": design_template.category,
                "layout": design_template.layout,
                "styles": design_template.styles,
                "components": [
                    {
                        "id": comp.component_id,
                        "type": comp.component_type,
                        "styles": comp.styles,
                        "content": comp.content
                    }
                    for comp in components
                ]
            })
    
    # Generate HTML
    html_code = generate_html_from_designs(designs, project.customizations or {}, project.name)
    project.html_code = html_code
    project.updated_at = datetime.utcnow()
    db.commit()
    
    return {"html_code": html_code}

# ==================== Integration Endpoints ====================

@app.post("/api/integrations/{project_id}")
async def add_integration(
    project_id: str,
    config: IntegrationConfig,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a third-party integration to a project"""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if str(project.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Access denied")
    
    integration = Integration(
        project_id=project.id,
        type=config.type,
        provider=config.provider,
        api_key=config.api_key,
        settings=config.settings
    )
    
    db.add(integration)
    db.commit()
    db.refresh(integration)
    
    # Generate integration code
    integration_code = generate_integration_code(config)
    
    return {
        "success": True,
        "integration_id": str(integration.id),
        "integration_code": integration_code
    }

@app.get("/api/integrations/{project_id}")
async def get_project_integrations(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all integrations for a project"""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if str(project.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Access denied")
    
    integrations = db.query(Integration).filter(
        Integration.project_id == project.id
    ).all()
    
    return [
        {
            "id": str(i.id),
            "project_id": str(i.project_id),
            "type": i.type,
            "provider": i.provider,
            "api_key": i.api_key,
            "settings": i.settings,
            "created_at": i.created_at
        }
        for i in integrations
    ]

@app.delete("/api/integrations/{project_id}/{integration_id}")
async def delete_integration(
    project_id: str,
    integration_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete an integration"""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if str(project.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Access denied")
    
    integration = db.query(Integration).filter(
        Integration.id == integration_id,
        Integration.project_id == project.id
    ).first()
    
    if not integration:
        raise HTTPException(status_code=404, detail="Integration not found")
    
    db.delete(integration)
    db.commit()
    
    return {"message": "Integration removed successfully"}

# ==================== Design Endpoints ====================

@app.get("/api/designs")
async def get_designs(db: Session = Depends(get_db)):
    """Get all available designs"""
    designs = db.query(DesignTemplate).all()
    result = []
    
    for design in designs:
        components = db.query(DesignComponent).filter(
            DesignComponent.design_id == design.id
        ).order_by(DesignComponent.position).all()
        
        result.append({
            "id": design.id,
            "name": design.name,
            "category": design.category,
            "layout": design.layout,
            "styles": design.styles,
            "components": [
                {
                    "id": comp.component_id,
                    "type": comp.component_type,
                    "styles": comp.styles,
                    "content": comp.content
                }
                for comp in components
            ]
        })
    
    return result

@app.get("/api/designs/{design_id}")
async def get_design(design_id: str, db: Session = Depends(get_db)):
    """Get specific design"""
    design = db.query(DesignTemplate).filter(DesignTemplate.id == design_id).first()
    if not design:
        raise HTTPException(status_code=404, detail="Design not found")
    
    components = db.query(DesignComponent).filter(
        DesignComponent.design_id == design.id
    ).order_by(DesignComponent.position).all()
    
    return {
        "id": design.id,
        "name": design.name,
        "category": design.category,
        "layout": design.layout,
        "styles": design.styles,
        "components": [
            {
                "id": comp.component_id,
                "type": comp.component_type,
                "styles": comp.styles,
                "content": comp.content
            }
            for comp in components
        ]
    }

@app.post("/api/preview")
async def preview_website(design_ids: List[str], db: Session = Depends(get_db)):
    """Generate preview of merged designs"""
    merged = {
        "layout": {},
        "styles": {},
        "components": []
    }
    
    for design_id in design_ids:
        design = db.query(DesignTemplate).filter(DesignTemplate.id == design_id).first()
        if design:
            if design.layout:
                merged["layout"].update(design.layout)
            
            if design.styles:
                for key, value in design.styles.items():
                    merged["styles"][key] = value
            
            components = db.query(DesignComponent).filter(
                DesignComponent.design_id == design.id
            ).order_by(DesignComponent.position).all()
            
            for comp in components:
                merged["components"].append({
                    "id": comp.component_id,
                    "type": comp.component_type,
                    "styles": comp.styles,
                    "content": comp.content
                })
    
    # Remove duplicate components by id
    seen = set()
    unique_components = []
    for comp in merged["components"]:
        if comp["id"] not in seen:
            seen.add(comp["id"])
            unique_components.append(comp)
    merged["components"] = unique_components
    
    return merged

# ==================== WebSocket for Real-time ====================

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    
    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
    
    async def send_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message["type"] == "voice_command":
                response = await process_voice_command(message["command"], user_id)
                await manager.send_message(json.dumps(response), websocket)
            elif message["type"] == "selection":
                response = await process_selection(message["selection"], user_id)
                await manager.send_message(json.dumps(response), websocket)
            elif message["type"] == "merge_designs":
                response = await merge_designs(message["design_ids"], user_id)
                await manager.send_message(json.dumps(response), websocket)
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)

async def process_voice_command(command: str, user_id: str):
    """Process voice commands using AI"""
    commands = command.lower()
    
    if "change color" in commands or "blue" in commands:
        return {"action": "update_style", "property": "primary_color", "value": "#3B82F6"}
    elif "green" in commands:
        return {"action": "update_style", "property": "primary_color", "value": "#10B981"}
    elif "purple" in commands:
        return {"action": "update_style", "property": "primary_color", "value": "#8B5CF6"}
    elif "add section" in commands or "add component" in commands:
        return {"action": "add_component", "type": "features", "position": "after_hero"}
    elif "change layout" in commands:
        return {"action": "change_layout", "layout_type": "grid"}
    elif "add contact form" in commands:
        return {"action": "add_component", "type": "contact", "position": "end"}
    elif "add pricing" in commands:
        return {"action": "add_component", "type": "pricing", "position": "end"}
    else:
        return {
            "action": "interpret",
            "command": command,
            "suggestion": "I'll help you modify your website. Try saying 'change color to blue' or 'add contact form'"
        }

async def process_selection(selection: Dict, user_id: str):
    """Process click selections from UI"""
    selection_type = selection.get("type")
    
    if selection_type == "design_template":
        template_id = selection.get("template_id")
        # In a real implementation, fetch from DB
        return {"action": "apply_template", "template": {"id": template_id}}
    
    elif selection_type == "style_option":
        style_property = selection.get("property")
        style_value = selection.get("value")
        return {"action": "update_style", "property": style_property, "value": style_value}
    
    elif selection_type == "component":
        component_type = selection.get("component_type")
        return {"action": "add_component", "type": component_type}
    
    return {"error": "Invalid selection"}

async def merge_designs(design_ids: List[str], user_id: str):
    """Merge multiple designs together"""
    return {"action": "merge_complete", "merged_design": {"design_ids": design_ids}}

# ==================== Analytics Endpoints ====================

@app.get("/api/analytics/usage")
async def get_usage_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user usage analytics"""
    # Get user's projects
    user_projects = db.query(Project).filter(Project.user_id == current_user.id).all()
    
    # Get credit transactions
    transactions = db.query(CreditTransaction).filter(
        CreditTransaction.user_id == current_user.id
    ).all()
    
    return {
        "total_projects": len(user_projects),
        "published_projects": len([p for p in user_projects if p.published_url]),
        "total_credits_used": sum(abs(tx.amount) for tx in transactions if tx.type == "usage"),
        "total_credits_purchased": sum(tx.amount for tx in transactions if tx.type == "purchase"),
        "recent_projects": [
            {
                "id": str(p.id),
                "name": p.name,
                "created_at": p.created_at
            }
            for p in user_projects[:5]
        ],
        "credit_transactions": [
            {
                "id": str(tx.id),
                "amount": tx.amount,
                "type": tx.type,
                "description": tx.description,
                "created_at": tx.created_at
            }
            for tx in transactions[:10]
        ]
    }

# ==================== Health Check ====================

@app.get("/api/health")
async def health_check(db: Session = Depends(get_db)):
    """Health check endpoint"""
    user_count = db.query(User).count()
    project_count = db.query(Project).count()
    design_count = db.query(DesignTemplate).count()
    
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "users": user_count,
        "projects": project_count,
        "designs": design_count
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
# Vercel / ASGI handler alias
handler = app