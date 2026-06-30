# app.py - Complete rewritten file
from fastapi import FastAPI, HTTPException, Request, WebSocket, WebSocketDisconnect, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Dict, Optional, Any
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from sqlalchemy import desc, func, text
import asyncio
import json
import uuid
import secrets
from enum import Enum
from passlib.context import CryptContext
from slowapi import Limiter
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse
from jose import jwt, JWTError
from fastapi import Query
import re
import logging
import bcrypt
import os

# Import routers
from seed_integrations import router as integrations_router

import seed_integrations
# Override the dependency in seed_integrations after get_current_user is defined
# This ensures that the router in seed_integrations uses the correct authentication

# Import database utilities
from database import get_db, init_db

# Import models
from models import (
    User, Project, CreditTransaction, Integration, 
    Design, Template, Component, AnalyticsEvent, Slug, project_designs
)

# ==================== App Initialization ====================

app = FastAPI(title="Aleyo AI Website Builder API")

# Setup logging
logger = logging.getLogger(__name__)

# ==================== Rate Limiting ====================

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

@app.exception_handler(RateLimitExceeded)
async def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(status_code=429, content={"detail": "Login attempts exceeded. Please try again later."})

# ==================== Security ====================

security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# ==================== CORS Configuration ====================

ALLOWED_ORIGINS = [
    "http://127.0.0.1:4000",
    "http://127.0.0.1:8000",
    "http://localhost:3000",
    "http://localhost:3001",
]

_frontend_url = os.getenv("FRONTEND_URL", "")
if _frontend_url:
    ALLOWED_ORIGINS.append(_frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== Include Routers ====================

app.include_router(integrations_router, prefix="/api")

# ==================== Startup Event ====================

@app.on_event("startup")
async def startup_event():
    init_db()
    logger.info("Application started successfully")

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

    class Config:
        from_attributes = True

class Token(BaseModel):
    status: str
    access_token: str
    token_type: str
    user: UserResponse
    redirect: Optional[str] = None

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class DesignComponentModel(BaseModel):
    id: str
    type: str
    styles: Dict[str, Any]
    content: Dict[str, Any]

class DesignTemplateModel(BaseModel):
    id: str
    name: str
    category: str
    layout: Dict[str, Any]
    styles: Dict[str, Any]
    components: List[DesignComponentModel]

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
    
class WebsitePublishRequest(BaseModel):
    id: str
    name: str
    slug: str
    components: List[Dict[str, Any]] = []
    textElements: List[Dict[str, Any]] = []
    imageElements: List[Dict[str, Any]] = []
    uploadedImages: List[Dict[str, Any]] = []
    styles: Dict[str, Any] = {}
    lastEdited: str
    type: str = "custom"
    status: str = "published"
    publishedAt: str
    publishedUrl: str

class ProjectCreate(BaseModel):
    name: str
    designs: List[str] = []
    customizations: Dict[str, Any] = {}

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    customizations: Optional[Dict[str, Any]] = None
    html_code: Optional[str] = None

class IntegrationConfig(BaseModel):
    type: str
    provider: str
    api_key: Optional[str] = None
    settings: Dict[str, Any] = {}

class CreditPurchase(BaseModel):
    amount: int
    payment_method: str

class IntegrationConnectRequest(BaseModel):
    project_id: str
    config_data: Dict[str, Any] = {}

# ==================== Helper Functions ====================

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

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
    except JWTError:
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

# Override the dependency in seed_integrations after get_current_user has been defined
seed_integrations.get_current_user_dependency = get_current_user

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))

def deduct_credits(db: Session, user_id: str, amount: int) -> bool:
    user = db.query(User).filter(User.id == user_id).first()
    if user and user.credits_balance >= amount:
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

def generate_html_from_designs(designs: List[Dict], customizations: Dict, project_name: str) -> str:
    """Generate HTML from merged designs"""
    merged_styles = {}
    merged_components = []
    
    for design in designs:
        for key, value in design.get("styles", {}).items():
            merged_styles[key] = value
        merged_components.extend(design.get("components", []))
    
    if customizations and "styles" in customizations:
        merged_styles.update(customizations["styles"])
    
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
            </script>
            """
    
    elif config.type == "email":
        if config.provider == "mailchimp":
            dc = config.settings.get('dc', 'usX')
            return f"""
            <div id="mc_embed_signup">
                <form action="https://{dc}.list-manage.com/subscribe/post" method="POST">
                    <input type="email" name="EMAIL" placeholder="Subscribe to newsletter" required>
                    <button type="submit">Subscribe</button>
                </form>
            </div>
            """
    
    elif config.type == "calendar":
        if config.provider == "calendly":
            username = config.settings.get('username', '')
            return f"""
            <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">
            <script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript" async></script>
            <div class="calendly-inline-widget" data-url="https://calendly.com/{username}" style="min-width:320px;height:630px;"></div>
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
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(user_data.password)

    user = User(
        id=str(uuid.uuid4()),
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_password,
        credits_balance=50,
        subscription_tier="free"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    access_token = create_access_token(data={"sub": str(user.id)})
    return {
        "status": "success",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "name": user.name,
            "email": user.email,
            "credits": user.credits_balance,
            "created_at": user.created_at,
            "subscription_tier": user.subscription_tier
        }
    }

@app.post("/api/auth/login", response_model=Token)
@limiter.limit("5 per minute")
async def login(request: Request, login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()

    if not user or not verify_password(login_data.password, user.password_hash):
        logger.warning(f"Failed login attempt for email: {login_data.email}")
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    user.last_login = datetime.now(timezone.utc)
    db.commit()

    access_token = create_access_token(data={"sub": str(user.id)})
    return {
        "status": "success",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "name": user.name,
            "email": user.email,
            "credits": user.credits_balance,
            "created_at": user.created_at.isoformat(),
            "subscription_tier": user.subscription_tier
        },
        "redirect": "/dashboard"
    }

@app.post("/api/auth/forgot-password")
async def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    
    if not user:
        return {"message": "If your email is registered, you will receive a password reset link"}
    
    reset_token = secrets.token_urlsafe(32)
    user.password_reset_token = reset_token
    user.password_reset_expires = datetime.now(timezone.utc) + timedelta(hours=24)
    db.commit()
    
    return {
        "message": "Password reset email sent",
        "reset_token": reset_token
    }

@app.post("/api/auth/reset-password")
async def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        User.password_reset_token == request.token,
        User.password_reset_expires > datetime.now(timezone.utc)
    ).first()
    
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    user.password_hash = hash_password(request.new_password)
    user.password_reset_token = None
    user.password_reset_expires = None
    db.commit()
    
    return {"message": "Password reset successfully"}

@app.get("/api/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "name": current_user.name,
        "email": current_user.email,
        "credits": current_user.credits_balance,
        "created_at": current_user.created_at,
        "subscription_tier": current_user.subscription_tier
    }

@app.post("/api/auth/logout")
async def logout(current_user: User = Depends(get_current_user)):
    return {"message": "Logged out successfully"}

# ==================== Credit Management Endpoints ====================

@app.get("/api/credits/balance")
async def get_credit_balance(current_user: User = Depends(get_current_user)):
    return {
        "credits": current_user.credits_balance,
        "subscription_tier": current_user.subscription_tier
    }

@app.get("/api/credits/transactions")
async def get_credit_transactions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
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
    credit_prices = {
        50: 2.99,
        100: 4.99,
        500: 19.99,
        1000: 34.99,
        5000: 149.99
    }
    
    package_price = None
    for credits, price in credit_prices.items():
        if purchase.amount <= credits:
            package_price = price
            break
    
    if not package_price:
        package_price = 299.99
    
    add_credits(db, str(current_user.id), purchase.amount, f"Purchase of {purchase.amount} credits")
    db.refresh(current_user)
    
    return {
        "success": True,
        "credits_added": purchase.amount,
        "total_credits": current_user.credits_balance,
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
    if not deduct_credits(db, str(current_user.id), 1):
        raise HTTPException(status_code=402, detail="Insufficient credits")
    
    global_styles = project_data.customizations.get("styles", {}) if project_data.customizations else {}
    layout_config = project_data.customizations.get("layout", {}) if project_data.customizations else {}
    
    project = Project(
        id=str(uuid.uuid4()),
        name=project_data.name,
        user_id=current_user.id,
        global_styles=global_styles,
        layout_config=layout_config
    )
    
    db.add(project)
    db.commit()
    db.refresh(project)
    
    for design_id in project_data.designs:
        stmt = project_designs.insert().values(
            project_id=project.id,
            design_id=design_id,
            merged_order=0
        )
        db.execute(stmt)
    
    db.commit()
    
    result = db.execute(
        project_designs.select().where(project_designs.c.project_id == project.id)
    )
    design_ids = [row.design_id for row in result]
    
    return {
        "id": str(project.id),
        "name": project.name,
        "designs": design_ids,
        "customizations": {
            "styles": project.global_styles,
            "layout": project.layout_config
        },
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
    projects = db.query(Project).filter(
        Project.user_id == current_user.id
    ).order_by(desc(Project.updated_at)).all()
    
    result = []
    for project in projects:
        result_designs = db.execute(
            project_designs.select().where(project_designs.c.project_id == project.id)
        )
        design_ids = [row.design_id for row in result_designs]
        
        result.append({
            "id": str(project.id),
            "name": project.name,
            "designs": design_ids,
            "customizations": {
                "styles": project.global_styles,
                "layout": project.layout_config
            },
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
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if str(project.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Access denied")
    
    result = db.execute(
        project_designs.select().where(project_designs.c.project_id == project.id)
    )
    design_ids = [row.design_id for row in result]
    
    return {
        "id": str(project.id),
        "name": project.name,
        "designs": design_ids,
        "customizations": {
            "styles": project.global_styles,
            "layout": project.layout_config
        },
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
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if str(project.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Access denied")
    
    if updates.name:
        project.name = updates.name
    if updates.customizations:
        project.global_styles = updates.customizations.get("styles", project.global_styles)
        project.layout_config = updates.customizations.get("layout", project.layout_config)
    if updates.html_code:
        project.html_code = updates.html_code
    
    project.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(project)
    
    result = db.execute(
        project_designs.select().where(project_designs.c.project_id == project.id)
    )
    design_ids = [row.design_id for row in result]
    
    return {
        "id": str(project.id),
        "name": project.name,
        "designs": design_ids,
        "customizations": {
            "styles": project.global_styles,
            "layout": project.layout_config
        },
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
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if str(project.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Access denied")
    
    if not deduct_credits(db, str(current_user.id), 5):
        raise HTTPException(status_code=402, detail="Insufficient credits to publish")
    
    slug = re.sub(r'[^a-z0-9-]', '', project.name.lower().replace(' ', '-'))
    if not slug:
        slug = f"project-{project.id[:8]}"
    
    base_slug = slug
    counter = 1
    while True:
        existing_slug = db.query(Slug).filter(Slug.slug == slug).first()
        if existing_slug:
            slug = f"{base_slug}-{counter}"
            counter += 1
            continue
        
        existing_project = db.query(Project).filter(
            Project.published_url.like(f"%/p/{slug}%")
        ).first()
        if existing_project and existing_project.id != project.id:
            slug = f"{base_slug}-{counter}"
            counter += 1
            continue
        
        break
    
    publish_url = f"{os.getenv('FRONTEND_URL', 'https://aleyo.app')}/p/{slug}"
    project.published_url = publish_url
    project.published_at = datetime.now(timezone.utc)
    project.updated_at = datetime.now(timezone.utc)
    
    slug_entry = db.query(Slug).filter(Slug.project_id == project.id).first()
    if slug_entry:
        slug_entry.slug = slug
    else:
        slug_entry = Slug(slug=slug, project_id=project.id)
        db.add(slug_entry)
    
    db.commit()
    
    return {
        "success": True,
        "published_url": publish_url,
        "slug": slug,
        "message": "Website published successfully"
    }

@app.post("/api/projects/{project_id}/generate")
async def generate_website_code(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if str(project.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Access denied")
    
    result = db.execute(
        project_designs.select().where(project_designs.c.project_id == project.id)
    )
    design_ids = [row.design_id for row in result]
    
    designs = []
    for design_id in design_ids:
        design = db.query(Design).filter(Design.id == design_id).first()
        if design:
            components = db.query(Component).filter(
                Component.design_id == design.id
            ).order_by(Component.order).all()
            
            designs.append({
                "id": design.id,
                "name": design.name,
                "category": design.category,
                "layout": design.layout,
                "styles": design.styles,
                "components": [
                    {
                        "id": comp.id,
                        "type": comp.type,
                        "styles": comp.styles,
                        "content": comp.content
                    }
                    for comp in components
                ]
            })
    
    customizations = {
        "styles": project.global_styles or {},
        "layout": project.layout_config or {}
    }
    
    html_code = generate_html_from_designs(designs, customizations, project.name)
    project.html_code = html_code
    project.updated_at = datetime.now(timezone.utc)
    db.commit()
    
    return {"html_code": html_code}

@app.post("/api/websites/publish")
async def publish_website(
    website_data: WebsitePublishRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        project = db.query(Project).filter(Project.id == website_data.id).first()
        
        customizations = {
            "components": website_data.components,
            "textElements": website_data.textElements,
            "imageElements": website_data.imageElements,
            "uploadedImages": website_data.uploadedImages,
            "styles": website_data.styles,
            "publishedAt": website_data.publishedAt,
        }
        
        if project:
            project.name = website_data.name
            project.global_styles = website_data.styles
            project.html_code = generate_html_from_designs([], customizations, website_data.name)
            project.published_url = website_data.publishedUrl
            project.published_at = datetime.now(timezone.utc)
            project.updated_at = datetime.now(timezone.utc)
        else:
            project = Project(
                id=website_data.id,
                name=website_data.name,
                user_id=current_user.id,
                global_styles=website_data.styles,
                html_code=generate_html_from_designs([], customizations, website_data.name),
                published_url=website_data.publishedUrl,
                published_at=datetime.now(timezone.utc)
            )
            db.add(project)
        
        slug = website_data.slug
        if not slug:
            slug = re.sub(r'[^a-z0-9-]', '', website_data.name.lower().replace(' ', '-'))
        
        base_slug = slug
        counter = 1
        while True:
            existing_slug = db.query(Slug).filter(Slug.slug == slug).first()
            if existing_slug and existing_slug.project_id != project.id:
                slug = f"{base_slug}-{counter}"
                counter += 1
                continue
            break
        
        slug_entry = db.query(Slug).filter(Slug.project_id == project.id).first()
        if slug_entry:
            slug_entry.slug = slug
        else:
            slug_entry = Slug(slug=slug, project_id=project.id)
            db.add(slug_entry)
        
        db.commit()
        db.refresh(project)
        
        return {
            "success": True,
            "project_id": str(project.id),
            "published_url": project.published_url,
            "message": "Website published successfully"
        }
        
    except Exception as e:
        logger.error(f"Error publishing website: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/websites/check-slug")
async def check_slug_uniqueness(
    slug: str = Query(..., min_length=3, max_length=50, regex="^[a-z0-9-]+$"),
    exclude_id: Optional[str] = Query(None, description="Project ID to exclude from check"),
    db: Session = Depends(get_db)
):
    if not re.match(r'^[a-z0-9-]+$', slug):
        return {"isUnique": False, "message": "Slug can only contain lowercase letters, numbers, and hyphens"}
    
    if len(slug) < 3 or len(slug) > 50:
        return {"isUnique": False, "message": "Slug must be between 3 and 50 characters"}
    
    slugs_query = db.query(Slug).filter(Slug.slug == slug)
    if exclude_id:
        slugs_query = slugs_query.filter(Slug.project_id != exclude_id)
    
    if slugs_query.first():
        return {
            "isUnique": False, 
            "message": f"The URL path '/{slug}' is already taken. Please choose another one."
        }
    
    projects_query = db.query(Project)
    if exclude_id:
        projects_query = projects_query.filter(Project.id != exclude_id)
    
    projects = projects_query.all()
    
    for project in projects:
        if project.published_url:
            url_parts = project.published_url.rstrip('/').split('/')
            if url_parts and url_parts[-1] == slug:
                return {
                    "isUnique": False, 
                    "message": f"The URL path '/{slug}' is already taken. Please choose another one."
                }
            
            if f"/p/{slug}" in project.published_url or f"/{slug}" in project.published_url:
                return {
                    "isUnique": False, 
                    "message": f"The URL path '/{slug}' is already taken. Please choose another one."
                }
    
    return {"isUnique": True, "message": "Slug is available!"}

# ==================== Integration Endpoints ====================

@app.post("/api/integrations/{project_id}")
async def add_integration(
    project_id: str,
    config: IntegrationConfig,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if str(project.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Access denied")
    
    integration = Integration(
        id=str(uuid.uuid4()),
        project_id=project.id,
        type=config.type,
        provider=config.provider,
        api_key=config.api_key,
        settings=config.settings
    )
    
    db.add(integration)
    db.commit()
    db.refresh(integration)
    
    integration_code = generate_integration_code(config)
    
    return {
        "success": True,
        "integration_id": str(integration.id),
        "integration_code": integration_code
    }

@app.get("/api/integrations")
async def get_user_integrations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all integrations for the current user's projects"""
    user_projects = db.query(Project).filter(Project.user_id == current_user.id).all()
    project_ids = [p.id for p in user_projects]
    
    if not project_ids:
        return []
    
    integrations = db.query(Integration).filter(
        Integration.project_id.in_(project_ids)
    ).all()
    
    return [
        {
            "id": str(i.id),
            "project_id": str(i.project_id),
            "type": i.type,
            "provider": i.provider,
            "api_key": i.api_key,
            "settings": i.settings,
            "is_active": i.is_active,
            "created_at": i.created_at,
            "updated_at": i.updated_at
        }
        for i in integrations
    ]

@app.get("/api/integrations/{project_id}")
async def get_project_integrations(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
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

@app.post("/api/integrations/{integration_id}/connect")
async def connect_integration(
    integration_id: str,
    request: IntegrationConnectRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Connect an integration to a project"""
    project = db.query(Project).filter(
        Project.id == request.project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Check if integration already exists for this project
    existing = db.query(Integration).filter(
        Integration.project_id == request.project_id,
        Integration.provider == integration_id
    ).first()
    
    if existing:
        # Update existing integration
        existing.api_key = request.config_data.get("api_key")
        existing.settings = {**existing.settings, **request.config_data.get("settings", {})}
        existing.is_active = request.config_data.get("is_active", True)
        existing.updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(existing)
        return {
            "success": True,
            "message": "Integration updated successfully",
            "integration_id": str(existing.id)
        }
    
    # Get the system integration to copy settings
    system_integration = db.query(Integration).filter(
        Integration.provider == integration_id,
        Integration.project_id == "system"
    ).first()
    
    if not system_integration:
        raise HTTPException(status_code=404, detail="Integration not found")
    
    # Create new integration for the user's project
    integration = Integration(
        id=str(uuid.uuid4()),
        project_id=request.project_id,
        type=system_integration.type,
        provider=integration_id,
        api_key=request.config_data.get("api_key"),
        settings={
            **system_integration.settings,
            **request.config_data.get("settings", {})
        },
        is_active=request.config_data.get("is_active", True)
    )
    
    db.add(integration)
    db.commit()
    db.refresh(integration)
    
    return {
        "success": True,
        "message": "Integration connected successfully",
        "integration_id": str(integration.id)
    }

@app.delete("/api/integrations/{integration_id}")
async def disconnect_integration(
    integration_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Disconnect an integration"""
    integration = db.query(Integration).join(
        Project, Integration.project_id == Project.id
    ).filter(
        Integration.id == integration_id,
        Project.user_id == current_user.id
    ).first()
    
    if not integration:
        raise HTTPException(status_code=404, detail="Integration not found")
    
    db.delete(integration)
    db.commit()
    
    return {
        "success": True,
        "message": "Integration disconnected successfully"
    }

@app.delete("/api/integrations/{project_id}/{integration_id}")
async def delete_integration(
    project_id: str,
    integration_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
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

@app.post("/api/integrations/seed")
async def seed_integrations_endpoint(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Seed integrations (admin only)"""
    if current_user.email != "admin@aleyo.app":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    from seed_integrations import seed_integrations as seed
    success = seed(db)
    return {"success": success, "message": "Integrations seeded successfully"}

# ==================== Design Endpoints ====================

@app.get("/api/designs")
async def get_designs(db: Session = Depends(get_db)):
    designs = db.query(Design).all()
    result = []
    
    for design in designs:
        components = db.query(Component).filter(
            Component.design_id == design.id
        ).order_by(Component.order).all()
        
        result.append({
            "id": design.id,
            "name": design.name,
            "category": design.category,
            "layout": design.layout,
            "styles": design.styles,
            "components": [
                {
                    "id": comp.id,
                    "type": comp.type,
                    "styles": comp.styles,
                    "content": comp.content
                }
                for comp in components
            ]
        })
    
    return result

@app.get("/api/designs/all")
async def get_all_designs_for_frontend(db: Session = Depends(get_db)):
    designs = db.query(Design).all()
    
    if not designs:
        return []
    
    result = []
    for design in designs:
        components = db.query(Component).filter(
            Component.design_id == design.id
        ).order_by(Component.order).all()
        
        styles = design.styles or {}
        
        template = {
            "id": str(design.id),
            "name": design.name,
            "category": design.category or "business",
            "description": getattr(design, 'description', None) or f"{design.name} - Professional template",
            "image": getattr(design, 'image_url', None) or f"https://placehold.co/600x400/{styles.get('primaryColor', '4F6EF7')[1:] if styles.get('primaryColor') else '4F6EF7'}/FFFFFF?text={design.name.replace(' ', '+')}",
            "rating": getattr(design, 'rating', 4.5),
            "reviews": getattr(design, 'reviews', 0),
            "features": getattr(design, 'features', ["Responsive Design", "Modern Layout", "Easy Customization"]),
            "popular": getattr(design, 'popular', False),
            "icon": getattr(design, 'icon', "DesignServices"),
            "color": styles.get("primaryColor", "#4F6EF7") if styles else "#4F6EF7",
            "colors": {
                "primaryColor": styles.get("primaryColor", "#4F6EF7") if styles else "#4F6EF7",
                "secondaryColor": styles.get("secondaryColor", "#2DBCB6") if styles else "#2DBCB6",
                "accentColor": styles.get("accentColor", "#3ED67C") if styles else "#3ED67C",
                "backgroundColor": styles.get("backgroundColor", "#FAF9F7") if styles else "#FAF9F7",
                "textColor": styles.get("textColor", "#2C2C2C") if styles else "#2C2C2C",
                "headingColor": styles.get("headingColor", "#1A1A1A") if styles else "#1A1A1A",
                "heroTitle": styles.get("heroTitle", design.name) if styles else design.name,
                "heroSubtitle": styles.get("heroSubtitle", "Create something amazing") if styles else "Create something amazing",
            },
            "components": [
                {
                    "id": str(comp.id),
                    "type": comp.type,
                    "styles": comp.styles,
                    "content": comp.content
                }
                for comp in components
            ]
        }
        result.append(template)
    
    return result

@app.get("/api/designs/{design_id}")
async def get_design(design_id: str, db: Session = Depends(get_db)):
    design = db.query(Design).filter(Design.id == design_id).first()
    if not design:
        raise HTTPException(status_code=404, detail="Design not found")
    
    components = db.query(Component).filter(
        Component.design_id == design.id
    ).order_by(Component.order).all()
    
    return {
        "id": design.id,
        "name": design.name,
        "category": design.category,
        "description": getattr(design, 'description', None),
        "image_url": getattr(design, 'image_url', None),
        "rating": getattr(design, 'rating', None),
        "reviews": getattr(design, 'reviews', None),
        "features": getattr(design, 'features', None),
        "popular": getattr(design, 'popular', None),
        "icon": getattr(design, 'icon', None),
        "layout": design.layout,
        "styles": design.styles,
        "components": [
            {
                "id": comp.id,
                "type": comp.type,
                "styles": comp.styles,
                "content": comp.content
            }
            for comp in components
        ]
    }

@app.post("/api/designs")
async def create_design(
    design_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    design = Design(
        id=str(uuid.uuid4()),
        name=design_data.get("name"),
        category=design_data.get("category", "business"),
        description=design_data.get("description"),
        image_url=design_data.get("image_url"),
        rating=design_data.get("rating", 4.5),
        reviews=design_data.get("reviews", 0),
        features=design_data.get("features", ["Responsive", "Modern"]),
        popular=design_data.get("popular", False),
        icon=design_data.get("icon", "DesignServices"),
        styles=design_data.get("styles", {}),
        layout=design_data.get("layout", {}),
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    
    db.add(design)
    db.commit()
    db.refresh(design)
    
    return {"message": "Design created successfully", "id": design.id}

@app.put("/api/designs/{design_id}")
async def update_design(
    design_id: str,
    design_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    design = db.query(Design).filter(Design.id == design_id).first()
    if not design:
        raise HTTPException(status_code=404, detail="Design not found")
    
    for key, value in design_data.items():
        if hasattr(design, key) and key not in ["id", "created_at", "updated_at"]:
            setattr(design, key, value)
    
    design.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(design)
    
    return {"message": "Design updated successfully"}

@app.delete("/api/designs/{design_id}")
async def delete_design(
    design_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    design = db.query(Design).filter(Design.id == design_id).first()
    if not design:
        raise HTTPException(status_code=404, detail="Design not found")
    
    db.delete(design)
    db.commit()
    
    return {"message": "Design deleted successfully"}

@app.post("/api/designs/{design_id}/components")
async def add_component_to_design(
    design_id: str,
    component_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    design = db.query(Design).filter(Design.id == design_id).first()
    if not design:
        raise HTTPException(status_code=404, detail="Design not found")
    
    max_order = db.query(func.max(Component.order)).filter(
        Component.design_id == design_id
    ).scalar() or 0
    
    component = Component(
        id=str(uuid.uuid4()),
        design_id=design_id,
        type=component_data.get("type", "section"),
        styles=component_data.get("styles", {}),
        content=component_data.get("content", {}),
        order=max_order + 1
    )
    
    db.add(component)
    db.commit()
    db.refresh(component)
    
    return {"message": "Component added successfully", "id": component.id}

@app.put("/api/designs/{design_id}/components/{component_id}")
async def update_component(
    design_id: str,
    component_id: str,
    component_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    component = db.query(Component).filter(
        Component.id == component_id,
        Component.design_id == design_id
    ).first()
    
    if not component:
        raise HTTPException(status_code=404, detail="Component not found")
    
    if "type" in component_data:
        component.type = component_data["type"]
    if "styles" in component_data:
        component.styles = component_data["styles"]
    if "content" in component_data:
        component.content = component_data["content"]
    if "order" in component_data:
        component.order = component_data["order"]
    
    db.commit()
    db.refresh(component)
    
    return {"message": "Component updated successfully"}

@app.delete("/api/designs/{design_id}/components/{component_id}")
async def delete_component(
    design_id: str,
    component_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    component = db.query(Component).filter(
        Component.id == component_id,
        Component.design_id == design_id
    ).first()
    
    if not component:
        raise HTTPException(status_code=404, detail="Component not found")
    
    db.delete(component)
    db.commit()
    
    return {"message": "Component deleted successfully"}

@app.post("/api/preview")
async def preview_website(design_ids: List[str], db: Session = Depends(get_db)):
    merged = {
        "layout": {},
        "styles": {},
        "components": []
    }
    
    for design_id in design_ids:
        design = db.query(Design).filter(Design.id == design_id).first()
        if design:
            if design.layout:
                merged["layout"].update(design.layout)
            
            if design.styles:
                for key, value in design.styles.items():
                    merged["styles"][key] = value
            
            components = db.query(Component).filter(
                Component.design_id == design.id
            ).order_by(Component.order).all()
            
            for comp in components:
                merged["components"].append({
                    "id": comp.id,
                    "type": comp.type,
                    "styles": comp.styles,
                    "content": comp.content
                })
    
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
        if websocket in self.active_connections:
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
                response = await merge_designs_ws(message["design_ids"], user_id)
                await manager.send_message(json.dumps(response), websocket)
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)

async def process_voice_command(command: str, user_id: str):
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
    selection_type = selection.get("type")
    
    if selection_type == "design_template":
        template_id = selection.get("template_id")
        return {"action": "apply_template", "template": {"id": template_id}}
    
    elif selection_type == "style_option":
        style_property = selection.get("property")
        style_value = selection.get("value")
        return {"action": "update_style", "property": style_property, "value": style_value}
    
    elif selection_type == "component":
        component_type = selection.get("component_type")
        return {"action": "add_component", "type": component_type}
    
    return {"error": "Invalid selection"}

async def merge_designs_ws(design_ids: List[str], user_id: str):
    return {"action": "merge_complete", "merged_design": {"design_ids": design_ids}}

# ==================== Analytics Endpoints ====================

@app.get("/api/analytics/usage")
async def get_usage_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_projects = db.query(Project).filter(Project.user_id == current_user.id).all()
    
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
    try:
        user_count = db.query(User).count()
        project_count = db.query(Project).count()
        design_count = db.query(Design).count()
        
        return {
            "status": "healthy",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "users": user_count,
            "projects": project_count,
            "designs": design_count
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

# ==================== Main Entry Point ====================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

# Vercel / ASGI handler alias
handler = app