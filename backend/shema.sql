-- =====================================================
-- Aleyo AI Website Builder - PostgreSQL Schema
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE users IF NOT EXISTS (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    credits INTEGER NOT NULL DEFAULT 50,
    subscription_tier VARCHAR(50) NOT NULL DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for users table
CREATE INDEX idx_users_email ON users(email) IF NOT EXISTS;
CREATE INDEX idx_users_created_at ON users(created_at) IF NOT EXISTS;
CREATE INDEX idx_users_updated_at ON users(updated_at) IF NOT EXISTS;

-- =====================================================
-- PASSWORD RESET TOKENS TABLE
-- =====================================================
CREATE TABLE password_reset_tokens IF NOT EXISTS (
    token VARCHAR(255) PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster token lookup
CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id) IF NOT EXISTS;
CREATE INDEX idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at) IF NOT EXISTS;

-- =====================================================
-- PROJECTS TABLE
-- =====================================================
CREATE TABLE projects IF NOT EXISTS (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    html_code TEXT,
    published_url VARCHAR(500),
    customizations JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for projects table
CREATE INDEX idx_projects_user_id ON projects(user_id) IF NOT EXISTS;
CREATE INDEX idx_projects_created_at ON projects(created_at) IF NOT EXISTS;
CREATE INDEX idx_projects_updated_at ON projects(updated_at) IF NOT EXISTS;
CREATE INDEX idx_projects_published_url ON projects(published_url) IF NOT EXISTS;

-- =====================================================
-- PROJECT DESIGNS (Many-to-Many relationship)
-- =====================================================
CREATE TABLE project_designs IF NOT EXISTS (
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    design_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, design_id)
);

-- Index for faster lookups
CREATE INDEX idx_project_designs_project_id ON project_designs(project_id) IF NOT EXISTS;
CREATE INDEX idx_project_designs_design_id ON project_designs(design_id) IF NOT EXISTS;

-- =====================================================
-- CREDIT TRANSACTIONS TABLE
-- =====================================================
CREATE TABLE credit_transactions IF NOT EXISTS (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('purchase', 'usage')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for credit_transactions
CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id) IF NOT EXISTS;
CREATE INDEX idx_credit_transactions_created_at ON credit_transactions(created_at) IF NOT EXISTS;
CREATE INDEX idx_credit_transactions_type ON credit_transactions(type) IF NOT EXISTS;

-- =====================================================
-- INTEGRATIONS TABLE
-- =====================================================
CREATE TABLE integrations IF NOT EXISTS (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('forms', 'payment', 'email', 'calendar', 'ads')),
    provider VARCHAR(50) NOT NULL,
    api_key VARCHAR(500),
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for integrations
CREATE INDEX idx_integrations_project_id ON integrations(project_id) IF NOT EXISTS;
CREATE INDEX idx_integrations_type ON integrations(type) IF NOT EXISTS;
CREATE INDEX idx_integrations_provider ON integrations(provider) IF NOT EXISTS;

-- =====================================================
-- DESIGN TEMPLATES TABLE
-- =====================================================
CREATE TABLE design_templates IF NOT EXISTS (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    layout JSONB NOT NULL,
    styles JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for design_templates
CREATE INDEX idx_design_templates_category ON design_templates(category) IF NOT EXISTS;
CREATE INDEX idx_design_templates_name ON design_templates(name) IF NOT EXISTS;

-- =====================================================
-- DESIGN COMPONENTS TABLE
-- =====================================================
CREATE TABLE design_components IF NOT EXISTS (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    design_id VARCHAR(50) NOT NULL REFERENCES design_templates(id) ON DELETE CASCADE,
    component_id VARCHAR(100) NOT NULL,
    component_type VARCHAR(100) NOT NULL,
    styles JSONB NOT NULL,
    content JSONB NOT NULL,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(design_id, component_id)
);

-- Indexes for design_components
CREATE INDEX idx_design_components_design_id ON design_components(design_id) IF NOT EXISTS;
CREATE INDEX idx_design_components_type ON design_components(component_type);

-- =====================================================
-- PROJECT COMPONENTS (Customizations per project)
-- =====================================================
CREATE TABLE project_components IF NOT EXISTS (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    component_id VARCHAR(100) NOT NULL,
    component_type VARCHAR(100) NOT NULL,
    styles JSONB NOT NULL,
    content JSONB NOT NULL,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, component_id)
);

-- Indexes for project_components
CREATE INDEX idx_project_components_project_id ON project_components(project_id) IF NOT EXISTS;
CREATE INDEX idx_project_components_type ON project_components(component_type) IF NOT EXISTS;

-- =====================================================
-- ANALYTICS TABLE (Optional - for tracking usage)
-- =====================================================
CREATE TABLE analytics_events IF NOT EXISTS (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for analytics
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id) IF NOT EXISTS;
CREATE INDEX idx_analytics_events_project_id ON analytics_events(project_id) IF NOT EXISTS;
CREATE INDEX idx_analytics_events_event_type ON analytics_events(event_type) IF NOT EXISTS;
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at) IF NOT EXISTS;

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column() IF NOT EXISTS
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to tables
CREATE TRIGGER update_users_updated_at IF NOT EXISTS
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at IF NOT EXISTS
    BEFORE UPDATE ON projects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integrations_updated_at IF NOT EXISTS
    BEFORE UPDATE ON integrations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_design_templates_updated_at 
    BEFORE UPDATE ON design_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_design_components_updated_at IF NOT EXISTS
    BEFORE UPDATE ON design_components 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_components_updated_at IF NOT EXISTS
    BEFORE UPDATE ON project_components 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCTION: Check credit balance before deducting
-- =====================================================
CREATE OR REPLACE FUNCTION check_credit_balance() IF NOT EXISTS
RETURNS TRIGGER AS $$
DECLARE
    user_credits INTEGER;
BEGIN
    -- Only check for usage transactions
    IF NEW.type = 'usage' THEN
        SELECT credits INTO user_credits FROM users WHERE id = NEW.user_id;
        IF user_credits < ABS(NEW.amount) THEN
            RAISE EXCEPTION 'Insufficient credits. Required: %, Available: %', ABS(NEW.amount), user_credits;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to check credits before inserting usage transaction
CREATE TRIGGER check_credits_before_insert IF NOT EXISTS
    BEFORE INSERT ON credit_transactions
    FOR EACH ROW
    EXECUTE FUNCTION check_credit_balance();

-- =====================================================
-- FUNCTION: Automatically update user credits
-- =====================================================
CREATE OR REPLACE FUNCTION update_user_credits() IF NOT EXISTS
RETURNS TRIGGER AS $$
BEGIN
    -- Update user's credit balance
    UPDATE users 
    SET credits = credits + NEW.amount
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update user credits on transaction insert
CREATE TRIGGER update_credits_after_transaction IF NOT EXISTS
    AFTER INSERT ON credit_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_credits();

-- =====================================================
-- VIEWS
-- =====================================================

-- View for user projects with design count
IF NOT EXISTS CREATE OR REPLACE VIEW user_projects_summary AS
SELECT 
    u.id AS user_id,
    u.name AS user_name,
    u.email,
    u.credits,
    p.id AS project_id,
    p.name AS project_name,
    p.published_url,
    p.created_at AS project_created_at,
    COUNT(DISTINCT pd.design_id) AS design_count,
    COUNT(DISTINCT i.id) AS integration_count
FROM users u
LEFT JOIN projects p ON u.id = p.user_id
LEFT JOIN project_designs pd ON p.id = pd.project_id
LEFT JOIN integrations i ON p.id = i.project_id
GROUP BY u.id, u.name, u.email, u.credits, p.id, p.name, p.published_url, p.created_at;

-- View for credit usage summary
IF NOT EXISTS CREATE OR REPLACE VIEW credit_usage_summary AS
SELECT 
    u.id AS user_id,
    u.name AS user_name,
    u.credits AS current_credits,
    COALESCE(SUM(CASE WHEN ct.type = 'purchase' THEN ct.amount ELSE 0 END), 0) AS total_purchased,
    COALESCE(SUM(CASE WHEN ct.type = 'usage' THEN ABS(ct.amount) ELSE 0 END), 0) AS total_used,
    COUNT(CASE WHEN ct.type = 'purchase' THEN 1 END) AS purchase_count,
    COUNT(CASE WHEN ct.type = 'usage' THEN 1 END) AS usage_count,
    MAX(CASE WHEN ct.type = 'purchase' THEN ct.created_at END) AS last_purchase_date,
    MAX(CASE WHEN ct.type = 'usage' THEN ct.created_at END) AS last_usage_date
FROM users u
LEFT JOIN credit_transactions ct ON u.id = ct.user_id
GROUP BY u.id, u.name, u.credits;

-- =====================================================
-- INSERT PREDEFINED DESIGNS
-- =====================================================

-- Insert design templates
INSERT INTO design_templates (id, name, category, layout, styles) VALUES
('design_1', 'Modern Minimalist', 'business', 
 '{"structure": "header-main-footer", "grid": "12-column", "spacing": "comfortable"}'::jsonb,
 '{"primary_color": "#3B82F6", "secondary_color": "#10B981", "font_family": "Inter, sans-serif", "border_radius": "8px", "shadow": "subtle"}'::jsonb),
('design_2', 'Creative Agency', 'creative',
 '{"structure": "hero-features-portfolio-footer", "grid": "asymmetric", "spacing": "creative"}'::jsonb,
 '{"primary_color": "#8B5CF6", "secondary_color": "#EC4899", "font_family": "Poppins, sans-serif", "border_radius": "16px", "shadow": "bold"}'::jsonb);

-- Insert components for design_1
INSERT INTO design_components (design_id, component_id, component_type, styles, content, position) VALUES
('design_1', 'hero', 'hero',
 '{"background": "gradient", "height": "100vh"}'::jsonb,
 '{"title": "Welcome to Your New Website", "subtitle": "Beautiful and modern design", "buttonText": "Get Started"}'::jsonb,
 1);

-- Insert components for design_2
INSERT INTO design_components (design_id, component_id, component_type, styles, content, position) VALUES
('design_2', 'hero', 'hero',
 '{"background": "image-overlay", "animation": "fade-in"}'::jsonb,
 '{"title": "Creative Solutions", "subtitle": "We bring ideas to life", "buttonText": "View Work"}'::jsonb,
 1);

-- =====================================================
-- ADDITIONAL INDEXES FOR PERFORMANCE
-- =====================================================

-- Composite indexes for common queries
CREATE INDEX idx_projects_user_updated ON projects(user_id, updated_at DESC) IF NOT EXISTS;
CREATE INDEX idx_credit_transactions_user_created ON credit_transactions(user_id, created_at DESC) IF NOT EXISTS;
CREATE INDEX idx_integrations_project_type ON integrations(project_id, type) IF NOT EXISTS;
CREATE INDEX idx_project_components_project_position ON project_components(project_id, position) IF NOT EXISTS;

-- Partial indexes for active projects
CREATE INDEX idx_active_projects ON projects(id) WHERE published_url IS NOT NULL IF NOT EXISTS;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE users IS 'User accounts and profile information';
COMMENT ON TABLE projects IS 'Website projects created by users';
COMMENT ON TABLE project_designs IS 'Many-to-many relationship between projects and design templates';
COMMENT ON TABLE credit_transactions IS 'Credit purchase and usage history';
COMMENT ON TABLE integrations IS 'Third-party integrations (Stripe, Mailchimp, etc.)';
COMMENT ON TABLE design_templates IS 'Predefined design templates';
COMMENT ON TABLE design_components IS 'Components that make up design templates';
COMMENT ON TABLE project_components IS 'Customized components per project';
COMMENT ON TABLE analytics_events IS 'User activity tracking for analytics';

-- =====================================================
-- GRANT PERMISSIONS (Adjust based on your needs)
-- =====================================================

-- Create application user (run separately with proper password)
-- CREATE USER aleyo_app WITH PASSWORD 'secure_password';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO aleyo_app;
-- GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO aleyo_app;