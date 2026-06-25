-- =====================================================
-- Aleyo AI Website Builder - Complete PostgreSQL Schema
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- ENUM TYPES
-- =====================================================

-- User subscription enums
CREATE TYPE subscription_tier_enum AS ENUM ('free', 'starter', 'pro', 'enterprise');
CREATE TYPE subscription_status_enum AS ENUM ('active', 'cancelled', 'expired', 'trial', 'past_due');

-- Project enums
CREATE TYPE project_status_enum AS ENUM ('draft', 'building', 'published', 'archived');

-- Design enums
CREATE TYPE design_category_enum AS ENUM ('business', 'ecommerce', 'portfolio', 'blog', 'landing', 'corporate', 'startup', 'restaurant', 'education', 'healthcare', 'creative', 'personal');

-- Integration enums
CREATE TYPE integration_type_enum AS ENUM ('forms', 'payment', 'email', 'calendar', 'ads', 'analytics', 'crm', 'social');
CREATE TYPE integration_provider_enum AS ENUM ('formspree', 'typeform', 'google_forms', 'stripe', 'paypal', 'square', 'mailchimp', 'sendgrid', 'convertkit', 'calendly', 'acuity', 'google_calendar', 'google_ads', 'meta_ads', 'linkedin_ads', 'google_analytics', 'meta_pixel');

-- Transaction enums
CREATE TYPE transaction_type_enum AS ENUM ('purchase', 'usage', 'refund', 'bonus');

-- Component enums
CREATE TYPE component_type_enum AS ENUM ('hero', 'features', 'gallery', 'contact', 'pricing', 'testimonials', 'faq', 'about', 'team', 'blog', 'newsletter', 'social', 'footer');

-- Voice command enums
CREATE TYPE voice_command_type_enum AS ENUM ('style', 'component', 'layout', 'content', 'integration', 'publish');

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    phone VARCHAR(20),
    company VARCHAR(255),
    website VARCHAR(500),
    credits_balance INTEGER NOT NULL DEFAULT 50,
    total_credits_purchased INTEGER DEFAULT 0,
    total_credits_used INTEGER DEFAULT 0,
    subscription_tier subscription_tier_enum DEFAULT 'free',
    subscription_status subscription_status_enum DEFAULT 'trial',
    subscription_start TIMESTAMP WITH TIME ZONE,
    subscription_end TIMESTAMP WITH TIME ZONE,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    preferred_language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    email_notifications BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP WITH TIME ZONE,
    last_login TIMESTAMP WITH TIME ZONE,
    last_ip INET,
    is_active BOOLEAN DEFAULT TRUE,
    is_superuser BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_subscription ON users(subscription_tier, subscription_status);
CREATE INDEX IF NOT EXISTS idx_users_credits ON users(credits_balance);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- =====================================================
-- USER SESSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id, is_active);

-- =====================================================
-- API KEYS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    key VARCHAR(255) UNIQUE NOT NULL,
    permissions JSONB DEFAULT '["read"]',
    last_used TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key);
CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id, is_active);

-- =====================================================
-- PASSWORD RESET TOKENS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    token VARCHAR(255) PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- =====================================================
-- PROJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    status project_status_enum DEFAULT 'draft',
    custom_domain VARCHAR(255),
    published_url VARCHAR(500),
    published_at TIMESTAMP WITH TIME ZONE,
    global_styles JSONB DEFAULT '{}',
    layout_config JSONB DEFAULT '{}',
    responsive_settings JSONB DEFAULT '{}',
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords TEXT,
    favicon_url VARCHAR(500),
    view_count INTEGER DEFAULT 0,
    last_viewed TIMESTAMP WITH TIME ZONE,
    html_code TEXT,
    css_code TEXT,
    js_code TEXT,
    version INTEGER DEFAULT 1,
    published_version INTEGER,
    customizations JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);
CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON projects(updated_at);
CREATE INDEX IF NOT EXISTS idx_projects_published_url ON projects(published_url);
CREATE INDEX IF NOT EXISTS idx_projects_user_updated ON projects(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_active_projects ON projects(id) WHERE published_url IS NOT NULL;

-- =====================================================
-- PROJECT VERSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS project_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    html_code TEXT,
    css_code TEXT,
    js_code TEXT,
    snapshot JSONB,
    changes JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    UNIQUE(project_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_project_versions_project ON project_versions(project_id, version_number);
CREATE INDEX IF NOT EXISTS idx_project_versions_created_at ON project_versions(created_at);

-- =====================================================
-- COMPONENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    type component_type_enum NOT NULL,
    name VARCHAR(255),
    component_order INTEGER DEFAULT 0,
    content JSONB DEFAULT '{}',
    styles JSONB DEFAULT '{}',
    settings JSONB DEFAULT '{}',
    mobile_styles JSONB DEFAULT '{}',
    tablet_styles JSONB DEFAULT '{}',
    desktop_styles JSONB DEFAULT '{}',
    animation JSONB DEFAULT '{}',
    is_visible BOOLEAN DEFAULT TRUE,
    visibility_conditions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_components_project ON components(project_id, component_order);
CREATE INDEX IF NOT EXISTS idx_components_type ON components(type);

-- =====================================================
-- ASSETS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50),
    url VARCHAR(500),
    path VARCHAR(500),
    size INTEGER,
    mime_type VARCHAR(100),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_assets_project ON assets(project_id);
CREATE INDEX IF NOT EXISTS idx_assets_type ON assets(type);

-- =====================================================
-- PROJECT DESIGNS (Many-to-Many)
-- =====================================================
CREATE TABLE IF NOT EXISTS project_designs (
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    design_id VARCHAR(50) NOT NULL,
    merged_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, design_id)
);

CREATE INDEX IF NOT EXISTS idx_project_designs_project_id ON project_designs(project_id);
CREATE INDEX IF NOT EXISTS idx_project_designs_design_id ON project_designs(design_id);

-- =====================================================
-- CREDIT TRANSACTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    type transaction_type_enum NOT NULL,
    description TEXT,
    reference_id VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_user ON credit_transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_type ON credit_transactions(type);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_reference ON credit_transactions(reference_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_created ON credit_transactions(user_id, created_at);

-- =====================================================
-- INTEGRATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    type integration_type_enum NOT NULL,
    provider integration_provider_enum NOT NULL,
    name VARCHAR(255),
    api_key VARCHAR(500),
    api_secret VARCHAR(500),
    settings JSONB DEFAULT '{}',
    webhook_url VARCHAR(500),
    webhook_secret VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    last_sync TIMESTAMP WITH TIME ZONE,
    sync_status VARCHAR(50),
    error_message TEXT,
    usage_count INTEGER DEFAULT 0,
    last_used TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_integrations_project ON integrations(project_id);
CREATE INDEX IF NOT EXISTS idx_integrations_type ON integrations(type);
CREATE INDEX IF NOT EXISTS idx_integrations_provider ON integrations(provider);
CREATE INDEX IF NOT EXISTS idx_integrations_project_type ON integrations(project_id, type);

-- =====================================================
-- DESIGN TEMPLATES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS design_templates (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category design_category_enum NOT NULL,
    layout JSONB NOT NULL,
    styles JSONB NOT NULL,
    is_predefined BOOLEAN DEFAULT TRUE,
    is_public BOOLEAN DEFAULT TRUE,
    popularity_score FLOAT DEFAULT 0,
    usage_count INTEGER DEFAULT 0,
    preview_image VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_design_templates_category ON design_templates(category);
CREATE INDEX IF NOT EXISTS idx_design_templates_name ON design_templates(name);
CREATE INDEX IF NOT EXISTS idx_design_templates_popularity ON design_templates(popularity_score);

-- =====================================================
-- DESIGN COMPONENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS design_components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    design_id VARCHAR(50) NOT NULL REFERENCES design_templates(id) ON DELETE CASCADE,
    component_id VARCHAR(100) NOT NULL,
    component_type component_type_enum NOT NULL,
    styles JSONB NOT NULL,
    content JSONB NOT NULL,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(design_id, component_id)
);

CREATE INDEX IF NOT EXISTS idx_design_components_design_id ON design_components(design_id);
CREATE INDEX IF NOT EXISTS idx_design_components_type ON design_components(component_type);

-- =====================================================
-- PROJECT COMPONENTS (Customizations per project)
-- =====================================================
CREATE TABLE IF NOT EXISTS project_components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    component_id VARCHAR(100) NOT NULL,
    component_type component_type_enum NOT NULL,
    styles JSONB NOT NULL,
    content JSONB NOT NULL,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, component_id)
);

CREATE INDEX IF NOT EXISTS idx_project_components_project_id ON project_components(project_id);
CREATE INDEX IF NOT EXISTS idx_project_components_type ON project_components(component_type);
CREATE INDEX IF NOT EXISTS idx_project_components_project_position ON project_components(project_id, position);

-- =====================================================
-- CUSTOM DESIGNS TABLE (User-created designs)
-- =====================================================
CREATE TABLE IF NOT EXISTS designs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category design_category_enum NOT NULL,
    preview_image VARCHAR(500),
    thumbnail VARCHAR(500),
    layout JSONB NOT NULL,
    styles JSONB NOT NULL,
    components JSONB NOT NULL,
    is_predefined BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE,
    popularity_score FLOAT DEFAULT 0,
    usage_count INTEGER DEFAULT 0,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_designs_category ON designs(category);
CREATE INDEX IF NOT EXISTS idx_designs_user ON designs(user_id);
CREATE INDEX IF NOT EXISTS idx_designs_popularity ON designs(popularity_score);
CREATE INDEX IF NOT EXISTS idx_designs_public ON designs(is_public);

-- =====================================================
-- TEMPLATES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category design_category_enum,
    layout JSONB NOT NULL,
    styles JSONB NOT NULL,
    components JSONB NOT NULL,
    is_premium BOOLEAN DEFAULT FALSE,
    price DECIMAL(10, 2),
    is_public BOOLEAN DEFAULT FALSE,
    download_count INTEGER DEFAULT 0,
    preview_url VARCHAR(500),
    demo_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_user ON templates(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_premium ON templates(is_premium);

-- =====================================================
-- DESIGN_TEMPLATES ASSOCIATION (Many-to-Many)
-- =====================================================
CREATE TABLE IF NOT EXISTS design_templates_assoc (
    design_id UUID REFERENCES designs(id) ON DELETE CASCADE,
    template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
    weight FLOAT DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (design_id, template_id)
);

-- =====================================================
-- SHARED TEMPLATES (Many-to-Many)
-- =====================================================
CREATE TABLE IF NOT EXISTS shared_templates (
    template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    permission VARCHAR(20) DEFAULT 'view',
    shared_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (template_id, user_id)
);

-- =====================================================
-- VOICE COMMANDS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS voice_commands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    command TEXT NOT NULL,
    command_type voice_command_type_enum,
    processed_command JSONB,
    confidence_score FLOAT,
    response JSONB,
    success BOOLEAN DEFAULT FALSE,
    error_message TEXT,
    processing_time FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_voice_commands_user ON voice_commands(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_voice_commands_project ON voice_commands(project_id);
CREATE INDEX IF NOT EXISTS idx_voice_commands_type ON voice_commands(command_type);

-- =====================================================
-- SUBSCRIPTION PLANS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    tier subscription_tier_enum UNIQUE NOT NULL,
    description TEXT,
    price_monthly DECIMAL(10, 2),
    price_yearly DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    monthly_credits INTEGER,
    additional_credit_price DECIMAL(10, 2),
    max_projects INTEGER,
    max_custom_domains INTEGER,
    team_members INTEGER DEFAULT 1,
    priority_support BOOLEAN DEFAULT FALSE,
    custom_integrations BOOLEAN DEFAULT FALSE,
    white_label BOOLEAN DEFAULT FALSE,
    api_access BOOLEAN DEFAULT FALSE,
    features JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_subscription_plans_tier ON subscription_plans(tier);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_active ON subscription_plans(is_active);

-- =====================================================
-- INVOICES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_plan_id UUID REFERENCES subscription_plans(id),
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    paid_at TIMESTAMP WITH TIME ZONE,
    payment_method VARCHAR(50),
    stripe_invoice_id VARCHAR(255),
    stripe_payment_intent VARCHAR(255),
    items JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_invoices_user ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

-- =====================================================
-- ANALYTICS EVENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS analytics_events (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_project ON analytics_events(project_id, created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type, created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_date ON analytics_events(created_at);

-- =====================================================
-- DAILY STATS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS daily_stats (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    projects_created INTEGER DEFAULT 0,
    projects_published INTEGER DEFAULT 0,
    active_projects INTEGER DEFAULT 0,
    credits_used INTEGER DEFAULT 0,
    voice_commands_used INTEGER DEFAULT 0,
    integrations_used INTEGER DEFAULT 0,
    designs_viewed INTEGER DEFAULT 0,
    designs_merged INTEGER DEFAULT 0,
    avg_processing_time FLOAT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_daily_stats_user_date ON daily_stats(user_id, date);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Update updated_at timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_components_updated_at
    BEFORE UPDATE ON components
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integrations_updated_at
    BEFORE UPDATE ON integrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_design_templates_updated_at
    BEFORE UPDATE ON design_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_design_components_updated_at
    BEFORE UPDATE ON design_components
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_components_updated_at
    BEFORE UPDATE ON project_components
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_designs_updated_at
    BEFORE UPDATE ON designs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at
    BEFORE UPDATE ON templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at
    BEFORE UPDATE ON subscription_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Check credit balance before deducting
CREATE OR REPLACE FUNCTION check_credit_balance()
RETURNS TRIGGER AS $$
DECLARE
    user_credits INTEGER;
BEGIN
    IF NEW.type = 'usage' OR NEW.amount < 0 THEN
        SELECT credits_balance INTO user_credits FROM users WHERE id = NEW.user_id;
        IF user_credits < ABS(NEW.amount) THEN
            RAISE EXCEPTION 'Insufficient credits. Required: %, Available: %', ABS(NEW.amount), user_credits;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_credits_before_insert
    BEFORE INSERT ON credit_transactions
    FOR EACH ROW
    EXECUTE FUNCTION check_credit_balance();

-- Update user credits automatically
CREATE OR REPLACE FUNCTION update_user_credits()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users 
    SET credits_balance = credits_balance + NEW.amount,
        total_credits_purchased = total_credits_purchased + CASE WHEN NEW.amount > 0 THEN NEW.amount ELSE 0 END,
        total_credits_used = total_credits_used + CASE WHEN NEW.amount < 0 THEN ABS(NEW.amount) ELSE 0 END
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_credits_after_transaction
    AFTER INSERT ON credit_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_credits();

-- =====================================================
-- VIEWS
-- =====================================================

-- User projects summary view
CREATE OR REPLACE VIEW user_projects_summary AS
SELECT 
    u.id AS user_id,
    u.name AS user_name,
    u.email,
    u.credits_balance AS credits,
    p.id AS project_id,
    p.name AS project_name,
    p.published_url,
    p.created_at AS project_created_at,
    p.updated_at AS project_updated_at,
    p.status,
    COUNT(DISTINCT pd.design_id) AS design_count,
    COUNT(DISTINCT i.id) AS integration_count,
    COUNT(DISTINCT c.id) AS component_count
FROM users u
LEFT JOIN projects p ON u.id = p.user_id
LEFT JOIN project_designs pd ON p.id = pd.project_id
LEFT JOIN integrations i ON p.id = i.project_id
LEFT JOIN components c ON p.id = c.project_id
GROUP BY u.id, u.name, u.email, u.credits_balance, p.id, p.name, p.published_url, p.created_at, p.updated_at, p.status;

-- Credit usage summary view
CREATE OR REPLACE VIEW credit_usage_summary AS
SELECT 
    u.id AS user_id,
    u.name AS user_name,
    u.credits_balance AS current_credits,
    u.total_credits_purchased,
    u.total_credits_used,
    COALESCE(SUM(CASE WHEN ct.type = 'purchase' THEN ct.amount ELSE 0 END), 0) AS total_purchased,
    COALESCE(SUM(CASE WHEN ct.type = 'usage' THEN ABS(ct.amount) ELSE 0 END), 0) AS total_used,
    COUNT(CASE WHEN ct.type = 'purchase' THEN 1 END) AS purchase_count,
    COUNT(CASE WHEN ct.type = 'usage' THEN 1 END) AS usage_count,
    MAX(CASE WHEN ct.type = 'purchase' THEN ct.created_at END) AS last_purchase_date,
    MAX(CASE WHEN ct.type = 'usage' THEN ct.created_at END) AS last_usage_date
FROM users u
LEFT JOIN credit_transactions ct ON u.id = ct.user_id
GROUP BY u.id, u.name, u.credits_balance, u.total_credits_purchased, u.total_credits_used;

-- Active projects count by user view
CREATE OR REPLACE VIEW user_active_projects AS
SELECT 
    u.id AS user_id,
    u.name,
    u.email,
    COUNT(p.id) FILTER (WHERE p.status = 'published') AS published_count,
    COUNT(p.id) FILTER (WHERE p.status = 'building') AS building_count,
    COUNT(p.id) FILTER (WHERE p.status = 'draft') AS draft_count,
    COUNT(p.id) AS total_projects
FROM users u
LEFT JOIN projects p ON u.id = p.user_id
GROUP BY u.id, u.name, u.email;

-- =====================================================
-- INSERT PREDEFINED DATA
-- =====================================================

-- Insert subscription plans
INSERT INTO subscription_plans (name, tier, description, price_monthly, price_yearly, monthly_credits, max_projects, team_members, priority_support, custom_integrations, white_label, api_access, features) VALUES
('Free', 'free', 'Perfect for getting started', 0, 0, 50, 3, 1, FALSE, FALSE, FALSE, FALSE, '{"basic_templates": true, "basic_support": true}'::jsonb),
('Starter', 'starter', 'For growing businesses', 9.99, 99.99, 500, 10, 1, FALSE, FALSE, FALSE, FALSE, '{"all_templates": true, "email_support": true, "custom_domain": true}'::jsonb),
('Pro', 'pro', 'For professionals and agencies', 29.99, 299.99, 2000, 50, 3, TRUE, TRUE, FALSE, TRUE, '{"all_templates": true, "priority_support": true, "custom_domain": true, "analytics": true}'::jsonb),
('Enterprise', 'enterprise', 'For large organizations', 99.99, 999.99, 10000, -1, 10, TRUE, TRUE, TRUE, TRUE, '{"all_features": true, "dedicated_support": true, "sla": true, "custom_integrations": true}'::jsonb)
ON CONFLICT (tier) DO NOTHING;

-- Insert predefined design templates
INSERT INTO design_templates (id, name, category, layout, styles, is_predefined, is_public, popularity_score) VALUES
('design_1', 'Modern Minimalist', 'business', 
 '{"structure": "header-main-footer", "grid": "12-column", "spacing": "comfortable"}'::jsonb,
 '{"primary_color": "#4F6EF7", "secondary_color": "#2DBCB6", "font_family": "Inter, sans-serif", "border_radius": "8px", "shadow": "subtle"}'::jsonb,
 TRUE, TRUE, 95),
 
('design_2', 'Creative Agency', 'creative',
 '{"structure": "hero-features-portfolio-footer", "grid": "asymmetric", "spacing": "creative"}'::jsonb,
 '{"primary_color": "#8B5CF6", "secondary_color": "#EC4899", "font_family": "Poppins, sans-serif", "border_radius": "16px", "shadow": "bold"}'::jsonb,
 TRUE, TRUE, 88),
 
('design_3', 'E-commerce Pro', 'ecommerce',
 '{"structure": "header-products-cart-footer", "grid": "product-grid", "spacing": "compact"}'::jsonb,
 '{"primary_color": "#10B981", "secondary_color": "#F59E0B", "font_family": "Roboto, sans-serif", "border_radius": "4px", "shadow": "none"}'::jsonb,
 TRUE, TRUE, 92),
 
('design_4', 'Portfolio Bold', 'portfolio',
 '{"structure": "hero-gallery-about-footer", "grid": "masonry", "spacing": "artistic"}'::jsonb,
 '{"primary_color": "#1E293B", "secondary_color": "#3B82F6", "font_family": "Montserrat, sans-serif", "border_radius": "12px", "shadow": "medium"}'::jsonb,
 TRUE, TRUE, 85),
 
('design_5', 'Startup Launch', 'startup',
 '{"structure": "hero-features-pricing-footer", "grid": "modern", "spacing": "spacious"}'::jsonb,
 '{"primary_color": "#06B6D4", "secondary_color": "#F43F5E", "font_family": "Space Grotesk, sans-serif", "border_radius": "24px", "shadow": "glow"}'::jsonb,
 TRUE, TRUE, 90);

-- Insert design components for templates
INSERT INTO design_components (design_id, component_id, component_type, styles, content, position) VALUES
('design_1', 'hero_1', 'hero',
 '{"background": "gradient", "height": "100vh"}'::jsonb,
 '{"title": "Welcome to Your New Website", "subtitle": "Beautiful and modern design", "buttonText": "Get Started"}'::jsonb, 1),
 
('design_1', 'features_1', 'features',
 '{"columns": 3, "icon_style": "rounded"}'::jsonb,
 '{"title": "Features", "items": ["Fast Performance", "Responsive Design", "Easy Customization"]}'::jsonb, 2),
 
('design_2', 'hero_2', 'hero',
 '{"background": "image-overlay", "animation": "fade-in"}'::jsonb,
 '{"title": "Creative Solutions", "subtitle": "We bring ideas to life", "buttonText": "View Work"}'::jsonb, 1),
 
('design_3', 'hero_3', 'hero',
 '{"background": "solid", "height": "80vh"}'::jsonb,
 '{"title": "Shop the Latest", "subtitle": "Discover amazing products", "buttonText": "Shop Now"}'::jsonb, 1);

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE users IS 'User accounts and profile information';
COMMENT ON TABLE projects IS 'Website projects created by users';
COMMENT ON TABLE components IS 'Individual components that make up a project';
COMMENT ON TABLE assets IS 'Media assets uploaded for projects';
COMMENT ON TABLE project_designs IS 'Many-to-many relationship between projects and design templates';
COMMENT ON TABLE credit_transactions IS 'Credit purchase, usage, refund, and bonus history';
COMMENT ON TABLE integrations IS 'Third-party integrations (Stripe, Mailchimp, Calendly, etc.)';
COMMENT ON TABLE design_templates IS 'Predefined design templates';
COMMENT ON TABLE design_components IS 'Components that make up design templates';
COMMENT ON TABLE project_components IS 'Customized components per project';
COMMENT ON TABLE designs IS 'Custom designs created by users';
COMMENT ON TABLE templates IS 'User-created templates that can be shared';
COMMENT ON TABLE voice_commands IS 'Voice command history and processing results';
COMMENT ON TABLE subscription_plans IS 'Available subscription plans and their features';
COMMENT ON TABLE invoices IS 'Billing invoices for users';
COMMENT ON TABLE analytics_events IS 'User activity tracking for analytics';
COMMENT ON TABLE daily_stats IS 'Daily aggregated statistics per user';

-- =====================================================
-- GRANT PERMISSIONS (Run separately)
-- =====================================================
-- CREATE USER aleyo_app WITH PASSWORD 'secure_password';
-- GRANT CONNECT ON DATABASE aleyo_db TO aleyo_app;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO aleyo_app;
-- GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO aleyo_app;