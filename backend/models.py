from sqlalchemy import (
    Column, Integer, String, DateTime, Float, Boolean, Text, 
    ForeignKey, JSON, Enum, Table, UniqueConstraint, Index,
    Numeric, BigInteger, Date
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, backref
from sqlalchemy.sql import func
from datetime import datetime
import enum
import uuid

Base = declarative_base()

# ==================== Helper Functions ====================

def generate_uuid():
    return str(uuid.uuid4())

# ==================== Enums ====================

class SubscriptionTier(str, enum.Enum):
    FREE = "free"
    STARTER = "starter"
    PRO = "pro"
    ENTERPRISE = "enterprise"

class SubscriptionStatus(str, enum.Enum):
    ACTIVE = "active"
    CANCELLED = "cancelled"
    EXPIRED = "expired"
    TRIAL = "trial"
    PAST_DUE = "past_due"

class ProjectStatus(str, enum.Enum):
    DRAFT = "draft"
    BUILDING = "building"
    PUBLISHED = "published"
    ARCHIVED = "archived"

class DesignCategory(str, enum.Enum):
    BUSINESS = "business"
    ECOMMERCE = "ecommerce"
    PORTFOLIO = "portfolio"
    BLOG = "blog"
    LANDING = "landing"
    CORPORATE = "corporate"
    STARTUP = "startup"
    RESTAURANT = "restaurant"
    EDUCATION = "education"
    HEALTHCARE = "healthcare"
    CREATIVE = "creative"
    PERSONAL = "personal"

class IntegrationType(str, enum.Enum):
    FORMS = "forms"
    PAYMENT = "payment"
    EMAIL = "email"
    CALENDAR = "calendar"
    ADS = "ads"
    ANALYTICS = "analytics"
    CRM = "crm"
    SOCIAL = "social"

class IntegrationProvider(str, enum.Enum):
    # Forms
    FORMSPREE = "formspree"
    TYPEFORM = "typeform"
    GOOGLE_FORMS = "google_forms"
    
    # Payment
    STRIPE = "stripe"
    PAYPAL = "paypal"
    SQUARE = "square"
    
    # Email
    MAILCHIMP = "mailchimp"
    SENDGRID = "sendgrid"
    CONVERTKIT = "convertkit"
    
    # Calendar
    CALENDLY = "calendly"
    ACUITY = "acuity"
    GOOGLE_CALENDAR = "google_calendar"
    
    # Ads
    GOOGLE_ADS = "google_ads"
    META_ADS = "meta_ads"
    LINKEDIN_ADS = "linkedin_ads"
    
    # Analytics
    GOOGLE_ANALYTICS = "google_analytics"
    META_PIXEL = "meta_pixel"

class TransactionType(str, enum.Enum):
    PURCHASE = "purchase"
    USAGE = "usage"
    REFUND = "refund"
    BONUS = "bonus"

class ComponentType(str, enum.Enum):
    HERO = "hero"
    FEATURES = "features"
    GALLERY = "gallery"
    CONTACT = "contact"
    PRICING = "pricing"
    TESTIMONIALS = "testimonials"
    FAQ = "faq"
    ABOUT = "about"
    TEAM = "team"
    BLOG = "blog"
    NEWSLETTER = "newsletter"
    SOCIAL = "social"
    FOOTER = "footer"

class VoiceCommandType(str, enum.Enum):
    STYLE = "style"
    COMPONENT = "component"
    LAYOUT = "layout"
    CONTENT = "content"
    INTEGRATION = "integration"
    PUBLISH = "publish"

# ==================== Association Tables ====================

# Many-to-many relationship between designs and projects
project_designs = Table(
    'project_designs',
    Base.metadata,
    Column('project_id', String(36), ForeignKey('projects.id', ondelete='CASCADE')),
    Column('design_id', String(36), ForeignKey('designs.id', ondelete='CASCADE')),
    Column('merged_order', Integer, default=0),
    Column('created_at', DateTime, default=func.now()),
    UniqueConstraint('project_id', 'design_id', name='uq_project_design')
)

# Many-to-many relationship between designs and templates (for merging)
design_templates = Table(
    'design_templates',
    Base.metadata,
    Column('design_id', String(36), ForeignKey('designs.id', ondelete='CASCADE')),
    Column('template_id', String(36), ForeignKey('templates.id', ondelete='CASCADE')),
    Column('weight', Float, default=1.0),
    Column('created_at', DateTime, default=func.now())
)

# Many-to-many relationship for shared templates
shared_templates = Table(
    'shared_templates',
    Base.metadata,
    Column('template_id', String(36), ForeignKey('templates.id', ondelete='CASCADE')),
    Column('user_id', String(36), ForeignKey('users.id', ondelete='CASCADE')),
    Column('permission', String(20), default='view'),
    Column('shared_at', DateTime, default=func.now())
)

# ==================== User Models ====================

class User(Base):
    __tablename__ = 'users'
    
    # Primary Key
    id = Column(String(36), primary_key=True, default=generate_uuid)
    
    # Basic Information
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    avatar_url = Column(String(500))
    
    # Contact Information
    phone = Column(String(20))
    company = Column(String(255))
    website = Column(String(500))
    
    # Subscription Information
    subscription_tier = Column(Enum(SubscriptionTier), default=SubscriptionTier.FREE)
    subscription_status = Column(Enum(SubscriptionStatus), default=SubscriptionStatus.TRIAL)
    subscription_start = Column(DateTime)
    subscription_end = Column(DateTime)
    stripe_customer_id = Column(String(255))
    stripe_subscription_id = Column(String(255))
    
    # Credits System
    credits_balance = Column(Integer, default=50)  # Free credits on signup
    total_credits_purchased = Column(Integer, default=0)
    total_credits_used = Column(Integer, default=0)
    
    # Preferences
    preferred_language = Column(String(10), default='en')
    timezone = Column(String(50), default='UTC')
    email_notifications = Column(Boolean, default=True)
    
    # Security
    email_verified = Column(Boolean, default=False)
    email_verification_token = Column(String(255))
    password_reset_token = Column(String(255))
    password_reset_expires = Column(DateTime)
    last_login = Column(DateTime)
    last_ip = Column(String(45))
    
    # Metadata
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    projects = relationship('Project', back_populates='user', cascade='all, delete-orphan')
    credit_transactions = relationship('CreditTransaction', back_populates='user', cascade='all, delete-orphan')
    voice_commands = relationship('VoiceCommand', back_populates='user', cascade='all, delete-orphan')
    sessions = relationship('UserSession', back_populates='user', cascade='all, delete-orphan')
    designs = relationship('Design', back_populates='user', cascade='all, delete-orphan')
    templates = relationship('Template', back_populates='user', cascade='all, delete-orphan')
    api_keys = relationship('APIKey', back_populates='user', cascade='all, delete-orphan')
    
    # Indexes
    __table_args__ = (
        Index('idx_user_email', 'email'),
        Index('idx_user_subscription', 'subscription_tier', 'subscription_status'),
        Index('idx_user_credits', 'credits_balance'),
    )

class UserSession(Base):
    __tablename__ = 'user_sessions'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    token = Column(String(500), unique=True, nullable=False, index=True)
    ip_address = Column(String(45))
    user_agent = Column(Text)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=func.now())
    last_activity = Column(DateTime, default=func.now())
    is_active = Column(Boolean, default=True)
    
    # Relationships
    user = relationship('User', back_populates='sessions')
    
    __table_args__ = (
        Index('idx_session_token', 'token'),
        Index('idx_session_user', 'user_id', 'is_active'),
    )

class APIKey(Base):
    __tablename__ = 'api_keys'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    name = Column(String(255), nullable=False)
    key = Column(String(255), unique=True, nullable=False, index=True)
    permissions = Column(JSON, default=['read'])
    last_used = Column(DateTime)
    expires_at = Column(DateTime)
    created_at = Column(DateTime, default=func.now())
    is_active = Column(Boolean, default=True)
    
    # Relationships
    user = relationship('User', back_populates='api_keys')
    
    __table_args__ = (
        Index('idx_api_key', 'key'),
        Index('idx_api_user', 'user_id', 'is_active'),
    )

# ==================== Credit System ====================

class CreditTransaction(Base):
    __tablename__ = 'credit_transactions'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    amount = Column(Integer, nullable=False)  # Positive for additions, negative for deductions
    type = Column(Enum(TransactionType), nullable=False)
    description = Column(String(500))
    reference_id = Column(String(255))  # Project ID, Invoice ID, etc.
    metadata = Column(JSON)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    user = relationship('User', back_populates='credit_transactions')
    
    __table_args__ = (
        Index('idx_credit_user', 'user_id', 'created_at'),
        Index('idx_credit_type', 'type'),
        Index('idx_credit_reference', 'reference_id'),
    )

# ==================== Project Models ====================

class Project(Base):
    __tablename__ = 'projects'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    name = Column(String(255), nullable=False)
    slug = Column(String(255))
    description = Column(Text)
    
    # Project Configuration
    status = Column(Enum(ProjectStatus), default=ProjectStatus.DRAFT)
    custom_domain = Column(String(255))
    published_url = Column(String(500))
    published_at = Column(DateTime)
    
    # Design Settings
    global_styles = Column(JSON, default={})
    layout_config = Column(JSON, default={})
    responsive_settings = Column(JSON, default={})
    
    # SEO Settings
    seo_title = Column(String(255))
    seo_description = Column(Text)
    seo_keywords = Column(Text)
    favicon_url = Column(String(500))
    
    # Analytics
    view_count = Column(Integer, default=0)
    last_viewed = Column(DateTime)
    
    # Generated Code
    html_code = Column(Text)
    css_code = Column(Text)
    js_code = Column(Text)
    
    # Version Control
    version = Column(Integer, default=1)
    published_version = Column(Integer)
    
    # Metadata
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship('User', back_populates='projects')
    components = relationship('Component', back_populates='project', cascade='all, delete-orphan')
    integrations = relationship('Integration', back_populates='project', cascade='all, delete-orphan')
    designs = relationship('Design', secondary=project_designs, back_populates='projects')
    versions = relationship('ProjectVersion', back_populates='project', cascade='all, delete-orphan')
    assets = relationship('Asset', back_populates='project', cascade='all, delete-orphan')
    
    __table_args__ = (
        Index('idx_project_user', 'user_id'),
        Index('idx_project_status', 'status'),
        Index('idx_project_slug', 'slug', unique=True),
        Index('idx_project_created', 'created_at'),
    )

class ProjectVersion(Base):
    __tablename__ = 'project_versions'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey('projects.id', ondelete='CASCADE'), nullable=False)
    version_number = Column(Integer, nullable=False)
    html_code = Column(Text)
    css_code = Column(Text)
    js_code = Column(Text)
    snapshot = Column(JSON)  # Full state snapshot
    changes = Column(JSON)  # What changed in this version
    created_at = Column(DateTime, default=func.now())
    created_by = Column(String(36), ForeignKey('users.id'))
    
    # Relationships
    project = relationship('Project', back_populates='versions')
    
    __table_args__ = (
        Index('idx_version_project', 'project_id', 'version_number'),
        Index('idx_version_created', 'created_at'),
        UniqueConstraint('project_id', 'version_number', name='uq_project_version'),
    )

# ==================== Component Models ====================

class Component(Base):
    __tablename__ = 'components'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey('projects.id', ondelete='CASCADE'), nullable=False)
    type = Column(Enum(ComponentType), nullable=False)
    name = Column(String(255))
    order = Column(Integer, default=0)
    
    # Component Data
    content = Column(JSON, default={})  # Text content, images, etc.
    styles = Column(JSON, default={})  # Custom styles for this component
    settings = Column(JSON, default={})  # Component-specific settings
    
    # Responsive variations
    mobile_styles = Column(JSON, default={})
    tablet_styles = Column(JSON, default={})
    desktop_styles = Column(JSON, default={})
    
    # Animation
    animation = Column(JSON, default={})
    
    # Visibility
    is_visible = Column(Boolean, default=True)
    visibility_conditions = Column(JSON, default={})
    
    # Metadata
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    project = relationship('Project', back_populates='components')
    
    __table_args__ = (
        Index('idx_component_project', 'project_id', 'order'),
        Index('idx_component_type', 'type'),
    )

class Asset(Base):
    __tablename__ = 'assets'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey('projects.id', ondelete='CASCADE'), nullable=False)
    name = Column(String(255), nullable=False)
    type = Column(String(50))  # image, video, audio, document
    url = Column(String(500))
    path = Column(String(500))
    size = Column(Integer)  # Bytes
    mime_type = Column(String(100))
    metadata = Column(JSON)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    project = relationship('Project', back_populates='assets')
    
    __table_args__ = (
        Index('idx_asset_project', 'project_id'),
        Index('idx_asset_type', 'type'),
    )

# ==================== Design & Template Models ====================

class Design(Base):
    __tablename__ = 'designs'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    category = Column(Enum(DesignCategory), nullable=False)
    
    # Design Data
    preview_image = Column(String(500))
    thumbnail = Column(String(500))
    layout = Column(JSON, nullable=False)
    styles = Column(JSON, nullable=False)
    components = Column(JSON, nullable=False)  # Default components
    
    # Design Attributes
    is_predefined = Column(Boolean, default=False)
    is_public = Column(Boolean, default=False)
    popularity_score = Column(Float, default=0)
    usage_count = Column(Integer, default=0)
    
    # Version Control
    version = Column(Integer, default=1)
    
    # Metadata
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship('User', back_populates='designs')
    projects = relationship('Project', secondary=project_designs, back_populates='designs')
    templates = relationship('Template', secondary=design_templates, back_populates='designs')
    
    __table_args__ = (
        Index('idx_design_category', 'category'),
        Index('idx_design_user', 'user_id'),
        Index('idx_design_popularity', 'popularity_score'),
        Index('idx_design_public', 'is_public'),
    )

class Template(Base):
    __tablename__ = 'templates'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    category = Column(Enum(DesignCategory))
    
    # Template Data
    layout = Column(JSON, nullable=False)
    styles = Column(JSON, nullable=False)
    components = Column(JSON, nullable=False)
    
    # Template Attributes
    is_premium = Column(Boolean, default=False)
    price = Column(Numeric(10, 2))
    is_public = Column(Boolean, default=False)
    download_count = Column(Integer, default=0)
    
    # Preview
    preview_url = Column(String(500))
    demo_url = Column(String(500))
    
    # Metadata
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship('User', back_populates='templates')
    designs = relationship('Design', secondary=design_templates, back_populates='templates')
    shared_with = relationship('User', secondary=shared_templates, back_populates='shared_templates')
    
    __table_args__ = (
        Index('idx_template_category', 'category'),
        Index('idx_template_user', 'user_id'),
        Index('idx_template_premium', 'is_premium'),
    )

# Add relationship to User for shared templates
User.shared_templates = relationship('Template', secondary=shared_templates, back_populates='shared_with')

# ==================== Integration Models ====================

class Integration(Base):
    __tablename__ = 'integrations'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey('projects.id', ondelete='CASCADE'), nullable=False)
    type = Column(Enum(IntegrationType), nullable=False)
    provider = Column(Enum(IntegrationProvider), nullable=False)
    name = Column(String(255))
    
    # Configuration
    api_key = Column(String(500))
    api_secret = Column(String(500))  # Encrypted in production
    settings = Column(JSON, default={})
    webhook_url = Column(String(500))
    webhook_secret = Column(String(500))
    
    # Status
    is_active = Column(Boolean, default=True)
    last_sync = Column(DateTime)
    sync_status = Column(String(50))
    error_message = Column(Text)
    
    # Usage
    usage_count = Column(Integer, default=0)
    last_used = Column(DateTime)
    
    # Metadata
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    project = relationship('Project', back_populates='integrations')
    
    __table_args__ = (
        Index('idx_integration_project', 'project_id'),
        Index('idx_integration_type', 'type'),
        Index('idx_integration_provider', 'provider'),
    )

# ==================== Voice Command Models ====================

class VoiceCommand(Base):
    __tablename__ = 'voice_commands'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    project_id = Column(String(36), ForeignKey('projects.id', ondelete='SET NULL'))
    command = Column(Text, nullable=False)
    command_type = Column(Enum(VoiceCommandType))
    
    # Processing
    processed_command = Column(JSON)  # Parsed command
    confidence_score = Column(Float)
    response = Column(JSON)  # AI response
    
    # Status
    success = Column(Boolean, default=False)
    error_message = Column(Text)
    
    # Timing
    processing_time = Column(Float)  # Milliseconds
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    user = relationship('User', back_populates='voice_commands')
    
    __table_args__ = (
        Index('idx_voice_user', 'user_id', 'created_at'),
        Index('idx_voice_project', 'project_id'),
        Index('idx_voice_type', 'command_type'),
    )

# ==================== Subscription Models ====================

class SubscriptionPlan(Base):
    __tablename__ = 'subscription_plans'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    tier = Column(Enum(SubscriptionTier), unique=True, nullable=False)
    description = Column(Text)
    
    # Pricing
    price_monthly = Column(Numeric(10, 2))
    price_yearly = Column(Numeric(10, 2))
    currency = Column(String(3), default='USD')
    
    # Credits
    monthly_credits = Column(Integer)
    additional_credit_price = Column(Numeric(10, 2))  # Price per credit
    
    # Features
    max_projects = Column(Integer)
    max_custom_domains = Column(Integer)
    team_members = Column(Integer, default=1)
    priority_support = Column(Boolean, default=False)
    custom_integrations = Column(Boolean, default=False)
    white_label = Column(Boolean, default=False)
    api_access = Column(Boolean, default=False)
    
    # Feature Flags (JSON for flexible features)
    features = Column(JSON, default={})
    
    # Metadata
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    __table_args__ = (
        Index('idx_plan_tier', 'tier'),
        Index('idx_plan_active', 'is_active'),
    )

class Invoice(Base):
    __tablename__ = 'invoices'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    subscription_id = Column(String(36), ForeignKey('subscription_plans.id'))
    
    # Invoice Details
    invoice_number = Column(String(100), unique=True, nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), default='USD')
    description = Column(Text)
    
    # Status
    status = Column(String(50), default='pending')  # pending, paid, failed, refunded
    paid_at = Column(DateTime)
    
    # Payment
    payment_method = Column(String(50))
    stripe_invoice_id = Column(String(255))
    stripe_payment_intent = Column(String(255))
    
    # Items
    items = Column(JSON, default=[])  # List of items in invoice
    
    # Metadata
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship('User')
    subscription = relationship('SubscriptionPlan')
    
    __table_args__ = (
        Index('idx_invoice_user', 'user_id'),
        Index('idx_invoice_number', 'invoice_number'),
        Index('idx_invoice_status', 'status'),
    )

# ==================== Analytics Models ====================

class AnalyticsEvent(Base):
    __tablename__ = 'analytics_events'
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(String(36), ForeignKey('users.id', ondelete='SET NULL'))
    project_id = Column(String(36), ForeignKey('projects.id', ondelete='SET NULL'))
    event_type = Column(String(100), nullable=False)
    event_data = Column(JSON)
    
    # Context
    ip_address = Column(String(45))
    user_agent = Column(Text)
    referrer = Column(Text)
    
    # Timing
    created_at = Column(DateTime, default=func.now())
    
    __table_args__ = (
        Index('idx_analytics_user', 'user_id', 'created_at'),
        Index('idx_analytics_project', 'project_id', 'created_at'),
        Index('idx_analytics_type', 'event_type', 'created_at'),
        Index('idx_analytics_date', 'created_at'),
    )

class DailyStats(Base):
    __tablename__ = 'daily_stats'
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    date = Column(Date, nullable=False)
    
    # Project Stats
    projects_created = Column(Integer, default=0)
    projects_published = Column(Integer, default=0)
    active_projects = Column(Integer, default=0)
    
    # Usage Stats
    credits_used = Column(Integer, default=0)
    voice_commands_used = Column(Integer, default=0)
    integrations_used = Column(Integer, default=0)
    
    # Design Stats
    designs_viewed = Column(Integer, default=0)
    designs_merged = Column(Integer, default=0)
    
    # Performance
    avg_processing_time = Column(Float, default=0)
    
    created_at = Column(DateTime, default=func.now())
    
    __table_args__ = (
        Index('idx_stats_user_date', 'user_id', 'date'),
        UniqueConstraint('user_id', 'date', name='uq_user_date'),
    )