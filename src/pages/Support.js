// SupportPage.js
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider,
  Avatar,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  alpha,
  useTheme,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
  CircularProgress,
  Rating,
  InputAdornment,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  ExpandMore,
  HelpOutline,
  Email,
  Chat,
  Phone,
  AccessTime,
  CheckCircle,
  Build,
  School,
  IntegrationInstructions,
  DesignServices,
  Storage,
  Security,
  Payment,
  Language,
  Search,
  Send,
  Close,
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  GitHub,
  Article,
  VideoLibrary,
  MenuBook,
  Star,
  Favorite,
  Feedback,
  BugReport,
  Lightbulb,
  Headset,
  VerifiedUser,
  Speed,
  CloudQueue,
  Api,
  Code,
  WhatsApp,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const G_START = '#4F6EF7';
const G_MID = '#2DBCB6';
const G_END = '#3ED67C';
const GRAD = `linear-gradient(135deg, ${G_START} 0%, ${G_MID} 50%, ${G_END} 100%)`;

  // Helper Icons
const RocketIcon = () => <span style={{ fontSize: 20 }}>🚀</span>;

// FAQ Data
const faqCategories = [
  {
    id: 'getting-started',
    label: 'Getting Started',
    icon: <RocketIcon />,
    questions: [
      {
        q: 'How do I create my first website?',
        a: 'Click "New Project" in your dashboard or go to Design Studio. Choose a template or start from scratch. Drag and drop components, customize colors and text, then save and publish when ready.',
      },
      {
        q: 'What are AI credits and how do I use them?',
        a: 'AI credits power our AI design features including voice commands, template generation, and smart suggestions. Each plan includes monthly credits. You can purchase additional credits from the Pricing page.',
      },
      {
        q: 'Can I switch between templates?',
        a: 'Yes! You can change your template anytime in Design Studio. Your content will be preserved and adapted to the new template layout.',
      },
    ],
  },
  {
    id: 'design-studio',
    label: 'Design Studio',
    icon: <DesignServices />,
    questions: [
      {
        q: 'How do I add custom CSS/JavaScript?',
        a: 'Click the Code View icon (</>) in the toolbar to see generated HTML/CSS. Copy and paste into your preferred editor. For advanced users, you can inject code via integrations.',
      },
      {
        q: 'Can I create multiple pages?',
        a: 'Yes! Click the "+" icon next to page tabs above the canvas. Name your page and click "Add Page". Each page maintains its own components and content.',
      },
      {
        q: 'How do I use the voice assistant?',
        a: 'Click the microphone button in Design Studio or on the homepage. Speak commands like "Add a hero section" or "Change theme to dark". You can also type commands if you prefer typing mode.',
      },
    ],
  },
  {
    id: 'integrations',
    label: 'Integrations',
    icon: <IntegrationInstructions />,
    questions: [
      {
        q: 'How do I connect Stripe to my website?',
        a: 'Go to Integrations tab, click Payment Gateway, select Stripe, enter your API keys from your Stripe dashboard. Once connected, you can add payment forms to any page.',
      },
      {
        q: 'Are my API keys secure?',
        a: 'API keys are encrypted and stored securely. For production, we recommend using environment variables and backend proxy endpoints for additional security.',
      },
      {
        q: 'What integrations are available?',
        a: 'We support Stripe, PayPal, Mailchimp, Google Analytics, Facebook Pixel, WhatsApp Business, Instagram, OpenAI API, and many more. Check the Integrations page for the full list.',
      },
    ],
  },
  {
    id: 'publishing',
    label: 'Publishing & Hosting',
    icon: <CloudQueue />,
    questions: [
      {
        q: 'How do I publish my website?',
        a: 'Click the "Publish" button in Design Studio, enter a website name, optionally set a custom URL slug, then click "Publish Website". You\'ll receive a permanent shareable link.',
      },
      {
        q: 'Can I use my own domain?',
        a: 'Yes! Pro and Enterprise plans support custom domains. Contact support to configure your domain DNS settings.',
      },
      {
        q: 'Will my published URL change if I edit?',
        a: 'No, your published URL stays the same. You can edit and republish anytime - the link remains permanent.',
      },
    ],
  },
  {
    id: 'billing',
    label: 'Billing & Credits',
    icon: <Payment />,
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept credit/debit cards via Stripe and Direct Debit via GoCardless. Annual plans offer 20% savings.',
      },
      {
        q: 'Can I cancel my subscription?',
        a: "Yes, you can cancel anytime from your Dashboard > Billing. No long-term contracts. You'll keep access until the end of your billing period.",
      },
      {
        q: 'Do you offer refunds?',
        a: 'All plans include a 14-day money-back guarantee. Contact support within 14 days of purchase for a full refund.',
      },
    ],
  },
  {
    id: 'troubleshooting',
    label: 'Troubleshooting',
    icon: <Build />,
    questions: [
      {
        q: "Why aren't my images saving?",
        a: "Make sure you're using Production Mode for file uploads. Mock Mode URLs are saved as references. Also check your browser's localStorage isn't full (clear old projects if needed).",
      },
      {
        q: 'Voice assistant not working?',
        a: 'Check microphone permissions in browser settings. Try switching to typing mode if voice fails. Supported browsers: Chrome, Edge, Safari.',
      },
      {
        q: "My changes aren't saving?",
        a: "Auto-save runs every 1.5 seconds. Check that you're logged in and have sufficient storage. Try manual Save if auto-save isn't working.",
      },
    ],
  },
];

// Support Channels
const supportChannels = [
  {
    name: 'Live Chat',
    icon: <Chat />,
    description: 'Chat with our support team',
    availability: 'Mon-Fri, 9AM-6PM GMT',
    action: 'Start Chat',
    color: G_START,
  },
  {
    name: 'Email Support',
    icon: <Email />,
    description: 'support@aleyo.com',
    availability: '24/7 response within 24h',
    action: 'Send Email',
    color: G_MID,
  },
  {
    name: 'Phone Support',
    icon: <Phone />,
    description: '+44 (0) 20 1234 5678',
    availability: 'Enterprise only, 24/7',
    action: 'Call Now',
    color: G_END,
  },
  {
    name: 'Community Forum',
    icon: <Chat />,
    description: 'Join our community',
    availability: 'Always open',
    action: 'Visit Forum',
    color: '#A855F7',
  },
];

// Knowledge Base Categories
const knowledgeCategories = [
  { name: 'Video Tutorials', count: 24, icon: <VideoLibrary />, color: G_START },
  { name: 'Written Guides', count: 56, icon: <Article />, color: G_MID },
  { name: 'API Documentation', count: 12, icon: <Api />, color: G_END },
  { name: 'Code Examples', count: 34, icon: <Code />, color: '#F59E0B' },
];

// Social Links
const socialLinks = [
  { name: 'Twitter', icon: <Twitter />, url: 'https://twitter.com/aleyo', color: '#1DA1F2' },
  { name: 'Instagram', icon: <Instagram />, url: 'https://instagram.com/aleyo', color: '#E4405F' },
  { name: 'Facebook', icon: <Facebook />, url: 'https://facebook.com/aleyo', color: '#1877F2' },
  { name: 'YouTube', icon: <YouTube />, url: 'https://youtube.com/aleyo', color: '#FF0000' },
  { name: 'GitHub', icon: <GitHub />, url: 'https://github.com/aleyo', color: '#333333' },
  { name: 'WhatsApp', icon: <WhatsApp />, url: 'https://wa.me/44123456789', color: '#25D366' },
];

// Status Items
const systemStatus = [
  { service: 'Design Studio', status: 'operational', uptime: '99.99%' },
  { service: 'API', status: 'operational', uptime: '99.95%' },
  { service: 'Voice Assistant', status: 'operational', uptime: '99.9%' },
  { service: 'Payment Processing', status: 'operational', uptime: '99.99%' },
  { service: 'Image Upload', status: 'degraded', uptime: '99.5%' },
  { service: 'Integrations', status: 'operational', uptime: '99.9%' },
];

const SupportPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [submitting, setSubmitting] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    priority: 'normal',
    description: '',
    attachments: [],
  });

  const handleFaqChange = (panel) => (event, isExpanded) => {
    setExpandedFaq(isExpanded ? panel : null);
  };



  const handleContactSubmit = async () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setContactDialogOpen(false);
      setContactForm({ name: '', email: '', subject: '', message: '' });
      showSnackbar("Message sent! We'll respond within 24 hours.", 'success');
    }, 1500);
  };

  const handleFeedbackSubmit = async () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setFeedbackDialogOpen(false);
      setFeedbackRating(0);
      showSnackbar('Thanks for your feedback!', 'success');
    }, 1000);
  };

  const handleTicketSubmit = async () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setTicketDialogOpen(false);
      setTicketForm({ subject: '', priority: 'normal', description: '', attachments: [] });
      showSnackbar('Support ticket created. Check your email for updates.', 'success');
    }, 1500);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const filteredFaqs = faqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.a.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  const totalFaqs = faqCategories.reduce((acc, cat) => acc + cat.questions.length, 0);

  return (
    <Box sx={{ bgcolor: '#080C14', minHeight: '100vh' }}>
      {/* Back Button */}
      <Box
        onClick={() => navigate('/dashboard')}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          cursor: 'pointer',
          mb: 2,
          mx: 2,
          mt: 2,
          '&:hover': { opacity: 0.7 },
        }}
      >
        <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'white' }}>
          ← Back to Dashboard
        </Typography>
      </Box>

      {/* Hero Header */}
      <Box sx={{ background: GRAD, py: 6, mb: 4 }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                textAlign: 'center',
                color: 'white',
                mb: 2,
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
              }}
            >
              How can we help?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                color: 'rgba(255,255,255,0.9)',
                maxWidth: 600,
                mx: 'auto',
                mb: 4,
              }}
            >
              Find answers, get support, and connect with our team
            </Typography>

            {/* Search Bar */}
            <Paper
              sx={{
                maxWidth: 600,
                mx: 'auto',
                p: 1,
                display: 'flex',
                alignItems: 'center',
                borderRadius: '60px',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <Search sx={{ mx: 2, color: 'rgba(255,255,255,0.6)' }} />
              <TextField
                fullWidth
                placeholder="Search for help..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="standard"
                InputProps={{ disableUnderline: true }}
                sx={{ '& input': { color: 'white', py: 1.5 } }}
              />
              {searchTerm && (
                <IconButton onClick={() => setSearchTerm('')} sx={{ mr: 1 }}>
                  <Close sx={{ color: 'rgba(255,255,255,0.6)' }} />
                </IconButton>
              )}
            </Paper>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 6 }}>
        {/* Quick Stats */}
        <Grid container spacing={2} sx={{ mb: 5 }}>
          {[
            { label: 'FAQ Articles', value: totalFaqs, icon: <MenuBook /> },
            { label: 'Video Tutorials', value: '24+', icon: <VideoLibrary /> },
            { label: 'Support Channels', value: '4', icon: <Headset /> },
            { label: 'Response Time', value: '&lt;24h', icon: <AccessTime /> },
          ].map((stat) => (
            <Grid item xs={6} sm={3} key={stat.label}>
              <Paper
                sx={{ p: 2, textAlign: 'center', bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2 }}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
                >
                  {stat.icon}
                  <Typography variant="h4" sx={{ color: G_START, fontWeight: 700 }}>
                    {stat.value}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.6) }}>
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Support Channels */}
        <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 700 }}>
          📞 Get in Touch
        </Typography>
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {supportChannels.map((channel, idx) => (
            <Grid item xs={12} sm={6} md={3} key={channel.name}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card
                  sx={{
                    bgcolor: alpha('#FFFFFF', 0.03),
                    border: `1px solid ${alpha(channel.color, 0.2)}`,
                    borderRadius: 3,
                    textAlign: 'center',
                    p: 2,
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)' },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: alpha(channel.color, 0.15),
                      color: channel.color,
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {channel.icon}
                  </Avatar>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                    {channel.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.6), mb: 1 }}>
                    {channel.description}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: alpha('#FFFFFF', 0.4), display: 'block', mb: 2 }}
                  >
                    {channel.availability}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      if (channel.name === 'Live Chat') setContactDialogOpen(true);
                      else if (channel.name === 'Email Support')
                        window.location.href = 'mailto:support@aleyo.com';
                      else if (channel.name === 'Phone Support')
                        alert('Phone support available for Enterprise customers');
                      else window.open('https://community.aleyo.com', '_blank');
                    }}
                    sx={{
                      borderColor: alpha(channel.color, 0.5),
                      color: channel.color,
                      borderRadius: '40px',
                      '&:hover': { borderColor: channel.color, bgcolor: alpha(channel.color, 0.1) },
                    }}
                  >
                    {channel.action}
                  </Button>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Knowledge Base */}
        <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 700 }}>
          📚 Knowledge Base
        </Typography>
        <Grid container spacing={2} sx={{ mb: 6 }}>
          {knowledgeCategories.map((cat, idx) => (
            <Grid item xs={6} sm={3} key={cat.name}>
              <Card
                sx={{
                  bgcolor: alpha('#FFFFFF', 0.03),
                  border: `1px solid ${alpha(cat.color, 0.2)}`,
                  borderRadius: 3,
                  textAlign: 'center',
                  p: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: alpha(cat.color, 0.05) },
                }}
                onClick={() => setActiveTab(0)}
              >
                <Avatar
                  sx={{ bgcolor: alpha(cat.color, 0.15), color: cat.color, mx: 'auto', mb: 1 }}
                >
                  {cat.icon}
                </Avatar>
                <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                  {cat.name}
                </Typography>
                <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                  {cat.count} articles
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* FAQ Section */}
        <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 700 }}>
          ❓ Frequently Asked Questions
        </Typography>

        {/* FAQ Tabs */}
        <Paper sx={{ bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2, mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(e, v) => setActiveTab(v)}
            sx={{
              '& .MuiTab-root': { color: alpha('#FFFFFF', 0.6), textTransform: 'none' },
              '& .Mui-selected': { color: G_START },
              '& .MuiTabs-indicator': { backgroundColor: G_START },
            }}
          >
            {faqCategories.map((cat) => (
              <Tab key={cat.id} icon={cat.icon} label={cat.label} iconPosition="start" />
            ))}
          </Tabs>
        </Paper>

        {/* FAQ Content */}
        <Paper sx={{ bgcolor: alpha('#FFFFFF', 0.02), borderRadius: 2, p: 2, mb: 4 }}>
          {filteredFaqs.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography sx={{ color: alpha('#FFFFFF', 0.5) }}>
                No results found for "{searchTerm}"
              </Typography>
            </Box>
          ) : (
            filteredFaqs.map((category) => (
              <Box
                key={category.id}
                sx={{
                  display:
                    activeTab === faqCategories.findIndex((c) => c.id === category.id)
                      ? 'block'
                      : 'none',
                }}
              >
                {category.questions.map((item, idx) => (
                  <Accordion
                    key={idx}
                    expanded={expandedFaq === `${category.id}-${idx}`}
                    onChange={handleFaqChange(`${category.id}-${idx}`)}
                    sx={{
                      bgcolor: 'transparent',
                      boxShadow: 'none',
                      borderBottom:
                        idx < category.questions.length - 1
                          ? `1px solid ${alpha('#FFFFFF', 0.08)}`
                          : 'none',
                      '&:before': { display: 'none' },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore sx={{ color: 'white' }} />}
                      sx={{ '& .MuiAccordionSummary-content': { py: 1 } }}
                    >
                      <Typography sx={{ color: 'white', fontWeight: 500 }}>{item.q}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography sx={{ color: alpha('#FFFFFF', 0.7), lineHeight: 1.7 }}>
                        {item.a}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            ))
          )}
        </Paper>

        {/* System Status */}
        <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 700 }}>
          🟢 System Status
        </Typography>
        <Paper sx={{ bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2, overflow: 'hidden', mb: 6 }}>
          <Grid container sx={{ borderBottom: `1px solid ${alpha('#FFFFFF', 0.08)}` }}>
            <Grid item xs={6} sx={{ p: 2, borderRight: `1px solid ${alpha('#FFFFFF', 0.08)}` }}>
              <Typography variant="subtitle2" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                Service
              </Typography>
            </Grid>
            <Grid item xs={3} sx={{ p: 2, borderRight: `1px solid ${alpha('#FFFFFF', 0.08)}` }}>
              <Typography variant="subtitle2" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                Status
              </Typography>
            </Grid>
            <Grid item xs={3} sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                Uptime (30d)
              </Typography>
            </Grid>
          </Grid>
          {systemStatus.map((service, idx) => (
            <Grid
              container
              key={service.service}
              sx={{
                borderBottom:
                  idx < systemStatus.length - 1 ? `1px solid ${alpha('#FFFFFF', 0.05)}` : 'none',
              }}
            >
              <Grid item xs={6} sx={{ p: 2, borderRight: `1px solid ${alpha('#FFFFFF', 0.08)}` }}>
                <Typography sx={{ color: 'white' }}>{service.service}</Typography>
              </Grid>
              <Grid item xs={3} sx={{ p: 2, borderRight: `1px solid ${alpha('#FFFFFF', 0.08)}` }}>
                <Chip
                  label={service.status}
                  size="small"
                  sx={{
                    bgcolor:
                      service.status === 'operational'
                        ? alpha(G_END, 0.15)
                        : alpha('#F59E0B', 0.15),
                    color: service.status === 'operational' ? G_END : '#F59E0B',
                    height: 24,
                    fontSize: '0.7rem',
                  }}
                />
              </Grid>
              <Grid item xs={3} sx={{ p: 2 }}>
                <Typography sx={{ color: alpha('#FFFFFF', 0.7) }}>{service.uptime}</Typography>
              </Grid>
            </Grid>
          ))}
        </Paper>

        {/* Quick Actions */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                bgcolor: alpha('#FFFFFF', 0.03),
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { bgcolor: alpha(G_START, 0.05) },
              }}
              onClick={() => setTicketDialogOpen(true)}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <BugReport sx={{ fontSize: 48, color: G_START, mb: 1 }} />
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                  Report an Issue
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                  Submit a bug report or technical issue
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                bgcolor: alpha('#FFFFFF', 0.03),
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { bgcolor: alpha(G_MID, 0.05) },
              }}
              onClick={() => setFeedbackDialogOpen(true)}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Feedback sx={{ fontSize: 48, color: G_MID, mb: 1 }} />
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                  Send Feedback
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                  Help us improve Aleyo
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                bgcolor: alpha('#FFFFFF', 0.03),
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { bgcolor: alpha(G_END, 0.05) },
              }}
              onClick={() => window.open('/tutorials', '_blank')}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <School sx={{ fontSize: 48, color: G_END, mb: 1 }} />
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                  View Tutorials
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                  Step-by-step video guides
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Social Links */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Divider sx={{ borderColor: alpha('#FFFFFF', 0.1), mb: 4 }} />
          <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.5), mb: 2 }}>
            Follow us for updates and tips
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
            {socialLinks.map((social) => (
              <Tooltip title={social.name} key={social.name}>
                <IconButton
                  onClick={() => window.open(social.url, '_blank')}
                  sx={{
                    bgcolor: alpha(social.color, 0.1),
                    color: social.color,
                    '&:hover': { bgcolor: alpha(social.color, 0.2) },
                  }}
                >
                  {social.icon}
                </IconButton>
              </Tooltip>
            ))}
          </Box>
          <Typography
            variant="caption"
            sx={{ color: alpha('#FFFFFF', 0.3), display: 'block', mt: 3 }}
          >
            © 2025 Aleyo — All rights reserved
          </Typography>
        </Box>
      </Container>

      {/* Contact Dialog */}
      <Dialog
        open={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#0A0F1A',
            borderRadius: 3,
            border: `1px solid ${alpha(G_START, 0.3)}`,
            color: 'white',
          },
        }}
      >
        <Box sx={{ height: 4, background: GRAD }} />
        <DialogTitle
          sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chat sx={{ color: G_START }} />
            <Typography variant="h6" fontWeight={700}>
              Live Chat Support
            </Typography>
          </Box>
          <IconButton onClick={() => setContactDialogOpen(false)} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.6), mb: 3 }}>
            Our support team typically responds within a few hours.
          </Typography>
          <TextField
            fullWidth
            label="Your Name"
            value={contactForm.name}
            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
            sx={{
              mb: 2,
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: alpha('#FFFFFF', 0.6) },
            }}
          />
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={contactForm.email}
            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
            sx={{
              mb: 2,
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: alpha('#FFFFFF', 0.6) },
            }}
          />
          <TextField
            fullWidth
            label="Subject"
            value={contactForm.subject}
            onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
            sx={{
              mb: 2,
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: alpha('#FFFFFF', 0.6) },
            }}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Message"
            value={contactForm.message}
            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
            sx={{
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: alpha('#FFFFFF', 0.6) },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setContactDialogOpen(false)} sx={{ color: alpha('#FFFFFF', 0.6) }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleContactSubmit}
            disabled={submitting || !contactForm.name || !contactForm.email || !contactForm.message}
            sx={{ background: GRAD, borderRadius: '10px', px: 3 }}
          >
            {submitting ? <CircularProgress size={24} /> : 'Send Message'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog
        open={feedbackDialogOpen}
        onClose={() => setFeedbackDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#0A0F1A',
            borderRadius: 3,
            border: `1px solid ${alpha(G_MID, 0.3)}`,
            color: 'white',
          },
        }}
      >
        <Box sx={{ height: 4, background: GRAD }} />
        <DialogTitle
          sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Feedback sx={{ color: G_MID }} />
            <Typography variant="h6" fontWeight={700}>
              Send Feedback
            </Typography>
          </Box>
          <IconButton onClick={() => setFeedbackDialogOpen(false)} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.6), mb: 2 }}>
            How would you rate your experience?
          </Typography>
          <Rating
            value={feedbackRating}
            onChange={(e, v) => setFeedbackRating(v || 0)}
            size="large"
            sx={{ mb: 3, color: G_END }}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Feedback"
            placeholder="What do you like? What could be improved?"
            value={contactForm.message}
            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
            sx={{
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: alpha('#FFFFFF', 0.6) },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setFeedbackDialogOpen(false)}
            sx={{ color: alpha('#FFFFFF', 0.6) }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleFeedbackSubmit}
            disabled={submitting}
            sx={{ background: GRAD, borderRadius: '10px', px: 3 }}
          >
            {submitting ? <CircularProgress size={24} /> : 'Submit Feedback'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Support Ticket Dialog */}
      <Dialog
        open={ticketDialogOpen}
        onClose={() => setTicketDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#0A0F1A',
            borderRadius: 3,
            border: `1px solid ${alpha(G_END, 0.3)}`,
            color: 'white',
          },
        }}
      >
        <Box sx={{ height: 4, background: GRAD }} />
        <DialogTitle
          sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BugReport sx={{ color: G_END }} />
            <Typography variant="h6" fontWeight={700}>
              Report an Issue
            </Typography>
          </Box>
          <IconButton onClick={() => setTicketDialogOpen(false)} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.6), mb: 3 }}>
            Describe the issue you're experiencing. Our technical team will investigate.
          </Typography>
          <TextField
            fullWidth
            label="Issue Subject"
            value={ticketForm.subject}
            onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
            sx={{
              mb: 2,
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: alpha('#FFFFFF', 0.6) },
            }}
          />
          <TextField
            fullWidth
            select
            label="Priority"
            value={ticketForm.priority}
            onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
            sx={{
              mb: 2,
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: alpha('#FFFFFF', 0.6) },
            }}
          >
            <MenuItem value="low">Low - Minor inconvenience</MenuItem>
            <MenuItem value="normal">Normal - Affecting my work</MenuItem>
            <MenuItem value="high">High - Blocking my work</MenuItem>
            <MenuItem value="critical">Critical - System down</MenuItem>
          </TextField>
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Detailed Description"
            placeholder="Steps to reproduce, expected behavior, actual behavior, screenshots..."
            value={ticketForm.description}
            onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
            sx={{
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: alpha('#FFFFFF', 0.6) },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setTicketDialogOpen(false)} sx={{ color: alpha('#FFFFFF', 0.6) }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleTicketSubmit}
            disabled={submitting || !ticketForm.subject || !ticketForm.description}
            sx={{ background: GRAD, borderRadius: '10px', px: 3 }}
          >
            {submitting ? <CircularProgress size={24} /> : 'Submit Ticket'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ bgcolor: '#1A1F2E', color: 'white' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};;



export default SupportPage;
