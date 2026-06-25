from sqlalchemy import create_engine, Column, String, Integer, DateTime, Text, JSON, ForeignKey, UniqueConstraint, CheckConstraint, Index
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from typing import Generator
from datetime import datetime
import uuid
import os

# ---------------------------------------------------------------------------
# Portable UUID / JSONB / INET replacements (no psycopg2 / PostgreSQL needed)
# ---------------------------------------------------------------------------

class UUID(String):
    """Database-agnostic UUID column (stored as VARCHAR(36)).
    Accepts as_uuid=True for compatibility with existing model code; the value
    is always stored/returned as a str so it works on SQLite, MySQL, etc.
    """
    def __init__(self, as_uuid: bool = False, *args, **kwargs):
        self.as_uuid = as_uuid
        super().__init__(36, *args, **kwargs)

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        return uuid.UUID(value) if self.as_uuid else value


# JSON covers all JSONB use-cases for non-Postgres backends
JSONB = JSON

# INET stored as plain text (wide enough for IPv6)
INET = String(45)

# ---------------------------------------------------------------------------
# Database URL — defaults to a local SQLite file (no external server needed)
# ---------------------------------------------------------------------------
DATABASE_URL = os.getenv(
    'DATABASE_URL',
    'sqlite:///./aleyo.db'
)

# Create engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
    echo=False  # Set to True for debugging
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# ==================== SQLAlchemy Models ====================

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    credits = Column(Integer, nullable=False, default=50)
    subscription_tier = Column(String(50), nullable=False, default='free')
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, index=True)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, index=True)
    
    # Relationships
    projects = relationship("Project", back_populates="user", cascade="all, delete-orphan")
    credit_transactions = relationship("CreditTransaction", back_populates="user", cascade="all, delete-orphan")
    password_reset_tokens = relationship("PasswordResetToken", back_populates="user", cascade="all, delete-orphan")
    analytics_events = relationship("AnalyticsEvent", back_populates="user")


class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"
    
    token = Column(String(255), primary_key=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    expires_at = Column(DateTime(timezone=True), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="password_reset_tokens")


class Project(Base):
    __tablename__ = "projects"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    html_code = Column(Text, nullable=True)
    published_url = Column(String(500), nullable=True, index=True)
    customizations = Column(JSON, default=dict)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, index=True)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, index=True)
    
    # Relationships
    user = relationship("User", back_populates="projects")
    project_designs = relationship("ProjectDesign", back_populates="project", cascade="all, delete-orphan")
    integrations = relationship("Integration", back_populates="project", cascade="all, delete-orphan")
    project_components = relationship("ProjectComponent", back_populates="project", cascade="all, delete-orphan")
    analytics_events = relationship("AnalyticsEvent", back_populates="project")
    
    __table_args__ = (
        Index('idx_projects_user_updated', 'user_id', 'updated_at'),
    )


class ProjectDesign(Base):
    __tablename__ = "project_designs"
    
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), primary_key=True)
    design_id = Column(String(50), primary_key=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    # Relationships
    project = relationship("Project", back_populates="project_designs")
    
    __table_args__ = (
        Index('idx_project_designs_project_id', 'project_id'),
        Index('idx_project_designs_design_id', 'design_id'),
    )


class CreditTransaction(Base):
    __tablename__ = "credit_transactions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    amount = Column(Integer, nullable=False)
    type = Column(String(50), nullable=False, index=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, index=True)
    
    # Relationships
    user = relationship("User", back_populates="credit_transactions")
    
    __table_args__ = (
        CheckConstraint("type IN ('purchase', 'usage')", name="check_credit_transaction_type"),
        Index('idx_credit_transactions_user_created', 'user_id', 'created_at'),
    )


class Integration(Base):
    __tablename__ = "integrations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    type = Column(String(50), nullable=False, index=True)
    provider = Column(String(50), nullable=False, index=True)
    api_key = Column(String(500), nullable=True)
    settings = Column(JSON, default=dict)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    project = relationship("Project", back_populates="integrations")
    
    __table_args__ = (
        CheckConstraint("type IN ('forms', 'payment', 'email', 'calendar', 'ads')", name="check_integration_type"),
        Index('idx_integrations_project_type', 'project_id', 'type'),
    )


class DesignTemplate(Base):
    __tablename__ = "design_templates"
    
    id = Column(String(50), primary_key=True)
    name = Column(String(255), nullable=False, index=True)
    category = Column(String(100), nullable=False, index=True)
    layout = Column(JSON, nullable=False)
    styles = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    design_components = relationship("DesignComponent", back_populates="design_template", cascade="all, delete-orphan")


class DesignComponent(Base):
    __tablename__ = "design_components"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=lambda: str(uuid.uuid4()))
    design_id = Column(String(50), ForeignKey("design_templates.id", ondelete="CASCADE"), nullable=False, index=True)
    component_id = Column(String(100), nullable=False)
    component_type = Column(String(100), nullable=False, index=True)
    styles = Column(JSON, nullable=False)
    content = Column(JSON, nullable=False)
    position = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    design_template = relationship("DesignTemplate", back_populates="design_components")
    
    __table_args__ = (
        UniqueConstraint('design_id', 'component_id', name='uq_design_components_design_component'),
        Index('idx_design_components_design_id', 'design_id'),
    )


class ProjectComponent(Base):
    __tablename__ = "project_components"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    component_id = Column(String(100), nullable=False)
    component_type = Column(String(100), nullable=False, index=True)
    styles = Column(JSON, nullable=False)
    content = Column(JSON, nullable=False)
    position = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    project = relationship("Project", back_populates="project_components")
    
    __table_args__ = (
        UniqueConstraint('project_id', 'component_id', name='uq_project_components_project_component'),
        Index('idx_project_components_project_position', 'project_id', 'position'),
    )


class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="SET NULL"), nullable=True, index=True)
    event_type = Column(String(100), nullable=False, index=True)
    event_data = Column(JSON, default=dict)
    ip_address = Column(INET, nullable=True)
    user_agent = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, index=True)
    
    # Relationships
    user = relationship("User", back_populates="analytics_events")
    project = relationship("Project", back_populates="analytics_events")


def get_db() -> Generator[Session, None, None]:
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)