// HomePage.js
import React, { useState, useEffect } from 'react';


const Card = () => {
  const [activeScreen, setActiveScreen] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Auto-rotate screens every 3 seconds
  useEffect(() => {
    if (!isHovering) {
      const interval = setInterval(() => {
        setActiveScreen((prev) => (prev + 1) % 3);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isHovering]);

  const screens = [
    {
      id: 1,
      title: "AI-Powered Design",
      subtitle: "Generate stunning websites with voice commands",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      icon: "🎨",
      features: ["Voice Control", "AI Suggestions", "Smart Layouts"],
      image: "/api/placeholder/400/300",
      description: "Create beautiful websites using natural language commands. Our AI understands your vision and brings it to life instantly."
    },
    {
      id: 2,
      title: "Drag & Drop Editor",
      subtitle: "Customize every element with ease",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      icon: "✨",
      features: ["Real-time Preview", "Component Library", "Responsive Design"],
      image: "/api/placeholder/400/300",
      description: "Intuitive drag-and-drop interface that puts you in control. No coding required - just creativity."
    },
    {
      id: 3,
      title: "One-Click Publishing",
      subtitle: "Launch your website in seconds",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      icon: "🚀",
      features: ["Instant Deployment", "Custom Domain", "Analytics Dashboard"],
      image: "/api/placeholder/400/300",
      description: "Deploy your website with a single click. Get a free subdomain or connect your own custom domain."
    }
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Build Websites with
            <span className="gradient-text"> AI Magic</span>
          </h1>
          <p className="hero-subtitle">
            Create stunning websites in minutes using voice commands and AI-powered design.
            No coding required. Start with 50 free credits!
          </p>
          <div className="hero-buttons">
            <button className="btn-primary">Start Building →</button>
            <button className="btn-secondary">Watch Demo</button>
          </div>
          <div className="stats">
            <div className="stat">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Websites Built</span>
            </div>
            <div className="stat">
              <span className="stat-number">4.9</span>
              <span className="stat-label">User Rating</span>
            </div>
            <div className="stat">
              <span className="stat-number">50</span>
              <span className="stat-label">Free Credits</span>
            </div>
          </div>
        </div>
      </section>

      {/* Three Screen Cards Section */}
      <section className="screens-section">
        <div className="section-header">
          <h2>Experience the Future of Web Design</h2>
          <p>Three powerful ways to build your dream website</p>
        </div>

        <div className="cards-container">
          {screens.map((screen, index) => (
            <div
              key={screen.id}
              className={`screen-card ${activeScreen === index ? 'active' : ''}`}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={() => setActiveScreen(index)}
              style={{ '--gradient': screen.gradient }}
            >
              {/* Card Header */}
              <div className="card-header">
                <div className="card-icon" style={{ background: screen.gradient }}>
                  {screen.icon}
                </div>
                <h3>{screen.title}</h3>
                <p className="card-subtitle">{screen.subtitle}</p>
              </div>

              {/* Screen Mockup */}
              <div className="screen-mockup">
                <div className="mockup-browser">
                  <div className="browser-bar">
                    <div className="browser-dots">
                      <span className="dot red"></span>
                      <span className="dot yellow"></span>
                      <span className="dot green"></span>
                    </div>
                    <div className="browser-url">https://aleyo.app/builder</div>
                  </div>
                  <div className="browser-content" style={{ background: screen.gradient }}>
                    <div className="screen-preview">
                      {/* Animated content based on active screen */}
                      {activeScreen === index && (
                        <div className="preview-animation">
                          {screen.id === 1 && (
                            <div className="voice-command-animation">
                              <div className="voice-wave">
                                <span></span><span></span><span></span><span></span>
                              </div>
                              <p>"Create a modern portfolio with blue theme"</p>
                              <div className="ai-response">
                                <span className="loading-dot">●</span>
                                Generating your design...
                              </div>
                            </div>
                          )}
                          
                          {screen.id === 2 && (
                            <div className="drag-drop-animation">
                              <div className="draggable-element">
                                <div className="element-icon">📦</div>
                                <span>Hero Section</span>
                              </div>
                              <div className="draggable-element">
                                <div className="element-icon">🎨</div>
                                <span>Color Palette</span>
                              </div>
                              <div className="draggable-element">
                                <div className="element-icon">📝</div>
                                <span>Text Block</span>
                              </div>
                              <div className="drop-zone">
                                Drop here to add component
                              </div>
                            </div>
                          )}
                          
                          {screen.id === 3 && (
                            <div className="publish-animation">
                              <div className="publish-steps">
                                <div className="step completed">
                                  <span>✓</span> Design Ready
                                </div>
                                <div className="step active">
                                  <span>🚀</span> Publishing...
                                </div>
                                <div className="step">
                                  <span>🌐</span> Live Website
                                </div>
                              </div>
                              <div className="url-preview">
                                https://yourwebsite.aleyo.app
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Static preview when not active */}
                      {activeScreen !== index && (
                        <div className="static-preview">
                          <div className="feature-list">
                            {screen.features.map((feature, i) => (
                              <div key={i} className="feature-item">
                                <span className="feature-check">✓</span>
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="card-footer">
                <p className="card-description">{screen.description}</p>
                <button className="card-button">
                  Learn More <span>→</span>
                </button>
              </div>

              {/* Active Indicator */}
              <div className="active-indicator">
                <div className={`indicator-dot ${activeScreen === index ? 'active' : ''}`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="navigation-dots">
          {screens.map((_, index) => (
            <button
              key={index}
              className={`nav-dot ${activeScreen === index ? 'active' : ''}`}
              onClick={() => setActiveScreen(index)}
            />
          ))}
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="features-section">
        <h2>Everything you need to build amazing websites</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎤</div>
            <h3>Voice Commands</h3>
            <p>Just say it and watch your website come to life</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Assistant</h3>
            <p>Get smart suggestions and design improvements</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>40+ Templates</h3>
            <p>Professionally designed templates to start with</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔌</div>
            <h3>Integrations</h3>
            <p>Connect Stripe, Mailchimp, Calendly and more</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Card;