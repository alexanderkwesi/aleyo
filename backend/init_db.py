from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from models import Base, User, SubscriptionPlan, SubscriptionTier, DesignCategory, Design
import os
from datetime import datetime

# Database URL (adjust for your database)
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:superpassword@localhost:5414/aleyo')
# For PostgreSQL:
# DATABASE_URL = 'postgresql://user:password@localhost/aleyo'

def init_database():
    """Initialize the database with tables and seed data"""
    
    # Create engine
    engine = create_engine(DATABASE_URL, echo=True)
    
    # Create all tables
    Base.metadata.create_all(engine)
    
    # Create session
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    
    try:
        # Seed subscription plans
        subscription_plans = [
            SubscriptionPlan(
                id="plan_free",
                name="Free",
                tier=SubscriptionTier.FREE,
                description="Perfect for getting started",
                price_monthly=0,
                price_yearly=0,
                monthly_credits=50,
                additional_credit_price=0.05,
                max_projects=1,
                max_custom_domains=0,
                team_members=1,
                priority_support=False,
                custom_integrations=False,
                white_label=False,
                api_access=False,
                features={
                    "basic_integrations": True,
                    "email_support": True,
                    "community_access": True
                }
            ),
            SubscriptionPlan(
                id="plan_starter",
                name="Starter",
                tier=SubscriptionTier.STARTER,
                description="For freelancers and small businesses",
                price_monthly=19,
                price_yearly=190,
                monthly_credits=500,
                additional_credit_price=0.04,
                max_projects=5,
                max_custom_domains=1,
                team_members=1,
                priority_support=False,
                custom_integrations=True,
                white_label=False,
                api_access=False,
                features={
                    "all_integrations": True,
                    "priority_email_support": True,
                    "custom_domains": True,
                    "analytics": True
                }
            ),
            SubscriptionPlan(
                id="plan_pro",
                name="Pro",
                tier=SubscriptionTier.PRO,
                description="For growing businesses",
                price_monthly=49,
                price_yearly=490,
                monthly_credits=2000,
                additional_credit_price=0.03,
                max_projects=999999,
                max_custom_domains=10,
                team_members=5,
                priority_support=True,
                custom_integrations=True,
                white_label=False,
                api_access=True,
                features={
                    "all_integrations": True,
                    "priority_24_7_support": True,
                    "team_collaboration": True,
                    "api_access": True,
                    "advanced_analytics": True,
                    "custom_integrations": True
                }
            ),
            SubscriptionPlan(
                id="plan_enterprise",
                name="Enterprise",
                tier=SubscriptionTier.ENTERPRISE,
                description="For large organizations",
                price_monthly=199,
                price_yearly=1990,
                monthly_credits=10000,
                additional_credit_price=0.02,
                max_projects=999999,
                max_custom_domains=999999,
                team_members=999999,
                priority_support=True,
                custom_integrations=True,
                white_label=True,
                api_access=True,
                features={
                    "all_features": True,
                    "dedicated_account_manager": True,
                    "sla_guarantee": True,
                    "custom_deployment": True,
                    "white_label": True,
                    "unlimited_everything": True
                }
            )
        ]
        
        # Add subscription plans if they don't exist
        for plan in subscription_plans:
            existing = session.query(SubscriptionPlan).filter_by(tier=plan.tier).first()
            if not existing:
                session.add(plan)
                print(f"Added subscription plan: {plan.name}")
        
        # Seed predefined designs
        predefined_designs = [
            {
                "id": "design_1",
                "name": "Modern Minimalist",
                "category": DesignCategory.BUSINESS,
                "is_predefined": True,
                "is_public": True,
                "layout": {
                    "structure": "header-main-footer",
                    "grid": "12-column",
                    "spacing": "comfortable"
                },
                "styles": {
                    "primary_color": "#3B82F6",
                    "secondary_color": "#10B981",
                    "font_family": "Inter, sans-serif",
                    "border_radius": "8px",
                    "shadow": "subtle"
                },
                "components": [
                    {
                        "id": "hero",
                        "type": "hero",
                        "styles": {"background": "gradient", "height": "100vh"},
                        "content": {"title": "Welcome to Your New Website", "subtitle": "Beautiful and modern design"}
                    }
                ]
            },
            {
                "id": "design_2",
                "name": "Creative Agency",
                "category": DesignCategory.CREATIVE,
                "is_predefined": True,
                "is_public": True,
                "layout": {
                    "structure": "hero-features-portfolio-footer",
                    "grid": "asymmetric",
                    "spacing": "creative"
                },
                "styles": {
                    "primary_color": "#8B5CF6",
                    "secondary_color": "#EC4899",
                    "font_family": "Poppins, sans-serif",
                    "border_radius": "16px",
                    "shadow": "bold"
                },
                "components": [
                    {
                        "id": "hero",
                        "type": "hero",
                        "styles": {"background": "image-overlay", "animation": "fade-in"},
                        "content": {"title": "Creative Solutions", "subtitle": "We bring ideas to life"}
                    }
                ]
            }
        ]
        
        # Generate remaining 38 designs
        categories = list(DesignCategory)
        for i in range(3, 41):
            category = categories[i % len(categories)]
            predefined_designs.append({
                "id": f"design_{i}",
                "name": f"Design Template {i}",
                "category": category,
                "is_predefined": True,
                "is_public": True,
                "layout": {
                    "structure": "flexible",
                    "grid": "responsive",
                    "spacing": "dynamic"
                },
                "styles": {
                    "primary_color": f"hsl({i * 9}, 70%, 50%)",
                    "secondary_color": f"hsl({(i * 9) + 40}, 70%, 50%)",
                    "font_family": "System UI, sans-serif",
                    "border_radius": f"{i % 20}px",
                    "shadow": "custom"
                },
                "components": []
            })
        
        # Add predefined designs
        for design_data in predefined_designs:
            existing = session.query(Design).filter_by(id=design_data["id"]).first()
            if not existing:
                design = Design(**design_data)
                session.add(design)
                print(f"Added design: {design_data['name']}")
        
        # Commit all changes
        session.commit()
        print("Database initialization completed successfully!")
        
    except Exception as e:
        session.rollback()
        print(f"Error initializing database: {e}")
        raise
    finally:
        session.close()

if __name__ == "__main__":
    init_database()