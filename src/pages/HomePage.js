// HomePage.js — Aleyo redesign with integrated 3D-style rotating cards
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Paper,
  Snackbar,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  alpha,
  Switch,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Mic,
  Close,
  Star,
  CheckCircle,
  Payment,
  Email,
  CalendarToday,
  Description,
  Rocket,
  Business,
  Apartment,
  CloudQueue,
  SupportAgent,
  Analytics,
  Storage,
} from '@mui/icons-material';
import Logo from '.././logo.png';

// ─── Gradient colours extracted from the LOGO ────────────────────────────────
// Blue → Teal/Green gradient matching the Aleyo LOGO
const G_START = '#4F6EF7'; // blue-purple (left side of A)
const G_MID = '#2DBCB6'; // teal
const G_END = '#3ED67C'; // vivid green (bottom of A)
const GRAD = `linear-gradient(135deg, ${G_START} 0%, ${G_MID} 50%, ${G_END} 100%)`;

// ─── Shared section-header chip ───────────────────────────────────────────────
const SectionChip = ({ label }) => (
  <Chip
    label={label}
    sx={{
      mb: 2,
      background: 'rgba(79,110,247,0.15)',
      border: '1px solid rgba(79,110,247,0.3)',
      color: G_START,
      fontWeight: 600,
      letterSpacing: '0.05em',
      borderRadius: '999px',
    }}
  />
);

// ─── Integrated Card Component (from Cards.js) ───────────────────────────────
const FeatureCard = () => {
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
      title: 'AI-Powered Design',
      subtitle: 'Generate stunning websites with voice commands',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      icon: '🎨',
      features: ['Voice Control', 'AI Suggestions', 'Smart Layouts'],
      image: '/api/placeholder/400/300',
      description:
        'Create beautiful websites using natural language commands. Our AI understands your vision and brings it to life instantly.',
    },
    {
      id: 2,
      title: 'Drag & Drop Editor',
      subtitle: 'Customize every element with ease',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      icon: '✨',
      features: ['Real-time Preview', 'Component Library', 'Responsive Design'],
      image: '/api/placeholder/400/300',
      description:
        'Intuitive drag-and-drop interface that puts you in control. No coding required - just creativity.',
    },
    {
      id: 3,
      title: 'One-Click Publishing',
      subtitle: 'Launch your website in seconds',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      icon: '🚀',
      features: ['Instant Deployment', 'Custom Domain', 'Analytics Dashboard'],
      image: '/api/placeholder/400/300',
      description:
        'Deploy your website with a single click. Get a free subdomain or connect your own custom domain.',
    },
  ];

  return (
    <>
      <section className="screens-section" style={{ marginTop: '40px' }}>
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <SectionChip label="✨ Experience the Future" />
          <Typography variant="h3" fontWeight={800} sx={{ color: 'white', mb: 1 }}>
            Three powerful ways to build
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>
            Your dream website, your way
          </Typography>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '24px',
            justifyContent: 'center',
            alignItems: 'stretch',
          }}
        >
          {screens.map((screen, index) => (
            <div
              key={screen.id}
              style={{
                flex: '1 1 300px',
                minWidth: '280px',
                maxWidth: '360px',
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(12px)',
                borderRadius: '24px',
                border:
                  activeScreen === index
                    ? `2px solid ${G_START}`
                    : '1px solid rgba(255,255,255,0.08)',
                transition: 'all 0.3s ease',
                transform: activeScreen === index ? 'translateY(-8px)' : 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative',
              }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={() => setActiveScreen(index)}
            >
              {/* Card Header */}
              <div style={{ padding: '24px 24px 16px', textAlign: 'center' }}>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    background: screen.gradient,
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '30px',
                    margin: '0 auto 16px',
                  }}
                >
                  {screen.icon}
                </div>
                <Typography variant="h5" fontWeight={700} sx={{ color: 'white', mb: 1 }}>
                  {screen.title}
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                  {screen.subtitle}
                </Typography>
              </div>

              {/* Screen Mockup */}
              <div style={{ padding: '0 16px' }}>
                <div
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(0,0,0,0.5)',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <span
                        style={{
                          width: '10px',
                          height: '10px',
                          background: '#ff5f57',
                          borderRadius: '50%',
                        }}
                      ></span>
                      <span
                        style={{
                          width: '10px',
                          height: '10px',
                          background: '#ffbd2e',
                          borderRadius: '50%',
                        }}
                      ></span>
                      <span
                        style={{
                          width: '10px',
                          height: '10px',
                          background: '#28c940',
                          borderRadius: '50%',
                        }}
                      ></span>
                    </div>
                    <Typography
                      sx={{
                        fontSize: '0.7rem',
                        color: 'rgba(255,255,255,0.5)',
                        flex: 1,
                        textAlign: 'center',
                      }}
                    >
                      https://aleyo.app/builder
                    </Typography>
                  </div>
                  <div
                    style={{
                      background: screen.gradient,
                      padding: '20px',
                      minHeight: '200px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {activeScreen === index && (
                      <div style={{ width: '100%' }}>
                        {screen.id === 1 && (
                          <div style={{ textAlign: 'center' }}>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '4px',
                                marginBottom: '12px',
                              }}
                            >
                              {[...Array(4)].map((_, i) => (
                                <span
                                  key={i}
                                  style={{
                                    width: '4px',
                                    height: '20px',
                                    background: 'white',
                                    borderRadius: '2px',
                                    animation: 'pulse 1s infinite',
                                  }}
                                ></span>
                              ))}
                            </div>
                            <Typography
                              sx={{
                                color: 'white',
                                fontSize: '0.9rem',
                                background: 'rgba(0,0,0,0.5)',
                                padding: '8px',
                                borderRadius: '8px',
                                mb: 1,
                              }}
                            >
                              "Create a modern portfolio with blue theme"
                            </Typography>
                            <Typography sx={{ color: 'white', fontSize: '0.8rem' }}>
                              <span
                                style={{ display: 'inline-block', animation: 'blink 1s infinite' }}
                              >
                                ●
                              </span>{' '}
                              Generating your design...
                            </Typography>
                          </div>
                        )}
                        {screen.id === 2 && (
                          <div>
                            {['📦 Hero Section', '🎨 Color Palette', '📝 Text Block'].map(
                              (item, i) => (
                                <div
                                  key={i}
                                  style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    marginBottom: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    cursor: 'grab',
                                  }}
                                >
                                  <span>{item.split(' ')[0]}</span>
                                  <span style={{ fontSize: '0.8rem' }}>{item.split(' ')[1]}</span>
                                </div>
                              )
                            )}
                            <div
                              style={{
                                background: 'rgba(0,0,0,0.5)',
                                padding: '12px',
                                borderRadius: '8px',
                                textAlign: 'center',
                                fontSize: '0.8rem',
                                marginTop: '8px',
                              }}
                            >
                              Drop here to add component
                            </div>
                          </div>
                        )}
                        {screen.id === 3 && (
                          <div>
                            <div style={{ marginBottom: '12px' }}>
                              {['✓ Design Ready', '🚀 Publishing...', '🌐 Live Website'].map(
                                (step, i) => (
                                  <div
                                    key={i}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px',
                                      marginBottom: '8px',
                                      opacity: i === 1 ? 1 : 0.6,
                                    }}
                                  >
                                    <span>{step}</span>
                                  </div>
                                )
                              )}
                            </div>
                            <div
                              style={{
                                background: 'rgba(0,0,0,0.5)',
                                padding: '8px',
                                borderRadius: '8px',
                                textAlign: 'center',
                                fontSize: '0.7rem',
                              }}
                            >
                              https://yourwebsite.aleyo.app
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {activeScreen !== index && (
                      <div style={{ width: '100%' }}>
                        {screen.features.map((feature, i) => (
                          <div
                            key={i}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              marginBottom: '8px',
                              color: 'white',
                              fontSize: '0.9rem',
                            }}
                          >
                            <span>✓</span>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div style={{ padding: '16px 24px 24px', flex: 1 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', mb: 2 }}>
                  {screen.description}
                </Typography>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{
                    borderColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    borderRadius: '999px',
                    textTransform: 'none',
                    '&:hover': { borderColor: G_START, background: 'rgba(79,110,247,0.1)' },
                  }}
                >
                  Learn More →
                </Button>
              </div>

              {/* Active Indicator */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: '4px',
                }}
              >
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: activeScreen === index ? G_START : 'rgba(255,255,255,0.3)',
                    transition: 'all 0.3s',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
          {screens.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveScreen(index)}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: activeScreen === index ? G_START : 'rgba(255,255,255,0.3)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>

        <style>{`
        @keyframes pulse {
          0%, 100% { height: 20px; }
          50% { height: 30px; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
      </section>
    </>
  );
};

// Updated pricing plans matching Pricing.js structure
const pricingPlans = [
  {
    id: 'starter',
    name: 'Starter',
    icon: <Rocket />,
    priceMonthly: 29,
    priceYearly: 290,
    credits: 500,
    features: [
      '500 AI credits per month',
      'Up to 3 websites',
      'Basic templates',
      'Email support',
      'SSL certificate',
      'Custom domain',
    ],
    popular: false,
    color: G_START,
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: <Business />,
    priceMonthly: 79,
    priceYearly: 790,
    credits: 2000,
    features: [
      '2000 AI credits per month',
      'Up to 15 websites',
      'All templates',
      'Priority support',
      'Advanced analytics',
      'Custom code injection',
      'E-commerce features',
      'API access',
    ],
    popular: true,
    color: G_MID,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: <Apartment />,
    priceMonthly: 199,
    priceYearly: 1990,
    credits: 10000,
    features: [
      '10000 AI credits per month',
      'Unlimited websites',
      'Custom templates',
      '24/7 dedicated support',
      'White-label options',
      'Team collaboration',
      'Advanced security',
      'SLA guarantee',
      'Custom integrations',
    ],
    popular: false,
    color: G_END,
  },
];

const addons = [
  { name: 'Additional Credits (500)', price: 25, icon: <CloudQueue /> },
  { name: 'Priority Support', price: 49, icon: <SupportAgent /> },
  { name: 'Advanced Analytics', price: 29, icon: <Analytics /> },
  { name: 'Extra Storage (10GB)', price: 15, icon: <Storage /> },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedDesigns, setSelectedDesigns] = useState([]);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceResponse, setVoiceResponse] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [activeIntegrations, setActiveIntegrations] = useState([]);
  const [mergeMessage, setMergeMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // New state for pricing section
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState([]);

  const designsList = [
    {
      id: 1,
      name: 'Modern Business',
      category: 'business',
      primary: G_START,
      secondary: G_MID,
      layout: 'Grid',
      description: 'Perfect for corporate sites',
    },
    {
      id: 2,
      name: 'Creative Portfolio',
      category: 'portfolio',
      primary: '#8B5CF6',
      secondary: '#EC4899',
      layout: 'Masonry',
      description: 'Showcase your work beautifully',
    },
    {
      id: 3,
      name: 'Elegant Ecomm',
      category: 'ecommerce',
      primary: '#F59E0B',
      secondary: '#EF4444',
      layout: 'Product Showcase',
      description: 'Sell products with style',
    },
    {
      id: 4,
      name: 'Startup Launch',
      category: 'startup',
      primary: '#06B6D4',
      secondary: G_START,
      layout: 'Hero Centric',
      description: 'Launch your next big idea',
    },
    {
      id: 5,
      name: 'Restaurant Delight',
      category: 'restaurant',
      primary: '#DC2626',
      secondary: '#F59E0B',
      layout: 'Menu',
      description: 'Showcase your menu',
    },
    {
      id: 6,
      name: 'Education Hub',
      category: 'education',
      primary: G_END,
      secondary: G_MID,
      layout: 'Course Cards',
      description: 'Share knowledge',
    },
  ];

  const integrationTypes = [
    { name: 'Stripe', icon: Payment, color: '#635BFF', description: 'Payment processing' },
    { name: 'Mailchimp', icon: Email, color: '#FFE01B', description: 'Email marketing' },
    { name: 'Calendly', icon: CalendarToday, color: '#00A2FF', description: 'Scheduling' },
    { name: 'Google Forms', icon: Description, color: '#4285F4', description: 'Form builder' },
  ];

  const showNotification = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    if (
      voiceModalOpen &&
      isListening &&
      ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
    ) {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SR();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.onresult = (e) => {
        const t = e.results[0][0].transcript;
        setTranscript(t);
        processVoiceCommand(t);
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => {
        setIsListening(false);
        setVoiceResponse("Sorry, I didn't catch that. Please try again.");
        showNotification('Voice recognition error. Please try again.', 'error');
      };
      recognition.start();
      return () => {
        try {
          recognition.abort();
        } catch (_) {}
      };
    }
  }, [isListening, voiceModalOpen]);

  const processVoiceCommand = (command) => {
    const lower = command.toLowerCase();
    let reply = '';
    if (lower.includes('change color') || lower.includes('blue'))
      reply = '🎨 Changing primary color.';
    else if (lower.includes('add contact form')) reply = '📝 Contact form component added.';
    else if (lower.includes('merge') && (lower.includes('design') || lower.includes('designs'))) {
      reply = '⚡ Merging selected designs — new hybrid layout ready.';
      if (selectedDesigns.length >= 2) handleMergeDesigns();
    } else if (lower.includes('integrate stripe')) reply = '💳 Stripe integration prepared.';
    else if (lower.includes('publish')) reply = '🚀 Publishing in preview mode!';
    else if (lower.includes('hello') || lower.includes('hi'))
      reply = '👋 Hello! Try "change color to blue" or "add contact form".';
    else reply = `🤖 Command: "${command}". Try "change color to blue" or "merge designs".`;
    setVoiceResponse(reply);
    showNotification(reply, 'info');
  };

  const toggleSelectDesign = (id) =>
    setSelectedDesigns((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const handleMergeDesigns = () => {
    if (selectedDesigns.length < 2) {
      setMergeMessage('⚠️ Please select at least 2 designs to merge.');
      showNotification('Select at least 2 designs to merge', 'warning');
      setTimeout(() => setMergeMessage(''), 3000);
      return;
    }
    const names = selectedDesigns
      .map((id) => designsList.find((d) => d.id === id)?.name)
      .join(' + ');
    setMergeMessage(`✨ AI merged "${names}" — new hybrid design created!`);
    showNotification(`✨ Successfully merged ${names}!`, 'success');
    setTimeout(() => setMergeMessage(''), 4000);
  };

  const handleAddIntegration = (provider) => {
    if (!activeIntegrations.includes(provider)) {
      setActiveIntegrations([...activeIntegrations, provider]);
      showNotification(`${provider} integration added!`, 'success');
    }
  };

  const handleNewsletterSubscribe = () => {
    if (newsletterEmail && newsletterEmail.includes('@') && newsletterEmail.includes('.')) {
      setNewsletterEmail('');
      showNotification(`Thanks for subscribing!`, 'success');
    } else {
      showNotification('Please enter a valid email address.', 'error');
    }
  };

  // New pricing handlers
  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setSelectedAddons([]);
    setCheckoutOpen(true);
  };

  const handleAddonToggle = (addon) => {
    setSelectedAddons((prev) =>
      prev.includes(addon) ? prev.filter((a) => a !== addon) : [...prev, addon]
    );
  };

  const getTotalPrice = () => {
    if (!selectedPlan) return 0;
    const planPrice = isYearly ? selectedPlan.priceYearly : selectedPlan.priceMonthly;
    const addonsPrice = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
    return planPrice + addonsPrice;
  };

  const handleCheckout = () => {
    showNotification(
      `Proceeding to checkout with ${selectedPlan?.name} plan${isYearly ? ' (yearly)' : ' (monthly)'}\nTotal: $${getTotalPrice()}`,
      'success'
    );
    setCheckoutOpen(false);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      showNotification('Speech recognition is not supported in your browser.', 'error');
      return;
    }
    setIsListening(true);
    setTranscript('');
    setVoiceResponse('');
  };

  // ─── Shared card style ─────────────────────────────────────────────────────
  const cardSx = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    backdropFilter: 'blur(12px)',
    transition: 'all 0.25s ease',
    '&:hover': {
      transform: 'translateY(-6px)',
      border: `1px solid ${G_MID}55`,
      boxShadow: `0 20px 60px rgba(79,110,247,0.15)`,
    },
  };

  return (
    <>
      <Box
        sx={{
          bgcolor: '#080C14',
          minHeight: '100vh',
          overflowX: 'hidden',
          color: 'white',
          fontFamily: '"DM Sans", sans-serif',
        }}
      >
        {/* Logo Section with Torn Paper Pattern - Clean & Responsive */}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            py: { xs: 2, sm: 3, md: 4 },
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Main Logo Container with Torn Paper Effect */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: { xs: 1.5, sm: 2, md: 3 },
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 1.5, sm: 2, md: 2.5 },
              position: 'relative',
            }}
          >
            {/* Left Torn Paper Piece */}
            <Box
              sx={{
                position: 'relative',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              <Box
                sx={{
                  width: { xs: '30px', sm: '40px', md: '50px' },
                  height: { xs: '40px', sm: '55px', md: '65px' },
                  background: `linear-gradient(135deg, ${alpha(G_START, 0.2)} 0%, ${alpha(G_MID, 0.2)} 100%)`,
                  clipPath:
                    'polygon(0% 0%, 100% 0%, 95% 15%, 100% 30%, 92% 45%, 100% 60%, 88% 75%, 100% 90%, 85% 100%, 0% 100%, 8% 85%, 0% 70%, 12% 55%, 0% 40%, 15% 25%, 0% 10%)',
                  border: `1px solid ${alpha(G_START, 0.3)}`,
                }}
              >
                {/* Paper texture dots */}
                {[...Array(8)].map((_, i) => (
                  <Box
                    key={`left-texture-${i}`}
                    sx={{
                      position: 'absolute',
                      left: `${15 + Math.random() * 70}%`,
                      top: `${15 + Math.random() * 70}%`,
                      width: '2px',
                      height: '2px',
                      background: G_START,
                      opacity: 0.4,
                      borderRadius: '50%',
                    }}
                  />
                ))}
              </Box>

              {/* Small torn fragments */}
              {[...Array(2)].map((_, i) => (
                <Box
                  key={`left-fragment-${i}`}
                  sx={{
                    position: 'absolute',
                    bottom: `-${6 + i * 3}px`,
                    left: `${20 + i * 30}%`,
                    width: '5px',
                    height: '7px',
                    background: `linear-gradient(135deg, ${alpha(G_START, 0.25)} 0%, ${alpha(G_MID, 0.25)} 100%)`,
                    clipPath: 'polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)',
                    transform: `rotate(${10 + i * 20}deg)`,
                  }}
                />
              ))}
            </Box>

            {/* Logo */}
            <Box
              sx={{
                position: 'relative',
                zIndex: 2,
              }}
            >
              <img
                src={Logo}
                alt="Aleyo Logo"
                style={{
                  width: '190px',
                  height: '150px',
                  maxWidth: { xs: '90px', sm: '180px', md: '120px' },
                  minWidth: { xs: '100px', sm: '110px' },
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onClick={() => (window.location.href = '/')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              />

              {/* Torn paper corner effect - top right */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  width: '20px',
                  height: '20px',
                  background: `linear-gradient(135deg, ${alpha(G_START, 0.25)} 0%, transparent 70%)`,
                  clipPath:
                    'polygon(0% 0%, 100% 0%, 100% 100%, 70% 70%, 40% 85%, 15% 95%, 0% 100%)',
                  transform: 'rotate(45deg)',
                }}
              />

              {/* Torn paper corner effect - bottom left */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -8,
                  left: -8,
                  width: '20px',
                  height: '20px',
                  background: `linear-gradient(225deg, ${alpha(G_END, 0.25)} 0%, transparent 70%)`,
                  clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 70% 30%, 40% 15%, 15% 5%, 0% 0%)',
                  transform: 'rotate(45deg)',
                }}
              />
            </Box>

            {/* Right Torn Paper Piece */}
            <Box
              sx={{
                position: 'relative',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              <Box
                sx={{
                  width: { xs: '30px', sm: '40px', md: '50px' },
                  height: { xs: '40px', sm: '55px', md: '65px' },
                  background: `linear-gradient(135deg, ${alpha(G_MID, 0.2)} 0%, ${alpha(G_END, 0.2)} 100%)`,
                  clipPath:
                    'polygon(0% 0%, 100% 0%, 100% 100%, 95% 85%, 100% 70%, 92% 55%, 100% 40%, 88% 25%, 100% 10%, 85% 0%, 0% 100%, 5% 85%, 0% 70%, 8% 55%, 0% 40%, 12% 25%, 0% 10%)',
                  border: `1px solid ${alpha(G_END, 0.3)}`,
                }}
              >
                {/* Paper texture dots */}
                {[...Array(8)].map((_, i) => (
                  <Box
                    key={`right-texture-${i}`}
                    sx={{
                      position: 'absolute',
                      left: `${15 + Math.random() * 70}%`,
                      top: `${15 + Math.random() * 70}%`,
                      width: '2px',
                      height: '2px',
                      background: G_END,
                      opacity: 0.4,
                      borderRadius: '50%',
                    }}
                  />
                ))}
              </Box>

              {/* Small torn fragments */}
              {[...Array(2)].map((_, i) => (
                <Box
                  key={`right-fragment-${i}`}
                  sx={{
                    position: 'absolute',
                    bottom: `-${6 + i * 3}px`,
                    right: `${20 + i * 30}%`,
                    width: '5px',
                    height: '7px',
                    background: `linear-gradient(135deg, ${alpha(G_MID, 0.25)} 0%, ${alpha(G_END, 0.25)} 100%)`,
                    clipPath: 'polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)',
                    transform: `rotate(${-10 - i * 20}deg)`,
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
        {/* ── Hero ───────────────────────────────────────────────────────────── */}
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            pt: { xs: 10, md: 14 },
            pb: { xs: 8, md: 12 },
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-30%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '900px',
              height: '900px',
              background: `radial-gradient(ellipse, ${G_START}22 0%, transparent 70%)`,
              pointerEvents: 'none',
            },
          }}
        >
          <Container maxWidth="md" sx={{ position: 'relative' }}>
            <Chip
              label="🤖 AI-Powered · Voice First"
              sx={{
                mb: 3,
                background: 'rgba(79,110,247,0.12)',
                border: '1px solid rgba(79,110,247,0.3)',
                color: '#A5B4FC',
                fontWeight: 600,
                letterSpacing: '0.04em',
                borderRadius: '999px',
              }}
            />

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.6rem', md: '4rem' },
                fontWeight: 800,
                lineHeight: 1.1,
                mb: 2.5,
                background: `linear-gradient(135deg, #fff 30%, ${G_MID} 80%, ${G_END} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Build websites like
              <br />
              you're talking to a friend
            </Typography>

            <Typography
              sx={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '1.1rem',
                maxWidth: 600,
                mx: 'auto',
                mb: 5,
                lineHeight: 1.7,
              }}
            >
              40+ professional designs, merge layouts, third-party integrations &amp; voice
              commands. Launch in minutes.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Star />}
                onClick={() => navigate('/signup')}
                sx={{
                  background: GRAD,
                  borderRadius: '999px',
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: `0 0 40px ${G_START}44`,
                  '&:hover': { opacity: 0.9 },
                }}
              >
                Start Free — 50 credits
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Mic />}
                onClick={() => setVoiceModalOpen(true)}
                sx={{
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  borderRadius: '999px',
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': { borderColor: G_MID, background: 'rgba(79,110,247,0.08)' },
                }}
              >
                Try Voice Demo
              </Button>
            </Box>

            <Typography sx={{ mt: 3, color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
              ⭐ No credit card required · Merge any 2 designs · Cancel anytime
            </Typography>
          </Container>
        </Box>
        {/* ── Stats pills ────────────────────────────────────────────────────── */}
        <Container maxWidth="md" sx={{ pb: 6 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            {[
              '📁 120+ projects created this week',
              '🎨 40+ premium designs',
              '🎙️ Voice commands active',
            ].map((t) => (
              <Box
                key={t}
                sx={{
                  px: 3,
                  py: 1.2,
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                }}
              >
                {t}
              </Box>
            ))}
          </Box>
        </Container>
        {/* ── Integrated Feature Cards (from Cards.js) ───────────────────────── */}
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <FeatureCard />
        </Container>
        {/* ── Design Gallery ─────────────────────────────────────────────────── */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <SectionChip label="✨ merge anything" />
            <Typography variant="h3" fontWeight={800} sx={{ color: 'white', mb: 1.5 }}>
              Choose{' '}
              <span
                style={{
                  background: GRAD,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                two designs → merge
              </span>{' '}
              with AI
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)' }}>
              Select any designs, combine hero sections + layouts + styles instantly
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {designsList.map((design) => (
              <Grid item xs={12} sm={6} md={4} key={design.id}>
                <Card
                  sx={{
                    ...cardSx,
                    cursor: 'pointer',
                    border: selectedDesigns.includes(design.id)
                      ? `2px solid ${G_START}`
                      : '1px solid rgba(255,255,255,0.08)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  onClick={() => toggleSelectDesign(design.id)}
                >
                  <Box
                    sx={{
                      height: 160,
                      background: `linear-gradient(145deg, ${design.primary}, ${design.secondary})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '15px 15px 0 0',
                      position: 'relative',
                    }}
                  >
                    <Typography variant="h6" fontWeight={700} color="white">
                      {design.name}
                    </Typography>
                    {selectedDesigns.includes(design.id) && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          background: G_END,
                          borderRadius: '50%',
                          display: 'flex',
                          p: 0.3,
                        }}
                      >
                        <CheckCircle sx={{ color: 'white', fontSize: 20 }} />
                      </Box>
                    )}
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography fontWeight={700} sx={{ color: 'white' }}>
                        {design.name}
                      </Typography>
                      <Chip
                        label={design.category}
                        size="small"
                        sx={{
                          background: 'rgba(255,255,255,0.08)',
                          color: 'rgba(255,255,255,0.6)',
                          fontSize: '0.7rem',
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mb: 1 }}>
                      {design.description}
                    </Typography>
                    <Chip
                      label={design.layout}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: 'rgba(255,255,255,0.15)',
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: '0.7rem',
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleMergeDesigns}
              disabled={selectedDesigns.length < 2}
              sx={{
                background: selectedDesigns.length >= 2 ? GRAD : 'rgba(255,255,255,0.08)',
                borderRadius: '999px',
                px: 5,
                py: 1.5,
                fontWeight: 700,
                textTransform: 'none',
                boxShadow: selectedDesigns.length >= 2 ? `0 0 30px ${G_START}44` : 'none',
              }}
            >
              ⚡ Merge selected designs ({selectedDesigns.length})
            </Button>
            {mergeMessage && (
              <Alert
                severity="success"
                sx={{
                  mt: 3,
                  maxWidth: 500,
                  mx: 'auto',
                  background: 'rgba(62,214,124,0.1)',
                  border: `1px solid ${G_END}44`,
                  color: G_END,
                }}
              >
                {mergeMessage}
              </Alert>
            )}
          </Box>
        </Container>
        {/* ── Integrations ───────────────────────────────────────────────────── */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <SectionChip label="🔌 connect everything" />
            <Typography variant="h3" fontWeight={800} sx={{ color: 'white', mb: 1.5 }}>
              Third-party integrations
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)' }}>
              Stripe, Mailchimp, Calendly, Google Forms — one-click embed
            </Typography>
          </Box>

          <Grid container spacing={2} justifyContent="center">
            {integrationTypes.map((integration) => {
              const Icon = integration.icon;
              return (
                <Grid item key={integration.name}>
                  <Card
                    sx={{
                      ...cardSx,
                      p: 3,
                      textAlign: 'center',
                      cursor: 'pointer',
                      minWidth: 140,
                    }}
                    onClick={() => handleAddIntegration(integration.name)}
                  >
                    <Icon sx={{ fontSize: 44, color: integration.color, mb: 1 }} />
                    <Typography fontWeight={700} sx={{ color: 'white', fontSize: '0.9rem' }}>
                      {integration.name}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                      {integration.description}
                    </Typography>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {activeIntegrations.length > 0 && (
            <Alert
              severity="info"
              sx={{
                mt: 4,
                maxWidth: 600,
                mx: 'auto',
                background: 'rgba(79,110,247,0.1)',
                border: `1px solid ${G_START}44`,
                color: '#A5B4FC',
              }}
            >
              🔌 Active integrations: {activeIntegrations.join(', ')}
            </Alert>
          )}
        </Container>
        {/* ── Updated Pricing Section (matching Pricing.js style) ────────────────── */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <SectionChip label="🚀 choose your power" />
            <Typography variant="h3" fontWeight={800} sx={{ color: 'white', mb: 1.5 }}>
              Simple, Transparent Pricing
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', maxWidth: 600, mx: 'auto' }}>
              Choose the plan that fits your needs. All plans include AI-powered website building
              tools.
            </Typography>
          </Box>

          {/* Billing Toggle */}
          <Box
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 6, gap: 2 }}
          >
            <Typography
              variant="body1"
              sx={{ color: !isYearly ? 'white' : 'rgba(255,255,255,0.5)' }}
            >
              Monthly
            </Typography>
            <Switch
              checked={isYearly}
              onChange={() => setIsYearly(!isYearly)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: G_START,
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: G_START,
                },
              }}
            />
            <Typography
              variant="body1"
              sx={{ color: isYearly ? 'white' : 'rgba(255,255,255,0.5)' }}
            >
              Yearly{' '}
              <Chip
                label="Save 20%"
                size="small"
                sx={{ ml: 1, bgcolor: alpha(G_END, 0.2), color: G_END, height: 20 }}
              />
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            {pricingPlans.map((plan, index) => (
              <Grid item xs={12} md={4} key={plan.id}>
                <Card
                  sx={{
                    position: 'relative',
                    background: plan.popular
                      ? `linear-gradient(135deg, ${alpha(plan.color, 0.1)} 0%, rgba(0,0,0,0.8) 100%)`
                      : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${plan.popular ? plan.color : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '24px',
                    height: '100%',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                    },
                  }}
                >
                  {plan.popular && (
                    <Chip
                      label="Most Popular"
                      icon={<Star />}
                      sx={{
                        position: 'absolute',
                        top: -12,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: GRAD,
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    />
                  )}
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Avatar sx={{ bgcolor: alpha(plan.color, 0.2), color: plan.color }}>
                        {plan.icon}
                      </Avatar>
                      <Typography variant="h5" fontWeight="bold" sx={{ color: 'white' }}>
                        {plan.name}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="h3"
                        fontWeight="bold"
                        sx={{ color: 'white', display: 'inline' }}
                      >
                        ${isYearly ? plan.priceYearly : plan.priceMonthly}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: 'rgba(255,255,255,0.5)', display: 'inline', ml: 1 }}
                      >
                        /{isYearly ? 'year' : 'month'}
                      </Typography>
                      {isYearly && (
                        <Typography
                          variant="caption"
                          sx={{ color: G_END, display: 'block', mt: 0.5 }}
                        >
                          Save ${plan.priceMonthly * 12 - plan.priceYearly}/year
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>
                        Includes:
                      </Typography>
                      <List dense disablePadding>
                        {plan.features.map((feature, idx) => (
                          <ListItem key={idx} disableGutters sx={{ py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <CheckCircle sx={{ fontSize: 16, color: plan.color }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={feature}
                              primaryTypographyProps={{
                                variant: 'body2',
                                sx: { color: 'rgba(255,255,255,0.7)' },
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                    <Box
                      sx={{
                        mt: 2,
                        p: 1.5,
                        bgcolor: 'rgba(255,255,255,0.05)',
                        borderRadius: '12px',
                      }}
                    >
                      <Typography variant="body2" sx={{ color: 'white' }}>
                        🎁 {plan.credits} AI credits included
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        ~ {Math.floor(plan.credits / 100)} full websites
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      fullWidth
                      variant={plan.popular ? 'contained' : 'outlined'}
                      size="large"
                      onClick={() => handlePlanSelect(plan)}
                      sx={{
                        display:'none',
                        ...(plan.popular && { background: GRAD }),
                        borderColor: plan.popular ? 'transparent' : 'rgba(255,255,255,0.2)',
                        color: plan.popular ? 'white' : 'rgba(255,255,255,0.9)',
                        '&:hover': {
                          borderColor: plan.color,
                          bgcolor: alpha(plan.color, 0.1),
                        },
                        borderRadius: '40px',
                        py: 1.5,
                      }}
                    >
                      Get Started
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>
              All plans include a 14-day money-back guarantee. No questions asked.
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mt: 1 }}>
              Need a custom plan?{' '}
              <span style={{ color: G_START, cursor: 'pointer' }}>Contact our sales team</span>
            </Typography>
          </Box>
        </Container>
        {/* ── Footer ─────────────────────────────────────────────────────────── */}
        <Box
          sx={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            py: 7,
            mt: 4,
            textAlign: 'center',
          }}
        >
          <Container maxWidth="sm">
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}></Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.35)', my: 2, fontSize: '0.9rem' }}>
              AI website builder — create, merge, integrate, launch.
            </Typography>
            <Box
              sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap', mb: 3 }}
            >
              <TextField
                placeholder="your@email.com"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                size="small"
                sx={{
                  width: 240,
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '999px',
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
                    '&:hover fieldset': { borderColor: G_MID },
                    '&.Mui-focused fieldset': { borderColor: G_START },
                  },
                  '& input::placeholder': { color: 'rgba(255,255,255,0.3)' },
                }}
              />
              <Button
                variant="contained"
                onClick={handleNewsletterSubscribe}
                sx={{
                  background: GRAD,
                  borderRadius: '999px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                }}
              >
                Subscribe
              </Button>
            </Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>
              © 2025 Aleyo — All rights reserved. Built with AI &amp; ❤️
            </Typography>
          </Container>
        </Box>
        {/* ── Voice Modal ────────────────────────────────────────────────────── */}
        <Dialog
          open={voiceModalOpen}
          onClose={() => setVoiceModalOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: '#0D1220',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px',
              color: 'white',
            },
          }}
        >
          <DialogTitle
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Typography fontWeight={700}>🎙️ AI Voice Assistant</Typography>
            <IconButton
              onClick={() => setVoiceModalOpen(false)}
              sx={{ color: 'rgba(255,255,255,0.5)' }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Button
                variant="contained"
                startIcon={<Mic />}
                onClick={startListening}
                disabled={isListening}
                sx={{
                  background: GRAD,
                  borderRadius: '999px',
                  mb: 3,
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  textTransform: 'none',
                  boxShadow: `0 0 30px ${G_START}44`,
                }}
              >
                {isListening ? '🎧 Listening...' : '🎤 Start listening'}
              </Button>
              {transcript && (
                <Paper
                  sx={{
                    p: 2,
                    mb: 2,
                    background: 'rgba(79,110,247,0.1)',
                    borderRadius: '12px',
                    border: `1px solid ${G_START}33`,
                  }}
                >
                  <Typography>🗣️ "{transcript}"</Typography>
                </Paper>
              )}
              {voiceResponse && (
                <Alert
                  severity="info"
                  sx={{
                    mt: 2,
                    background: 'rgba(79,110,247,0.1)',
                    border: `1px solid ${G_START}44`,
                    color: '#A5B4FC',
                  }}
                >
                  {voiceResponse}
                </Alert>
              )}
              <Typography sx={{ mt: 3, color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem' }}>
                💡 Try: "Change color to blue" · "Add contact form" · "Merge designs" · "Integrate
                Stripe"
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => setVoiceModalOpen(false)}
              sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'none', borderRadius: '999px' }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Checkout Dialog */}
        <Dialog
          open={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: '#0A0F1A',
              borderRadius: '16px',
              border: `1px solid ${alpha(G_START, 0.3)}`,
            },
          }}
        >
          {selectedPlan && (
            <>
              <DialogTitle sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                Checkout - {selectedPlan.name} Plan
              </DialogTitle>
              <DialogContent sx={{ mt: 2 }}>
                <Alert severity="info" sx={{ mb: 2, bgcolor: alpha(G_START, 0.1), color: 'white' }}>
                  You're getting {selectedPlan.credits} AI credits per month
                </Alert>

                <Typography variant="subtitle1" sx={{ color: 'white', mb: 2 }}>
                  Add-ons (optional)
                </Typography>
                <Grid container spacing={1} sx={{ mb: 3 }}>
                  {addons.map((addon) => (
                    <Grid item xs={12} key={addon.name}>
                      <Card
                        sx={{
                          bgcolor: selectedAddons.includes(addon)
                            ? alpha(G_START, 0.1)
                            : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${selectedAddons.includes(addon) ? G_START : 'rgba(255,255,255,0.1)'}`,
                          cursor: 'pointer',
                        }}
                        onClick={() => handleAddonToggle(addon)}
                      >
                        <CardContent
                          sx={{
                            py: 1,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {addon.icon}
                            <Typography sx={{ color: 'white' }}>{addon.name}</Typography>
                          </Box>
                          <Typography sx={{ color: G_START, fontWeight: 'bold' }}>
                            ${addon.price}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    {selectedPlan.name} ({isYearly ? 'Yearly' : 'Monthly'})
                  </Typography>
                  <Typography sx={{ color: 'white' }}>
                    ${isYearly ? selectedPlan.priceYearly : selectedPlan.priceMonthly}
                  </Typography>
                </Box>
                {selectedAddons.map((addon) => (
                  <Box
                    key={addon.name}
                    sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
                  >
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>{addon.name}</Typography>
                    <Typography sx={{ color: 'white' }}>${addon.price}</Typography>
                  </Box>
                ))}
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography sx={{ color: 'white', fontWeight: 'bold' }}>Total</Typography>
                  <Typography sx={{ color: G_START, fontWeight: 'bold', fontSize: '1.5rem' }}>
                    ${getTotalPrice()}
                  </Typography>
                </Box>

                <TextField
                  fullWidth
                  placeholder="Promo code"
                  variant="outlined"
                  size="small"
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    },
                  }}
                />
              </DialogContent>
              <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <Button
                  onClick={() => setCheckoutOpen(false)}
                  sx={{ color: 'rgba(255,255,255,0.6)' }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCheckout}
                  sx={{ background: GRAD, px: 3 }}
                >
                  Proceed to Payment
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{
              background: '#0D1220',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
              borderRadius: '12px',
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default HomePage;
