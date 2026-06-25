import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// ─── Helpers ────────────────────────────────────────────────────────────────

const alpha = (hex, opacity) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const DEVICE_WIDTHS = { mobile: 375, tablet: 768, desktop: null };

// ─── Component Renderers ────────────────────────────────────────────────────

const HeroSection = ({ component, gs }) => (
  <section
    style={{
      textAlign: 'center',
      padding: '80px 40px',
      background: `linear-gradient(135deg, ${gs.primaryColor}, ${gs.secondaryColor})`,
      borderRadius: gs.borderRadius,
      margin: '0 0 40px',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* subtle noise overlay */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
        pointerEvents: 'none',
      }}
    />
    {component.content.image && (
      <img
        src={component.content.image}
        alt="Hero"
        style={{
          maxWidth: '100%',
          height: 'auto',
          marginBottom: 32,
          borderRadius: gs.borderRadius,
          display: 'block',
          margin: '0 auto 32px',
        }}
      />
    )}
    <h1
      style={{
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: 800,
        margin: '0 0 20px',
        color: '#fff',
        lineHeight: 1.15,
        letterSpacing: '-0.02em',
      }}
    >
      {component.content.title}
    </h1>
    <p
      style={{
        fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
        margin: '0 auto 36px',
        color: 'rgba(255,255,255,0.88)',
        maxWidth: 660,
        lineHeight: 1.6,
      }}
    >
      {component.content.subtitle}
    </p>
    <button
      style={{
        background: '#fff',
        color: gs.primaryColor,
        border: 'none',
        padding: '14px 36px',
        fontSize: '1rem',
        fontWeight: 700,
        borderRadius: gs.buttonStyle === 'rounded' ? '999px' : gs.borderRadius,
        cursor: 'pointer',
        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
        transition: 'all 0.2s ease',
        fontFamily: gs.fontFamily,
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.25)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'none';
        e.target.style.boxShadow = '0 4px 24px rgba(0,0,0,0.18)';
      }}
    >
      {component.content.buttonText}
    </button>
  </section>
);

const FeaturesSection = ({ component, gs }) => (
  <section style={{ padding: '72px 0', ...component.styles }}>
    <h2
      style={{
        textAlign: 'center',
        fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
        fontWeight: 800,
        marginBottom: 56,
        color: gs.headingColor,
        letterSpacing: '-0.02em',
      }}
    >
      {component.content.title}
    </h2>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 28,
      }}
    >
      {component.content.items.map((item, i) => (
        <div
          key={i}
          style={{
            background: alpha(gs.primaryColor, 0.06),
            borderRadius: gs.borderRadius,
            padding: 32,
            textAlign: 'center',
            border: `1px solid ${alpha(gs.primaryColor, 0.12)}`,
            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = `0 16px 48px ${alpha(gs.primaryColor, 0.15)}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {item.image && (
            <img
              src={item.image}
              alt={item.title}
              style={{
                width: '100%',
                height: 200,
                objectFit: 'cover',
                borderRadius: gs.borderRadius,
                marginBottom: 20,
              }}
            />
          )}
          <h3
            style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              marginBottom: 12,
              color: gs.primaryColor,
            }}
          >
            {item.title}
          </h3>
          <p style={{ color: alpha(gs.textColor, 0.75), lineHeight: 1.65, margin: 0 }}>
            {item.description}
          </p>
        </div>
      ))}
    </div>
  </section>
);

const GallerySection = ({ component, gs }) => (
  <section style={{ padding: '72px 0', ...component.styles }}>
    <h2
      style={{
        textAlign: 'center',
        fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
        fontWeight: 800,
        marginBottom: 56,
        color: gs.headingColor,
        letterSpacing: '-0.02em',
      }}
    >
      {component.content.title}
    </h2>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 24,
      }}
    >
      {component.content.items.map((item, i) => (
        <div
          key={i}
          style={{
            background: alpha(gs.primaryColor, 0.05),
            borderRadius: gs.borderRadius,
            overflow: 'hidden',
            border: `1px solid ${alpha(gs.primaryColor, 0.1)}`,
            transition: 'transform 0.25s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
          }}
        >
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div
              style={{
                height: 220,
                background: alpha(gs.primaryColor, 0.18),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill={alpha(gs.primaryColor, 0.5)}>
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
              </svg>
            </div>
          )}
          <div style={{ padding: '18px 20px' }}>
            <h3
              style={{
                margin: '0 0 8px',
                fontSize: '1.05rem',
                fontWeight: 700,
                color: gs.headingColor,
              }}
            >
              {item.title}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: '0.9rem',
                color: alpha(gs.textColor, 0.7),
                lineHeight: 1.55,
              }}
            >
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const ContactSection = ({ component, gs }) => (
  <section style={{ padding: '72px 0', ...component.styles }}>
    <h2
      style={{
        textAlign: 'center',
        fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
        fontWeight: 800,
        marginBottom: 56,
        color: gs.headingColor,
        letterSpacing: '-0.02em',
      }}
    >
      {component.content.title}
    </h2>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 32,
      }}
    >
      <div
        style={{
          background: alpha(gs.primaryColor, 0.05),
          borderRadius: gs.borderRadius,
          padding: 36,
          border: `1px solid ${alpha(gs.primaryColor, 0.1)}`,
        }}
      >
        {['Name', 'Email'].map((ph) => (
          <input
            key={ph}
            placeholder={ph}
            readOnly
            style={{
              width: '100%',
              padding: '12px 16px',
              marginBottom: 16,
              background: alpha(gs.primaryColor, 0.04),
              border: `1px solid ${alpha(gs.textColor, 0.18)}`,
              borderRadius: gs.borderRadius,
              color: gs.textColor,
              fontFamily: gs.fontFamily,
              fontSize: '0.95rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        ))}
        <textarea
          placeholder="Message"
          readOnly
          rows={5}
          style={{
            width: '100%',
            padding: '12px 16px',
            marginBottom: 20,
            background: alpha(gs.primaryColor, 0.04),
            border: `1px solid ${alpha(gs.textColor, 0.18)}`,
            borderRadius: gs.borderRadius,
            color: gs.textColor,
            fontFamily: gs.fontFamily,
            fontSize: '0.95rem',
            resize: 'vertical',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        <button
          style={{
            width: '100%',
            padding: '14px',
            background: gs.primaryColor,
            color: '#fff',
            border: 'none',
            borderRadius: gs.buttonStyle === 'rounded' ? '999px' : gs.borderRadius,
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            fontFamily: gs.fontFamily,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => {
            e.target.style.opacity = '0.85';
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = '1';
          }}
        >
          Send Message
        </button>
      </div>
      <div
        style={{
          background: alpha(gs.primaryColor, 0.05),
          borderRadius: gs.borderRadius,
          padding: 36,
          border: `1px solid ${alpha(gs.primaryColor, 0.1)}`,
        }}
      >
        <h3 style={{ margin: '0 0 24px', color: gs.headingColor, fontWeight: 700 }}>
          Contact Information
        </h3>
        {[
          { icon: '📍', value: component.content.address },
          { icon: '📧', value: component.content.email },
          { icon: '📞', value: component.content.phone },
        ].map(({ icon, value }) => (
          <p
            key={icon}
            style={{
              margin: '0 0 16px',
              color: alpha(gs.textColor, 0.85),
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
            }}
          >
            <span>{icon}</span>
            <span>{value}</span>
          </p>
        ))}
      </div>
    </div>
  </section>
);

const PricingSection = ({ component, gs }) => (
  <section style={{ padding: '72px 0', ...component.styles }}>
    <h2
      style={{
        textAlign: 'center',
        fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
        fontWeight: 800,
        marginBottom: 56,
        color: gs.headingColor,
        letterSpacing: '-0.02em',
      }}
    >
      {component.content.title}
    </h2>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 28,
        maxWidth: 960,
        margin: '0 auto',
      }}
    >
      {component.content.plans.map((plan, i) => (
        <div
          key={i}
          style={{
            background: alpha(gs.primaryColor, i === 1 ? 0.12 : 0.05),
            borderRadius: gs.borderRadius,
            padding: '36px 28px',
            textAlign: 'center',
            border: `${i === 1 ? '2px' : '1px'} solid ${alpha(gs.primaryColor, i === 1 ? 0.5 : 0.12)}`,
            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
            position: 'relative',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = `0 16px 48px ${alpha(gs.primaryColor, 0.15)}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {i === 1 && (
            <div
              style={{
                position: 'absolute',
                top: -14,
                left: '50%',
                transform: 'translateX(-50%)',
                background: gs.primaryColor,
                color: '#fff',
                padding: '4px 18px',
                borderRadius: 999,
                fontSize: '0.78rem',
                fontWeight: 700,
              }}
            >
              Most Popular
            </div>
          )}
          <h3
            style={{
              margin: '0 0 8px',
              color: gs.primaryColor,
              fontWeight: 700,
              fontSize: '1.15rem',
            }}
          >
            {plan.name}
          </h3>
          <div
            style={{
              fontSize: '3rem',
              fontWeight: 900,
              margin: '16px 0',
              color: gs.headingColor,
              lineHeight: 1,
            }}
          >
            {plan.price}
          </div>
          <hr
            style={{
              border: 'none',
              borderTop: `1px solid ${alpha(gs.textColor, 0.12)}`,
              margin: '20px 0',
            }}
          />
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', textAlign: 'left' }}>
            {plan.features.map((f, fi) => (
              <li
                key={fi}
                style={{
                  padding: '6px 0',
                  color: alpha(gs.textColor, 0.8),
                  display: 'flex',
                  gap: 10,
                  alignItems: 'center',
                  fontSize: '0.95rem',
                }}
              >
                <span style={{ color: gs.primaryColor, fontWeight: 700 }}>✓</span> {f}
              </li>
            ))}
          </ul>
          <button
            style={{
              width: '100%',
              padding: '13px',
              background: i === 1 ? gs.primaryColor : 'transparent',
              color: i === 1 ? '#fff' : gs.primaryColor,
              border: `2px solid ${gs.primaryColor}`,
              borderRadius: gs.buttonStyle === 'rounded' ? '999px' : gs.borderRadius,
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              fontFamily: gs.fontFamily,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = gs.primaryColor;
              e.target.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = i === 1 ? gs.primaryColor : 'transparent';
              e.target.style.color = i === 1 ? '#fff' : gs.primaryColor;
            }}
          >
            Choose Plan
          </button>
        </div>
      ))}
    </div>
  </section>
);

const renderComponent = (component, gs) => {
  switch (component.type) {
    case 'hero':
      return <HeroSection key={component.id} component={component} gs={gs} />;
    case 'features':
      return <FeaturesSection key={component.id} component={component} gs={gs} />;
    case 'gallery':
      return <GallerySection key={component.id} component={component} gs={gs} />;
    case 'contact':
      return <ContactSection key={component.id} component={component} gs={gs} />;
    case 'pricing':
      return <PricingSection key={component.id} component={component} gs={gs} />;
    default:
      return null;
  }
};

// ─── Toolbar ─────────────────────────────────────────────────────────────────

const PreviewToolbar = ({ projectName, device, setDevice, onBack, onOpenInStudio }) => {
  const [copied, setCopied] = useState(false);

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const DeviceBtn = ({ id, label, icon }) => (
    <button
      onClick={() => setDevice(id)}
      title={label}
      style={{
        background: device === id ? 'rgba(255,255,255,0.15)' : 'transparent',
        border: 'none',
        borderRadius: 8,
        padding: '7px 10px',
        cursor: 'pointer',
        color: device === id ? '#fff' : 'rgba(255,255,255,0.5)',
        transition: 'all 0.15s',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {icon}
    </button>
  );

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: 'rgba(8, 12, 20, 0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        height: 56,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 8,
            padding: '6px 14px',
            color: 'rgba(255,255,255,0.8)',
            cursor: 'pointer',
            fontSize: '0.82rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          Back to Editor
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#3ED67C',
              boxShadow: '0 0 6px #3ED67C',
            }}
          />
          <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.88rem', fontWeight: 600 }}>
            {projectName || 'Untitled Project'}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>Preview</span>
        </div>
      </div>

      {/* Center — device switcher */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          background: 'rgba(255,255,255,0.06)',
          borderRadius: 10,
          padding: '3px 4px',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <DeviceBtn
          id="mobile"
          label="Mobile (375px)"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5S10.67 19 11.5 19s1.5.67 1.5 1.5S12.33 22 11.5 22zm4.5-4H7V4h9v14z" />
            </svg>
          }
        />
        <DeviceBtn
          id="tablet"
          label="Tablet (768px)"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.5 0h-14C3.12 0 2 1.12 2 2.5v19C2 22.88 3.12 24 4.5 24h14c1.38 0 2.5-1.12 2.5-2.5v-19C21 1.12 19.88 0 18.5 0zm-7 23c-.83 0-1.5-.67-1.5-1.5S10.67 20 11.5 20s1.5.67 1.5 1.5S12.33 23 11.5 23zm7.5-4H4V3h15v16z" />
            </svg>
          }
        />
        <DeviceBtn
          id="desktop"
          label="Desktop (full)"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 12H3V4h18v10z" />
            </svg>
          }
        />
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={copyUrl}
          style={{
            background: copied ? 'rgba(62, 214, 124, 0.15)' : 'rgba(255,255,255,0.07)',
            border: `1px solid ${copied ? 'rgba(62,214,124,0.4)' : 'rgba(255,255,255,0.12)'}`,
            borderRadius: 8,
            padding: '6px 14px',
            color: copied ? '#3ED67C' : 'rgba(255,255,255,0.8)',
            cursor: 'pointer',
            fontSize: '0.82rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.2s',
          }}
        >
          {copied ? (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>{' '}
              Copied!
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
              </svg>{' '}
              Copy Link
            </>
          )}
        </button>
        {onOpenInStudio && (
          <button
            onClick={onOpenInStudio}
            style={{
              background: 'linear-gradient(135deg, #4F6EF7, #2DBCB6)',
              border: 'none',
              borderRadius: 8,
              padding: '7px 16px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 2px 12px rgba(79,110,247,0.3)',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.88';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
            Edit in Studio
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Empty State ─────────────────────────────────────────────────────────────

const EmptyState = ({ onBack }) => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#080C14',
      color: '#fff',
      fontFamily: 'system-ui, sans-serif',
      gap: 20,
      padding: 40,
      textAlign: 'center',
    }}
  >
    <div style={{ fontSize: 64, marginBottom: 8 }}>🎨</div>
    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: '#fff' }}>
      No project found
    </h2>
    <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, maxWidth: 400, lineHeight: 1.6 }}>
      This preview couldn't load a project. Make sure you've saved your design in the Design Studio
      first.
    </p>
    <button
      onClick={onBack}
      style={{
        marginTop: 8,
        background: 'linear-gradient(135deg, #4F6EF7, #2DBCB6)',
        color: '#fff',
        border: 'none',
        borderRadius: 12,
        padding: '12px 28px',
        fontWeight: 700,
        fontSize: '1rem',
        cursor: 'pointer',
      }}
    >
      Go to Design Studio
    </button>
  </div>
);

// ─── Main Preview Page ───────────────────────────────────────────────────────

const PreviewPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [device, setDevice] = useState('desktop');
  const [pageEntered, setPageEntered] = useState(false);

  useEffect(() => {
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');
    const isPublished = searchParams.get('published') === 'true';
    let data = null;

    // Try slug-based lookup first (most specific)
    if (slug) {
      try {
        data = JSON.parse(localStorage.getItem(`published_slug_${slug}`));
      } catch (_) {}
    }
    // Try ID-based published lookup
    if (!data && id && isPublished) {
      try {
        data = JSON.parse(localStorage.getItem(`published_${id}`));
      } catch (_) {}
    }
    // Try plain project ID lookup
    if (!data && id) {
      try {
        data = JSON.parse(localStorage.getItem(`project_${id}`));
      } catch (_) {}
    }
    // Fall back to latest saved project
    if (!data) {
      try {
        data = JSON.parse(localStorage.getItem('latest_project_data'));
      } catch (_) {}
    }

    setProject(data);
    setLoading(false);

    // Trigger entrance animation
    setTimeout(() => setPageEntered(true), 50);
  }, [searchParams]);

  const gs = project?.styles || {
    primaryColor: '#4F6EF7',
    secondaryColor: '#2DBCB6',
    accentColor: '#3ED67C',
    fontFamily: 'Inter, sans-serif',
    backgroundColor: '#080C14',
    textColor: '#FFFFFF',
    headingColor: '#FFFFFF',
    borderRadius: '12px',
    spacing: '24px',
    buttonStyle: 'rounded',
  };

  const handleBack = () => navigate(-1);
  const handleOpenInStudio = () => navigate('/design-studio');

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#080C14',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            border: '3px solid rgba(79,110,247,0.2)',
            borderTopColor: '#4F6EF7',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!project) return <EmptyState onBack={handleBack} />;

  const deviceWidth = DEVICE_WIDTHS[device];
  const components = project.components || [];
  const textElements = project.textElements || [];
  const imageElements = project.imageElements || [];

  const backgroundStyle = {
    backgroundColor: gs.backgroundColor,
    ...(gs.backgroundGradient && { backgroundImage: gs.backgroundGradient }),
    ...(gs.backgroundImage && {
      backgroundImage: `url(${gs.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }),
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0d1120', fontFamily: gs.fontFamily }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; padding: 0; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1);    }
        }
        .preview-canvas {
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @media (max-width: 480px) {
          .toolbar-hide { display: none !important; }
        }
      `}</style>

      <PreviewToolbar
        projectName={project.name}
        device={device}
        setDevice={setDevice}
        onBack={handleBack}
        onOpenInStudio={handleOpenInStudio}
      />

      {/* Canvas wrapper */}
      <div
        style={{
          paddingTop: 56,
          minHeight: '100vh',
          background:
            device !== 'desktop'
              ? 'radial-gradient(ellipse at 50% 0%, rgba(79,110,247,0.06) 0%, transparent 70%), #0d1120'
              : 'transparent',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: device !== 'desktop' ? '56px 20px 40px' : '56px 0 0',
        }}
      >
        {/* Device chrome for non-desktop */}
        {device !== 'desktop' && (
          <div
            style={{
              width: '100%',
              maxWidth: deviceWidth ? deviceWidth + 40 : '100%',
              animation: pageEntered ? 'scaleIn 0.4s ease both' : 'none',
            }}
          >
            {/* Device frame top */}
            <div
              style={{
                background: '#1c2033',
                borderRadius: '24px 24px 0 0',
                padding: '14px 20px 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid rgba(255,255,255,0.08)',
                borderBottom: 'none',
              }}
            >
              <div style={{ display: 'flex', gap: 6 }}>
                {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
                  <div
                    key={c}
                    style={{ width: 12, height: 12, borderRadius: '50%', background: c }}
                  />
                ))}
              </div>
              <div
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: 8,
                  padding: '4px 16px',
                  color: 'rgba(255,255,255,0.35)',
                  fontSize: '0.75rem',
                  fontFamily: 'system-ui, sans-serif',
                  flex: 1,
                  maxWidth: 260,
                  margin: '0 16px',
                  textAlign: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {window.location.hostname}/preview
              </div>
              <div style={{ width: 46 }} />
            </div>

            {/* Scrollable device screen */}
            <div
              style={{
                width: '100%',
                maxHeight: device === 'mobile' ? '80vh' : '75vh',
                overflowY: 'auto',
                border: '1px solid rgba(255,255,255,0.08)',
                borderTop: 'none',
                borderRadius: '0 0 24px 24px',
                ...backgroundStyle,
              }}
            >
              <PreviewContent
                components={components}
                textElements={textElements}
                imageElements={imageElements}
                gs={gs}
                pageEntered={pageEntered}
              />
            </div>

            {/* Home bar */}
            {device === 'mobile' && (
              <div style={{ textAlign: 'center', paddingTop: 12 }}>
                <div
                  style={{
                    width: 120,
                    height: 5,
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: 3,
                    margin: '0 auto',
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Desktop — full bleed */}
        {device === 'desktop' && (
          <div
            style={{
              width: '100%',
              animation: pageEntered ? 'fadeUp 0.5s ease both' : 'none',
              ...backgroundStyle,
              minHeight: 'calc(100vh - 56px)',
            }}
          >
            <PreviewContent
              components={components}
              textElements={textElements}
              imageElements={imageElements}
              gs={gs}
              pageEntered={pageEntered}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Preview Content (the actual site rendering) ─────────────────────────────

const PreviewContent = ({ components, textElements, imageElements, gs, pageEntered }) => {
  return (
    <div
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '40px 32px',
        fontFamily: gs.fontFamily,
        color: gs.textColor,
        opacity: pageEntered ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}
    >
      {/* Text Elements */}
      {textElements.map((el, i) => {
        const Tag = el.tag || 'p';
        const props = {
          key: el.id,
          style: {
            ...el.styles,
            animation: pageEntered ? `fadeUp 0.5s ease ${i * 0.05}s both` : 'none',
          },
        };
        if (Tag === 'a') props.href = el.href || '#';
        return React.createElement(Tag, props, el.content);
      })}

      {/* Image Elements */}
      {imageElements.map((el, i) => (
        <img
          key={el.id}
          src={el.imageUrl}
          alt={el.alt || ''}
          style={{
            width: el.width,
            height: el.height,
            objectFit: el.objectFit,
            borderRadius: el.borderRadius,
            filter: el.styles?.filter,
            transform: el.styles?.transform,
            display: 'block',
            margin: '0 0 24px',
            animation: pageEntered ? `fadeUp 0.5s ease ${i * 0.05}s both` : 'none',
          }}
        />
      ))}

      {/* Component Sections */}
      {components.map((c, i) => (
        <div
          key={c.id}
          style={{
            animation: pageEntered ? `fadeUp 0.6s ease ${i * 0.08}s both` : 'none',
          }}
        >
          {renderComponent(c, gs)}
        </div>
      ))}

      {/* Empty canvas message */}
      {components.length === 0 && textElements.length === 0 && imageElements.length === 0 && (
        <div
          style={{ textAlign: 'center', padding: '100px 20px', color: 'rgba(255,255,255,0.25)' }}
        >
          <div style={{ fontSize: 64, marginBottom: 16 }}>🖼️</div>
          <p style={{ fontSize: '1.1rem', margin: 0 }}>
            This canvas is empty. Add components in the Design Studio.
          </p>
        </div>
      )}
    </div>
  );
};

export default PreviewPage;
