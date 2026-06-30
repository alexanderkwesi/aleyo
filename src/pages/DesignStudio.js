import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  IconButton,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Tabs,
  Tab,
  Chip,
  Divider,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fab,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress,
  useTheme,
  alpha,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Popover,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  InputAdornment,
  Avatar,
  LinearProgress,
  DialogContentText,
} from '@mui/material';
import {
  Save,
  Undo,
  Redo,
  Preview,
  Publish,
  Close,
  ColorLens,
  Typography as TypographyIcon,
  ViewQuilt,
  Add,
  Delete,
  DragIndicator,
  Code,
  MobileFriendly,
  TabletMac,
  DesktopWindows,
  Brush,
  GridOn,
  TextFields,
  VideoLibrary,
  ShoppingCart,
  ContactMail,
  Settings,
  ExpandMore,
  Palette,
  BorderColor,
  FormatSize,
  SpaceBar,
  PhotoLibrary,
  Title,
  Description,
  FormatBold,
  FormatItalic,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  Check,
  QrCode,
  Link as LinkIcon,
  FormatUnderlined,
  FormatColorFill,
  FontDownload,
  DragHandle,
  Square,
  Crop,
  BlurOn,
  Opacity,
  Upload,
  AspectRatio,
  CropSquare,
  Panorama,
  FitScreen,
  ZoomIn,
  ZoomOut,
  RotateLeft,
  RotateRight,
  Flip,
  Filter,
  BrightnessHigh,
  Contrast,
  Grain,
  Image as ImageIcon,
  Search,
  Payment,
  Mail,
  WhatsApp,
  Instagram,
  Facebook,
  Twitter,
  CloudUpload,
  Analytics,
  Security,
  Storage,
  Api,
  Language,
  MusicNote,
  Chat,
  CalendarToday,
  Campaign,
  Description as DescriptionIcon,
  Email as EmailIcon,
  Block,
  FolderOpen,
  Refresh,
  YouTube,
  LinkedIn,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChromePicker } from 'react-color';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// ── CONSTANTS ──────────────────────────────────────────────────────────
const G_START = '#4F6EF7';
const G_MID = '#2DBCB6';
const G_END = '#3ED67C';
const GRAD = `linear-gradient(135deg, ${G_START} 0%, ${G_MID} 50%, ${G_END} 100%)`;
const API_BASE = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const ContentCopy = Code;
const EditIcon = Brush;
const OpenWith = DragHandle;

// ── LOAD DESIGN FROM DESIGNS.JS ──────────────────────────────────────
let design = [];
try {
  const designsModule = require('./Designs');
  const raw = designsModule.design || designsModule.default || [];
  if (Array.isArray(raw)) {
    design = raw;
  } else if (raw && typeof raw === 'object') {
    // Handle cases where Designs.js exports an object/map instead of an array
    // e.g. { templates: [...] } or { someKey: {...}, otherKey: {...} }
    design = Array.isArray(raw.templates) ? raw.templates : Object.values(raw);
  } else {
    design = [];
  }
} catch (e) {
  console.warn('Failed to load Designs:', e);
  design = [];
}

// ── FALLBACK PROJECTS GALLERY ────────────────────────────────────────
const ProjectsGallery = ({
  onOpenProject,
  onPreviewProject,
  onPublishProject,
  onDeleteProject,
  onDuplicateProject,
  showHeader = true,
}) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = () => {
      const projectList = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('project_')) {
          try {
            const data = JSON.parse(localStorage.getItem(key) || '');
            if (data && data.id && data.name) {
              projectList.push(data);
            }
          } catch (e) {
            console.error('Error parsing project:', e);
          }
        }
      }
      projectList.sort((a, b) => new Date(b.lastEdited) - new Date(a.lastEdited));
      setProjects(projectList);
      setLoading(false);
    };
    loadProjects();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <CircularProgress sx={{ color: G_START }} />
      </Box>
    );
  }

  if (projects.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h6" sx={{ color: 'white' }}>
          No Projects Found
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
          Create your first project in the Design Studio
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      {projects.map((project) => (
        <Grid item xs={12} sm={6} md={4} key={project.id}>
          <Card
            sx={{
              bgcolor: alpha('#FFFFFF', 0.05),
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: alpha('#4F6EF7', 0.1),
                transform: 'translateY(-4px)',
              },
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white' }}>
                {project.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                {project.components?.length || 0} components • {project.textElements?.length || 0}{' '}
                text elements
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip
                  size="small"
                  label={project.status || 'draft'}
                  sx={{
                    bgcolor:
                      project.status === 'published'
                        ? alpha('#4CAF50', 0.2)
                        : alpha('#FFA726', 0.2),
                    color: project.status === 'published' ? '#4CAF50' : '#FFA726',
                  }}
                />
              </Box>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                variant="contained"
                onClick={() => onOpenProject && onOpenProject(project)}
                sx={{
                  background: GRAD,
                  '&:hover': { opacity: 0.9 },
                }}
              >
                Open
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => onPreviewProject && onPreviewProject(project)}
                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}
              >
                Preview
              </Button>
              {onPublishProject && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => onPublishProject(project)}
                  sx={{ color: G_END, borderColor: G_END }}
                >
                  Publish
                </Button>
              )}
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

// ── HELPER FUNCTIONS ─────────────────────────────────────────────────
const getInitialProject = () => {
  const savedProjectId = localStorage.getItem('latest_project_id');
  if (savedProjectId) {
    const savedData = localStorage.getItem(`project_${savedProjectId}`);
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        console.error('Error parsing saved project:', e);
      }
    }
  }
  if (design && design.length > 0) {
    return design[0];
  }
  return null;
};

// ── PREDEFINED STYLES ─────────────────────────────────────────────────
const textStyles = [
  {
    id: 'h1',
    name: 'Heading 1',
    tag: 'h1',
    defaultText: 'Your Main Heading Here',
    fontSize: '48px',
    fontWeight: 'bold',
  },
  {
    id: 'h2',
    name: 'Heading 2',
    tag: 'h2',
    defaultText: 'Section Heading',
    fontSize: '36px',
    fontWeight: 'bold',
  },
  {
    id: 'h3',
    name: 'Heading 3',
    tag: 'h3',
    defaultText: 'Subheading',
    fontSize: '28px',
    fontWeight: 'bold',
  },
  {
    id: 'h4',
    name: 'Heading 4',
    tag: 'h4',
    defaultText: 'Small Heading',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  {
    id: 'h5',
    name: 'Heading 5',
    tag: 'h5',
    defaultText: 'Mini Heading',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  {
    id: 'h6',
    name: 'Heading 6',
    tag: 'h6',
    defaultText: 'Tiny Heading',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  {
    id: 'p',
    name: 'Paragraph',
    tag: 'p',
    defaultText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    fontSize: '16px',
    fontWeight: 'normal',
  },
  {
    id: 'span',
    name: 'Inline Text',
    tag: 'span',
    defaultText: 'Inline text here',
    fontSize: '16px',
    fontWeight: 'normal',
  },
  {
    id: 'div',
    name: 'Div Block',
    tag: 'div',
    defaultText: 'Div content block',
    fontSize: '16px',
    fontWeight: 'normal',
  },
  {
    id: 'a',
    name: 'Link',
    tag: 'a',
    defaultText: 'Click here',
    fontSize: '16px',
    fontWeight: 'normal',
    href: '#',
  },
  {
    id: 'nav',
    name: 'Navigation Menu',
    tag: 'nav',
    defaultText: 'Home | About | Services | Contact',
    fontSize: '16px',
    fontWeight: '500',
    isNav: true,
  },
];

const imageStyles = [
  {
    id: 'full-width',
    name: 'Full Width',
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
    borderRadius: '0px',
  },
  {
    id: 'hero',
    name: 'Hero Size',
    width: '100%',
    height: '500px',
    objectFit: 'cover',
    borderRadius: '12px',
  },
  {
    id: 'square',
    name: 'Square',
    width: '300px',
    height: '300px',
    objectFit: 'cover',
    borderRadius: '12px',
  },
  {
    id: 'portrait',
    name: 'Portrait',
    width: '300px',
    height: '400px',
    objectFit: 'cover',
    borderRadius: '12px',
  },
  {
    id: 'landscape',
    name: 'Landscape',
    width: '400px',
    height: '300px',
    objectFit: 'cover',
    borderRadius: '12px',
  },
  {
    id: 'thumbnail',
    name: 'Thumbnail',
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  {
    id: 'circle',
    name: 'Circle',
    width: '200px',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '50%',
  },
  {
    id: 'wide',
    name: 'Wide Banner',
    width: '100%',
    height: '300px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
];

// ── COLOR THEMES ──────────────────────────────────────────────────────
const colorThemes = [
  {
    id: 'dark-magic',
    name: 'Dark Magic',
    description: 'Mysterious dark theme with purple accents',
    styles: {
      backgroundColor: '#0D0B1A',
      primaryColor: '#9D4EDD',
      secondaryColor: '#7B2CBF',
      accentColor: '#C77DFF',
      textColor: '#E0E0E0',
      headingColor: '#FFFFFF',
      buttonStyle: 'rounded',
    },
  },
  {
    id: 'ocean-deep',
    name: 'Ocean Deep',
    description: 'Calming blue ocean tones',
    styles: {
      backgroundColor: '#0A192F',
      primaryColor: '#2C7DA0',
      secondaryColor: '#61A5C2',
      accentColor: '#89C2D9',
      textColor: '#E0F2FE',
      headingColor: '#F0F9FF',
      buttonStyle: 'rounded',
    },
  },
  {
    id: 'forest-mist',
    name: 'Forest Mist',
    description: 'Natural green earthy tones',
    styles: {
      backgroundColor: '#0F1A14',
      primaryColor: '#2D6A4F',
      secondaryColor: '#40916C',
      accentColor: '#52B788',
      textColor: '#D8F3DC',
      headingColor: '#F0FFF4',
      buttonStyle: 'rounded',
    },
  },
  {
    id: 'sunset-blaze',
    name: 'Sunset Blaze',
    description: 'Warm vibrant sunset colors',
    styles: {
      backgroundColor: '#1A0F0A',
      primaryColor: '#E85D04',
      secondaryColor: '#F48C06',
      accentColor: '#FAA307',
      textColor: '#FFF3E0',
      headingColor: '#FFFFFF',
      buttonStyle: 'rounded',
    },
  },
  {
    id: 'midnight-rose',
    name: 'Midnight Rose',
    description: 'Elegant dark pink theme',
    styles: {
      backgroundColor: '#1A0B14',
      primaryColor: '#D81B60',
      secondaryColor: '#E91E63',
      accentColor: '#F06292',
      textColor: '#FCE4EC',
      headingColor: '#FFFFFF',
      buttonStyle: 'rounded',
    },
  },
  {
    id: 'aurora-borealis',
    name: 'Aurora Borealis',
    description: 'Northern lights inspired theme',
    styles: {
      backgroundColor: '#0A1A1A',
      primaryColor: '#00B4D8',
      secondaryColor: '#48CAE4',
      accentColor: '#90E0EF',
      textColor: '#CAF0F8',
      headingColor: '#FFFFFF',
      buttonStyle: 'rounded',
    },
  },
  {
    id: 'royal-gold',
    name: 'Royal Gold',
    description: 'Luxurious gold and black theme',
    styles: {
      backgroundColor: '#0A0A0A',
      primaryColor: '#FFD700',
      secondaryColor: '#FFC107',
      accentColor: '#FFB300',
      textColor: '#FFF8E1',
      headingColor: '#FFFFFF',
      buttonStyle: 'rounded',
    },
  },
  {
    id: 'lavender-dream',
    name: 'Lavender Dream',
    description: 'Soft lavender and purple tones',
    styles: {
      backgroundColor: '#140F1A',
      primaryColor: '#B980EA',
      secondaryColor: '#9B5DE5',
      accentColor: '#C77DFF',
      textColor: '#F3E8FF',
      headingColor: '#FFFFFF',
      buttonStyle: 'rounded',
    },
  },
  {
    id: 'crimson-night',
    name: 'Crimson Night',
    description: 'Bold red dramatic theme',
    styles: {
      backgroundColor: '#1A0808',
      primaryColor: '#DC143C',
      secondaryColor: '#FF1744',
      accentColor: '#FF5252',
      textColor: '#FFEBEE',
      headingColor: '#FFFFFF',
      buttonStyle: 'rounded',
    },
  },
  {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    description: 'Futuristic neon cyberpunk theme',
    styles: {
      backgroundColor: '#0A0A0F',
      primaryColor: '#00FF9D',
      secondaryColor: '#00E5FF',
      accentColor: '#FF00FF',
      textColor: '#E0E0E0',
      headingColor: '#FFFFFF',
      buttonStyle: 'rounded',
    },
  },
  {
    id: 'coffee-break',
    name: 'Coffee Break',
    description: 'Warm coffee and cream tones',
    styles: {
      backgroundColor: '#1C130F',
      primaryColor: '#A67C52',
      secondaryColor: '#C4A484',
      accentColor: '#D2B48C',
      textColor: '#F5E6D3',
      headingColor: '#FFF8F0',
      buttonStyle: 'rounded',
    },
  },
  {
    id: 'sakura-blossom',
    name: 'Sakura Blossom',
    description: 'Soft pink Japanese cherry blossom theme',
    styles: {
      backgroundColor: '#1A0F18',
      primaryColor: '#FFB7C5',
      secondaryColor: '#FF9EB5',
      accentColor: '#FFC0D0',
      textColor: '#FFF0F5',
      headingColor: '#FFFFFF',
      buttonStyle: 'rounded',
    },
  },
];

const colorPalettes = [
  { name: 'Ocean Breeze', colors: ['#0066CC', '#0099FF', '#33CCFF', '#66FFFF', '#CCFFFF'] },
  { name: 'Sunset Glow', colors: ['#FF6B6B', '#FF8E53', '#FFB347', '#FFD966', '#FFF5CC'] },
  { name: 'Forest Greens', colors: ['#2C5F2D', '#4B8C3C', '#6BA35A', '#8CBA78', '#ADD6A6'] },
  { name: 'Royal Purple', colors: ['#4B0082', '#6A0DAD', '#8A2BE2', '#AA6FF9', '#CA9BFE'] },
  { name: 'Neon Vibes', colors: ['#FF00FF', '#00FFFF', '#FFFF00', '#FF6B6B', '#6BFF6B'] },
  { name: 'Pastel Dreams', colors: ['#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA'] },
  { name: 'Earth Tones', colors: ['#8B5A2B', '#A67B45', '#C69C6D', '#E8B88E', '#FFD4AF'] },
  { name: 'Monochrome', colors: ['#000000', '#333333', '#666666', '#999999', '#CCCCCC'] },
];

// ── INTEGRATIONS PANEL ─────────────────────────────────────────────────
const IntegrationsPanel = ({ showSnackbar, projectId, onAddIntegration, onRemoveIntegration }) => {
  const [integrations, setIntegrations] = useState([]);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [configDialog, setConfigDialog] = useState(false);
  const [configData, setConfigData] = useState({
    type: '',
    provider: '',
    api_key: '',
    api_secret: '',
    settings: {},
    webhook_url: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [prebuiltIntegrations, setPrebuiltIntegrations] = useState([
    {
      id: 1,
      name: 'Stripe',
      category: 'payments',
      description: 'Accept payments and manage subscriptions',
      icon: <Payment />,
      color: '#635bff',
      connected: false,
      popular: true,
    },
    {
      id: 2,
      name: 'Mailchimp',
      category: 'marketing',
      description: 'Email marketing and newsletters',
      icon: <Mail />,
      color: '#ffc107',
      connected: false,
      popular: true,
    },
    {
      id: 3,
      name: 'WhatsApp Business',
      category: 'social',
      description: 'Customer support and messaging',
      icon: <WhatsApp />,
      color: '#25D366',
      connected: false,
      popular: true,
    },
    {
      id: 4,
      name: 'Instagram',
      category: 'social',
      description: 'Social media integration and feeds',
      icon: <Instagram />,
      color: '#E4405F',
      connected: true,
      popular: true,
    },
    {
      id: 5,
      name: 'Facebook Pixel',
      category: 'analytics',
      description: 'Track conversions and retargeting',
      icon: <Facebook />,
      color: '#1877F2',
      connected: false,
      popular: true,
    },
    {
      id: 6,
      name: 'Google Analytics',
      category: 'analytics',
      description: 'Website traffic and user behavior',
      icon: <Analytics />,
      color: '#34A853',
      connected: true,
      popular: true,
    },
    {
      id: 7,
      name: 'AWS S3',
      category: 'storage',
      description: 'Cloud storage for media files',
      icon: <Storage />,
      color: '#FF9900',
      connected: false,
      popular: false,
    },
    {
      id: 8,
      name: 'Cloudflare',
      category: 'security',
      description: 'CDN and security protection',
      icon: <Security />,
      color: '#F38020',
      connected: false,
      popular: false,
    },
    {
      id: 9,
      name: 'OpenAI API',
      category: 'ai',
      description: 'AI-powered content generation',
      icon: <Api />,
      color: '#10a37f',
      connected: false,
      popular: true,
    },
    {
      id: 10,
      name: 'Spotify',
      category: 'music',
      description: 'Music embed and playlists',
      icon: <MusicNote />,
      color: '#1DB954',
      connected: false,
      popular: false,
    },
    {
      id: 11,
      name: 'Discord',
      category: 'social',
      description: 'Community integration and webhooks',
      icon: <Chat />,
      color: '#5865F2',
      connected: false,
      popular: true,
    },
    {
      id: 12,
      name: 'Google Drive',
      category: 'storage',
      description: 'Cloud storage integration',
      icon: <CloudUpload />,
      color: '#4285F4',
      connected: false,
      popular: false,
    },
  ]);
  const [activeIntegrationFeatures, setActiveIntegrationFeatures] = useState([]);
  const [connectedIntegrations, setConnectedIntegrations] = useState([]);
  const [dragOverIntegration, setDragOverIntegration] = useState(null);
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [selectedIntegrationCode, setSelectedIntegrationCode] = useState('');
  const [integrationStatus, setIntegrationStatus] = useState({});

  const integrationFeatures = {
    stripe: {
      name: 'Stripe Payment',
      icon: <Payment />,
      code: `<div id="stripe-payment"><div id="payment-element"></div><button id="payment-button">Pay Now</button><script src="https://js.stripe.com/v3/"></script><script>const stripe = Stripe('YOUR_API_KEY');</script></div>`,
      section: 'payment',
    },
    paypal: {
      name: 'PayPal Checkout',
      icon: <Payment />,
      code: `<div id="paypal-button-container"></div><script src="https://www.paypal.com/sdk/js?client-id=YOUR_API_KEY"></script><script>paypal.Buttons({createOrder: (data, actions) => {return actions.order.create({purchase_units: [{ amount: { value: '10.00' } }]});},onApprove: (data, actions) => {return actions.order.capture();}}).render('#paypal-button-container');</script>`,
      section: 'payment',
    },
    mailchimp: {
      name: 'Mailchimp Newsletter',
      icon: <Mail />,
      code: `<div id="mc_embed_signup"><form action="https://YOUR_DC.list-manage.com/subscribe/post" method="POST"><input type="email" name="EMAIL" placeholder="Subscribe to newsletter" required><button type="submit">Subscribe</button></form></div>`,
      section: 'marketing',
    },
    sendgrid: {
      name: 'SendGrid Contact Form',
      icon: <Mail />,
      code: `<form id="contact-form" action="/api/sendgrid/contact" method="POST"><input type="text" name="name" placeholder="Your Name" required><input type="email" name="email" placeholder="Your Email" required><textarea name="message" placeholder="Your Message" required></textarea><button type="submit">Send Message</button></form>`,
      section: 'marketing',
    },
    calendly: {
      name: 'Calendly Scheduling',
      icon: <CalendarToday />,
      code: `<link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet"><script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript" async></script><div class="calendly-inline-widget" data-url="https://calendly.com/YOUR_USERNAME" style="min-width:320px;height:630px;"></div>`,
      section: 'calendar',
    },
    acuity: {
      name: 'Acuity Scheduling',
      icon: <CalendarToday />,
      code: `<div id="acuity-embed"><iframe src="https://acuityscheduling.com/schedule.php?owner=YOUR_OWNER_ID" width="100%" height="800" frameBorder="0"></iframe></div>`,
      section: 'calendar',
    },
    google_analytics: {
      name: 'Google Analytics',
      icon: <Analytics />,
      code: `<!-- Google Analytics --><script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID"></script><script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'YOUR_GA_ID');</script>`,
      section: 'analytics',
    },
    meta_pixel: {
      name: 'Meta Pixel',
      icon: <Facebook />,
      code: `<!-- Meta Pixel Code --><script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', 'YOUR_PIXEL_ID');fbq('track', 'PageView');</script><noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1" /></noscript>`,
      section: 'analytics',
    },
    google_ads: {
      name: 'Google Ads',
      icon: <Campaign />,
      code: `<!-- Google Ads --><script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_ADS_ID"></script><script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'YOUR_ADS_ID');</script>`,
      section: 'ads',
    },
    formspree: {
      name: 'Formspree Form',
      icon: <DescriptionIcon />,
      code: `<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST"><input type="text" name="name" placeholder="Your Name" required><input type="email" name="email" placeholder="Your Email" required><textarea name="message" placeholder="Your Message" required></textarea><button type="submit">Send Message</button></form>`,
      section: 'forms',
    },
    typeform: {
      name: 'Typeform Embed',
      icon: <DescriptionIcon />,
      code: `<div style="position:relative;width:100%;height:0;padding-bottom:56.25%;"><iframe src="https://embed.typeform.com/to/YOUR_FORM_ID" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen></iframe></div>`,
      section: 'forms',
    },
    whatsapp: {
      name: 'WhatsApp Chat',
      icon: <WhatsApp />,
      code: `<a href="https://wa.me/YOUR_PHONE_NUMBER" target="_blank" style="display:inline-flex;align-items:center;gap:8px;background:#25D366;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;">Chat with us on WhatsApp</a>`,
      section: 'social',
    },
    discord: {
      name: 'Discord Widget',
      icon: <Chat />,
      code: `<iframe src="https://discord.com/widget?id=YOUR_SERVER_ID&theme=dark" width="350" height="500" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>`,
      section: 'social',
    },
    instagram: {
      name: 'Instagram Feed',
      icon: <Instagram />,
      code: `<div id="instagram-feed"><script src="https://cdn.jsdelivr.net/npm/@instagram-feed/embed@1.0.0/dist/ig-feed.min.js"></script><ig-feed username="YOUR_USERNAME" limit="6"></ig-feed></div>`,
      section: 'social',
    },
  };

  const integrationTypes = [
    {
      type: 'forms',
      label: 'Form Builder',
      icon: DescriptionIcon,
      providers: ['formspree', 'typeform', 'google_forms'],
    },
    {
      type: 'payment',
      label: 'Payment Gateway',
      icon: Payment,
      providers: ['stripe', 'paypal', 'square'],
    },
    {
      type: 'email',
      label: 'Email Marketing',
      icon: EmailIcon,
      providers: ['mailchimp', 'sendgrid', 'convertkit'],
    },
    {
      type: 'calendar',
      label: 'Calendar/Scheduling',
      icon: CalendarToday,
      providers: ['calendly', 'acuity', 'bookings'],
    },
    {
      type: 'ads',
      label: 'Ad Platforms',
      icon: Campaign,
      providers: ['google_ads', 'meta_ads', 'linkedin_ads'],
    },
  ];

  const integrationCategories = [
    { value: 'all', label: 'All' },
    { value: 'payments', label: 'Payments' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'social', label: 'Social' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'storage', label: 'Storage' },
    { value: 'security', label: 'Security' },
    { value: 'ai', label: 'AI' },
  ];

  const handleConfigure = async () => {
    if (!configData.provider || !configData.api_key) {
      showSnackbar('Please enter API key and select a provider', 'warning');
      return;
    }
    if (configData.api_key.length < 8) {
      showSnackbar('Invalid API key format. Please check your credentials.', 'error');
      return;
    }
    const newIntegration = {
      id: Date.now().toString(),
      type: configData.type,
      provider: configData.provider,
      api_key: configData.api_key,
      api_secret: configData.api_secret,
      settings: configData.settings,
      webhook_url: configData.webhook_url,
      status: 'connected',
      connectedAt: new Date().toISOString(),
      features: integrationFeatures[configData.provider] || null,
    };
    setIntegrations((prev) => [...prev, newIntegration]);
    setConnectedIntegrations((prev) => [...prev, configData.provider]);
    setIntegrationStatus((prev) => ({ ...prev, [configData.provider]: 'connected' }));
    if (integrationFeatures[configData.provider]) {
      setActiveIntegrationFeatures((prev) => [
        ...prev,
        {
          ...integrationFeatures[configData.provider],
          provider: configData.provider,
          integrationId: newIntegration.id,
        },
      ]);
    }
    setConfigDialog(false);
    setConfigData({
      type: '',
      provider: '',
      api_key: '',
      api_secret: '',
      settings: {},
      webhook_url: '',
    });
    if (onAddIntegration) onAddIntegration(newIntegration);
    showSnackbar(`${configData.provider} integration added successfully! 🎉`, 'success');
  };

  const handleRemoveIntegration = (id) => {
    const integration = integrations.find((i) => i.id === id);
    if (integration) {
      setIntegrations(integrations.filter((i) => i.id !== id));
      setConnectedIntegrations((prev) => prev.filter((p) => p !== integration.provider));
      setActiveIntegrationFeatures((prev) => prev.filter((f) => f.integrationId !== id));
      setIntegrationStatus((prev) => ({ ...prev, [integration.provider]: 'disconnected' }));
      if (onRemoveIntegration) onRemoveIntegration(id);
      showSnackbar(`${integration.provider} integration removed`, 'info');
    }
  };

  const handleTogglePrebuilt = (id) => {
    setPrebuiltIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id ? { ...integration, connected: !integration.connected } : integration
      )
    );
    const integration = prebuiltIntegrations.find((i) => i.id === id);
    const newStatus = !integration.connected;
    if (newStatus) {
      setIntegrationStatus((prev) => ({ ...prev, [integration.name.toLowerCase()]: 'connected' }));
      if (integrationFeatures[integration.name.toLowerCase()]) {
        setActiveIntegrationFeatures((prev) => [
          ...prev,
          {
            ...integrationFeatures[integration.name.toLowerCase()],
            provider: integration.name.toLowerCase(),
            integrationId: `prebuilt-${id}`,
          },
        ]);
      }
      showSnackbar(`${integration.name} connected successfully! 🎉`, 'success');
    } else {
      setIntegrationStatus((prev) => ({
        ...prev,
        [integration.name.toLowerCase()]: 'disconnected',
      }));
      setActiveIntegrationFeatures((prev) =>
        prev.filter((f) => f.provider !== integration.name.toLowerCase())
      );
      showSnackbar(`${integration.name} disconnected`, 'info');
    }
  };

  const handleDragStart = (e, feature) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ type: 'integration', feature }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDropOnCanvas = (e) => {
    e.preventDefault();
    setDragOverIntegration(null);
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.type === 'integration' && data.feature) {
        setSelectedIntegrationCode(data.feature.code);
        setShowCodeDialog(true);
      }
    } catch (error) {
      console.error('Error dropping integration:', error);
    }
  };

  const copyIntegrationCode = () => {
    navigator.clipboard.writeText(selectedIntegrationCode);
    showSnackbar('Integration code copied to clipboard!', 'success');
  };

  const filteredPrebuilt = prebuiltIntegrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const connectedCount =
    prebuiltIntegrations.filter((i) => i.connected).length + integrations.length;
  const totalCount = prebuiltIntegrations.length + integrations.length;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Third-Party Integrations
      </Typography>
      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>
        Connect your website with popular services.
      </Typography>

      <Card
        sx={{
          mb: 2,
          background: `linear-gradient(135deg, ${alpha(G_START, 0.1)} 0%, ${alpha(G_MID, 0.1)} 100%)`,
          border: `1px solid ${alpha(G_START, 0.2)}`,
          borderRadius: '12px',
        }}
      >
        <CardContent sx={{ py: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: 'white' }}>
                Integration Status
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'rgba(255,255,255,0.6)', display: 'block' }}
              >
                {connectedCount} of {totalCount} connected
              </Typography>
            </Box>
            <Box sx={{ width: { xs: '100%', sm: 150 } }}>
              <LinearProgress
                variant="determinate"
                value={(connectedCount / totalCount) * 100}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '& .MuiLinearProgress-bar': { background: GRAD },
                }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="subtitle1" sx={{ color: 'white', mb: 1.5 }}>
        Quick Connect
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {integrationTypes.map((integration) => {
          const Icon = integration.icon;
          const isConnected =
            connectedIntegrations.includes(integration.providers[0]) ||
            integrations.some((i) => i.type === integration.type);
          return (
            <Grid item xs={6} key={integration.type}>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s, border-color 0.2s',
                  background: isConnected ? alpha(G_END, 0.1) : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isConnected ? alpha(G_END, 0.3) : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '12px',
                  '&:hover': { transform: 'translateY(-2px)', borderColor: G_START },
                }}
                onClick={() => {
                  setSelectedIntegration(integration);
                  setConfigDialog(true);
                  setConfigData({ ...configData, type: integration.type });
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                  {Icon && (
                    <Icon sx={{ fontSize: 28, color: isConnected ? G_END : G_START, mb: 0.5 }} />
                  )}
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    {integration.label}
                  </Typography>
                  {isConnected && (
                    <Chip
                      label="Connected"
                      size="small"
                      sx={{
                        height: 16,
                        fontSize: '0.55rem',
                        mt: 0.5,
                        bgcolor: alpha(G_END, 0.2),
                        color: G_END,
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

      <TextField
        fullWidth
        size="small"
        placeholder="Search integrations..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 18 }} />
            </InputAdornment>
          ),
          sx: {
            color: 'white',
            fontSize: '0.8rem',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
          },
        }}
        sx={{ mb: 2 }}
      />

      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
        {integrationCategories.map((cat) => (
          <Chip
            key={cat.value}
            label={cat.label}
            size="small"
            onClick={() => setSelectedCategory(cat.value)}
            sx={{
              bgcolor:
                selectedCategory === cat.value ? alpha(G_START, 0.2) : 'rgba(255,255,255,0.05)',
              border: `1px solid ${selectedCategory === cat.value ? G_START : 'rgba(255,255,255,0.1)'}`,
              color: selectedCategory === cat.value ? G_START : 'rgba(255,255,255,0.7)',
              fontSize: '0.7rem',
              height: 24,
            }}
          />
        ))}
      </Box>

      {activeIntegrationFeatures.length > 0 && (
        <>
          <Typography variant="subtitle2" sx={{ color: G_START, mt: 2, mb: 1 }}>
            🎯 Active Integration Features (Drag to Canvas)
          </Typography>
          <Box
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropOnCanvas}
            sx={{
              border: `2px dashed ${alpha(G_START, 0.3)}`,
              borderRadius: '12px',
              p: 2,
              mb: 2,
              minHeight: '60px',
              background: dragOverIntegration ? alpha(G_START, 0.1) : 'transparent',
              transition: 'background 0.2s',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              alignItems: 'center',
            }}
          >
            {activeIntegrationFeatures.map((feature, idx) => (
              <Tooltip key={idx} title={`Drag to canvas to add ${feature.name}`}>
                <Paper
                  draggable
                  onDragStart={(e) => handleDragStart(e, feature)}
                  sx={{
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    bgcolor: alpha(G_START, 0.1),
                    border: `1px solid ${alpha(G_START, 0.3)}`,
                    borderRadius: '8px',
                    cursor: 'grab',
                    '&:hover': {
                      bgcolor: alpha(G_START, 0.2),
                      transform: 'scale(1.02)',
                      transition: 'all 0.2s',
                    },
                    '&:active': { cursor: 'grabbing' },
                  }}
                >
                  {feature.icon}
                  <Typography variant="caption" sx={{ color: 'white' }}>
                    {feature.name}
                  </Typography>
                  <Chip
                    label={feature.section}
                    size="small"
                    sx={{
                      height: 14,
                      fontSize: '0.5rem',
                      bgcolor: alpha(G_START, 0.15),
                      color: G_START,
                    }}
                  />
                </Paper>
              </Tooltip>
            ))}
            <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.4) }}>
              {activeIntegrationFeatures.length} feature(s) ready
            </Typography>
          </Box>
        </>
      )}

      <Typography variant="subtitle2" sx={{ color: 'white', mt: 1, mb: 1 }}>
        Available Integrations ({filteredPrebuilt.length})
      </Typography>
      <Box sx={{ maxHeight: 400, overflowY: 'auto', pr: 1 }}>
        {filteredPrebuilt.map((integration) => {
          const isConnected =
            integrationStatus[integration.name.toLowerCase()] === 'connected' ||
            integration.connected;
          const feature = integrationFeatures[integration.name.toLowerCase()];
          return (
            <Card
              key={integration.id}
              sx={{
                mb: 1.5,
                background: isConnected ? alpha(G_END, 0.05) : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isConnected ? alpha(G_END, 0.3) : alpha(integration.color, 0.2)}`,
                borderRadius: '12px',
                transition: 'all 0.2s',
                '&:hover': { borderColor: integration.color },
              }}
            >
              <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                      sx={{
                        bgcolor: isConnected ? alpha(G_END, 0.2) : alpha(integration.color, 0.2),
                        width: 32,
                        height: 32,
                        color: isConnected ? G_END : integration.color,
                      }}
                    >
                      {integration.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                        {integration.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        {integration.description.substring(0, 40)}...
                      </Typography>
                      {feature && isConnected && (
                        <Chip
                          label="Feature Ready"
                          size="small"
                          sx={{
                            height: 14,
                            fontSize: '0.5rem',
                            mt: 0.5,
                            bgcolor: alpha(G_END, 0.2),
                            color: G_END,
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {feature && isConnected && (
                      <Tooltip title="Drag to canvas">
                        <IconButton
                          size="small"
                          draggable
                          onDragStart={(e) =>
                            handleDragStart(e, {
                              ...feature,
                              provider: integration.name.toLowerCase(),
                            })
                          }
                          sx={{
                            color: G_START,
                            bgcolor: alpha(G_START, 0.1),
                            '&:hover': { bgcolor: alpha(G_START, 0.2) },
                          }}
                        >
                          <DragHandle fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Switch
                      checked={isConnected}
                      onChange={() => handleTogglePrebuilt(integration.id)}
                      size="small"
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: isConnected ? G_END : G_START,
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: isConnected ? G_END : G_START,
                        },
                      }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {integrations.length > 0 && (
        <>
          <Typography variant="subtitle2" sx={{ color: 'white', mt: 2, mb: 1 }}>
            Custom Integrations ({integrations.length})
          </Typography>
          {integrations.map((integration) => {
            const integrationType = integrationTypes.find((t) => t.type === integration.type);
            const Icon = integrationType?.icon;
            const feature = integrationFeatures[integration.provider];
            return (
              <Card
                key={integration.id}
                sx={{
                  mb: 1,
                  background: alpha(G_END, 0.05),
                  border: `1px solid ${alpha(G_END, 0.2)}`,
                  borderRadius: '12px',
                }}
              >
                <CardContent sx={{ py: 1 }}>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {Icon && <Icon sx={{ fontSize: 20, color: G_END }} />}
                      <Box>
                        <Typography variant="caption" sx={{ color: 'white' }}>
                          {integrationType?.label} - {integration.provider}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}
                        >
                          API Key: {integration.api_key.substring(0, 8)}...
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {feature && (
                        <Tooltip title="Drag to canvas">
                          <IconButton
                            size="small"
                            draggable
                            onDragStart={(e) =>
                              handleDragStart(e, {
                                ...feature,
                                provider: integration.provider,
                                integrationId: integration.id,
                              })
                            }
                            sx={{
                              color: G_START,
                              bgcolor: alpha(G_START, 0.1),
                              '&:hover': { bgcolor: alpha(G_START, 0.2) },
                            }}
                          >
                            <DragHandle fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveIntegration(integration.id)}
                        sx={{ color: '#ff4444' }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </>
      )}

      <Dialog
        open={configDialog}
        onClose={() => setConfigDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: '#0D1220',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
          },
        }}
      >
        <DialogTitle sx={{ color: 'white', pb: 0 }}>
          Configure {selectedIntegration?.label}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <Alert severity="info" sx={{ mb: 2, bgcolor: alpha(G_START, 0.1), color: '#A5B4FC' }}>
              <Typography variant="caption">
                Enter your API key or access token to activate this integration.
              </Typography>
            </Alert>
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel sx={{ color: 'rgba(255,255,255,0.6)' }}>Provider</InputLabel>
              <Select
                value={configData.provider}
                onChange={(e) =>
                  setConfigData({ ...configData, provider: e.target.value, settings: {} })
                }
                label="Provider"
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                }}
              >
                {selectedIntegration?.providers.map((provider) => (
                  <MenuItem key={provider} value={provider}>
                    {provider.replace('_', ' ').toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {configData.provider && (
              <>
                <TextField
                  fullWidth
                  size="small"
                  label="API Key / Access Token"
                  placeholder="Enter your API key here..."
                  value={configData.api_key}
                  onChange={(e) => setConfigData({ ...configData, api_key: e.target.value })}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="API Secret (optional)"
                  placeholder="Enter your API secret..."
                  value={configData.api_secret}
                  onChange={(e) => setConfigData({ ...configData, api_secret: e.target.value })}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Webhook URL (optional)"
                  placeholder="https://your-webhook-url.com"
                  value={configData.webhook_url}
                  onChange={(e) => setConfigData({ ...configData, webhook_url: e.target.value })}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    },
                  }}
                />
                <Box sx={{ mt: 2, p: 2, bgcolor: alpha(G_START, 0.05), borderRadius: '8px' }}>
                  <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.6) }}>
                    ✅ After connecting, you'll be able to drag and drop integration features onto
                    your page.
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfigDialog(false)} sx={{ color: 'rgba(255,255,255,0.6)' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfigure}
            disabled={!configData.provider || !configData.api_key}
            sx={{ background: GRAD, borderRadius: '20px', textTransform: 'none', px: 3 }}
          >
            Connect & Activate
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showCodeDialog}
        onClose={() => setShowCodeDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: '#0D1220',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
          },
        }}
      >
        <DialogTitle
          sx={{
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>Integration Code</span>
          <IconButton onClick={() => setShowCodeDialog(false)} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2, bgcolor: alpha(G_START, 0.1), color: '#A5B4FC' }}>
            <Typography variant="caption">
              Copy this code and paste it into your page. Replace placeholder values with your
              actual credentials.
            </Typography>
          </Alert>
          <Paper
            sx={{
              p: 2,
              bgcolor: '#1A1F2E',
              borderRadius: '8px',
              maxHeight: '400px',
              overflow: 'auto',
              position: 'relative',
            }}
          >
            <Box
              component="pre"
              sx={{
                color: '#E0E0E0',
                fontFamily: 'monospace',
                fontSize: '12px',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                margin: 0,
              }}
            >
              {selectedIntegrationCode}
            </Box>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setShowCodeDialog(false)} sx={{ color: 'rgba(255,255,255,0.6)' }}>
            Close
          </Button>
          <Button
            variant="contained"
            onClick={copyIntegrationCode}
            startIcon={<ContentCopy />}
            sx={{ background: GRAD, borderRadius: '20px', textTransform: 'none', px: 3 }}
          >
            Copy Code
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// ── MAIN DESIGN STUDIO COMPONENT ─────────────────────────────────────
const DesignStudio = ({
  currentProject = getInitialProject(),
  setCurrentProject,
  mergedDesign,
  setMergedDesign,
  wsConnection,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, token, logout } = useAuth();

  // ── State ──
  const [activeTab, setActiveTab] = useState(0);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [selectedTextElement, setSelectedTextElement] = useState(null);
  const [selectedImageElement, setSelectedImageElement] = useState(null);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [showCode, setShowCode] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [components, setComponents] = useState([]);
  const [textElements, setTextElements] = useState([]);
  const [imageElements, setImageElements] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [publishUrl, setPublishUrl] = useState('');
  const [colorPickerAnchor, setColorPickerAnchor] = useState(null);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [projectNameInput, setProjectNameInput] = useState('');
  const [savedProjectCard, setSavedProjectCard] = useState(null);
  const [selectedColorTarget, setSelectedColorTarget] = useState(null);
  const [editingText, setEditingText] = useState(null);
  const [dragDropMode, setDragDropMode] = useState(false);
  const [canvasScale, setCanvasScale] = useState(1);
  const [imageUploadDialogOpen, setImageUploadDialogOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [websiteName, setWebsiteName] = useState('');
  const [isSavingToDB, setIsSavingToDB] = useState(false);
  const [generatedSlug, setGeneratedSlug] = useState('');
  const [slugError, setSlugError] = useState('');
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [pages, setPages] = useState([
    { id: 'page-1', name: 'Home', components: [], textElements: [], imageElements: [] },
  ]);
  const [activePageId, setActivePageId] = useState('page-1');
  const [addPageDialogOpen, setAddPageDialogOpen] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [showProjectsGallery, setShowProjectsGallery] = useState(false);
  const [allProjects, setAllProjects] = useState([]);
  const [galleryPreviewProject, setGalleryPreviewProject] = useState(null);
  const [imageUploadMode, setImageUploadMode] = useState('mock');
  const [mockImageUrl, setMockImageUrl] = useState('');
  const [autoSaveStatus, setAutoSaveStatus] = useState('idle');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(() => {
    const stored = localStorage.getItem('autoSaveEnabled');
    return stored === null ? true : stored === 'true';
  });
  const [paletteComponentOpen, setPaletteComponentOpen] = useState(false);

  const fileInputRef = useRef(null);
  const replaceImageInputRef = useRef(null);
  const canvasRef = useRef(null);
  const autoSaveTimerRef = useRef(null);
  const periodicAutoSaveRef = useRef(null);
  const latestStateRef = useRef(null);

  const [globalStyles, setGlobalStyles] = useState({
    primaryColor: G_START,
    secondaryColor: G_MID,
    accentColor: G_END,
    fontFamily: 'Inter, sans-serif',
    backgroundColor: '#080C14',
    textColor: '#FFFFFF',
    headingColor: '#FFFFFF',
    borderRadius: '12px',
    spacing: '24px',
    buttonStyle: 'rounded',
    animationEnabled: true,
    backgroundGradient: null,
    backgroundImage: null,
    backgroundBlur: 0,
    backgroundOpacity: 1,
  });

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedComponent(null);
        setSelectedTextElement(null);
        setSelectedImageElement(null);
        setEditingText(null);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  // ── Load projects ──
  useEffect(() => {
    if (token) loadProjectsFromDatabase();
    else loadProjectsFromLocalStorage();
  }, [token]);

  // ── Load from URL params ──
  useEffect(() => {
    const projectParam = searchParams.get('project');
    if (projectParam) {
      loadProjectFromUrl(projectParam);
      return;
    }
    const designParam = searchParams.get('design');
    if (designParam && Array.isArray(design) && design.length > 0) {
      const decoded = decodeURIComponent(designParam);
      const matched = design.find(
        (d) =>
          d.name === decoded ||
          d.id === decoded ||
          d.name?.toLowerCase() === decoded.toLowerCase() ||
          d.id?.toLowerCase() === decoded.toLowerCase()
      );
      if (matched) loadDesignFromTemplates(matched);
    }
  }, [searchParams, token]);

  // ── Load saved theme ──
  useEffect(() => {
    const savedThemeId = localStorage.getItem('currentColorTheme');
    if (savedThemeId) {
      const savedTheme = colorThemes.find((theme) => theme.id === savedThemeId);
      if (savedTheme) applyColorTheme(savedTheme);
    }
    const savedColors = localStorage.getItem('selectedDesignColors');
    if (savedColors) {
      try {
        const colors = JSON.parse(savedColors);
        setGlobalStyles((prev) => ({
          ...prev,
          primaryColor: colors.primaryColor || prev.primaryColor,
          secondaryColor: colors.secondaryColor || prev.secondaryColor,
          accentColor: colors.accentColor || prev.accentColor,
          backgroundColor: colors.backgroundColor || prev.backgroundColor,
          textColor: colors.textColor || prev.textColor,
          headingColor: colors.headingColor || prev.headingColor,
        }));
      } catch (e) {
        console.error('Error loading saved colors:', e);
      }
    }
    const savedImages = localStorage.getItem('uploadedImages');
    if (savedImages) {
      try {
        setUploadedImages(JSON.parse(savedImages));
      } catch (e) {
        console.error('Error loading saved images:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));
  }, [uploadedImages]);

  // ── Keep selected item panels in sync with live data ──
  // Without this, editing a component/text/image (colors, content, styles)
  // updates the canvas but the side panel keeps showing stale values,
  // since selectedComponent/selectedTextElement/selectedImageElement are
  // separate state snapshots rather than derived from the arrays below.
  useEffect(() => {
    if (!selectedComponent) return;
    const fresh = components.find((c) => c.id === selectedComponent.id);
    if (!fresh) setSelectedComponent(null);
    else if (fresh !== selectedComponent) setSelectedComponent(fresh);
  }, [components]);

  useEffect(() => {
    if (!selectedTextElement) return;
    const fresh = textElements.find((t) => t.id === selectedTextElement.id);
    if (!fresh) setSelectedTextElement(null);
    else if (fresh !== selectedTextElement) setSelectedTextElement(fresh);
  }, [textElements]);

  useEffect(() => {
    if (!selectedImageElement) return;
    const fresh = imageElements.find((i) => i.id === selectedImageElement.id);
    if (!fresh) setSelectedImageElement(null);
    else if (fresh !== selectedImageElement) setSelectedImageElement(fresh);
  }, [imageElements]);

  useEffect(() => {
    localStorage.setItem('autoSaveEnabled', String(autoSaveEnabled));
  }, [autoSaveEnabled]);

  // ── Auto-save ──
  // Keep a ref to the latest state so the periodic (every-10-minutes)
  // save always has fresh data without needing to restart the interval.
  useEffect(() => {
    const projectId = currentProject?.id || savedProjectCard?.id;
    latestStateRef.current = {
      projectId,
      name: currentProject?.name || savedProjectCard?.name || 'Untitled',
      components,
      textElements,
      imageElements,
      uploadedImages,
      styles: globalStyles,
      pages,
      type: currentProject?.type || 'custom',
      status: currentProject?.status || 'draft',
    };
  });

  // Quick debounce save shortly after the user stops editing, so in-progress
  // work isn't lost between the 10-minute periodic saves.
  useEffect(() => {
    const projectId = currentProject?.id || savedProjectCard?.id;
    if (!projectId || !autoSaveEnabled) return;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    setAutoSaveStatus('saving');
    autoSaveTimerRef.current = setTimeout(() => {
      try {
        const projectData = {
          id: projectId,
          name: currentProject?.name || savedProjectCard?.name || 'Untitled',
          components,
          textElements,
          imageElements,
          uploadedImages,
          styles: globalStyles,
          pages,
          lastEdited: new Date().toISOString(),
          type: currentProject?.type || 'custom',
          status: currentProject?.status || 'draft',
        };
        saveProjectToLocalStorage(projectData);
        if (setCurrentProject) setCurrentProject(projectData);
        setAutoSaveStatus('saved');
        setTimeout(() => setAutoSaveStatus('idle'), 2000);
      } catch (e) {
        setAutoSaveStatus('idle');
      }
    }, 1500);
    return () => clearTimeout(autoSaveTimerRef.current);
  }, [components, textElements, imageElements, globalStyles, pages, autoSaveEnabled]);

  // Guaranteed periodic save every 10 minutes, regardless of edit activity.
  // Re-armed whenever the user flips the autosave switch back on.
  useEffect(() => {
    if (!autoSaveEnabled) return;
    const TEN_MINUTES = 10 * 60 * 1000;
    periodicAutoSaveRef.current = setInterval(() => {
      const state = latestStateRef.current;
      if (!state || !state.projectId) return;
      try {
        const projectData = {
          id: state.projectId,
          name: state.name,
          components: state.components,
          textElements: state.textElements,
          imageElements: state.imageElements,
          uploadedImages: state.uploadedImages,
          styles: state.styles,
          pages: state.pages,
          lastEdited: new Date().toISOString(),
          type: state.type,
          status: state.status,
        };
        setAutoSaveStatus('saving');
        saveProjectToLocalStorage(projectData);
        if (setCurrentProject) setCurrentProject(projectData);
        setAutoSaveStatus('saved');
        setTimeout(() => setAutoSaveStatus('idle'), 2000);
      } catch (e) {
        setAutoSaveStatus('idle');
      }
    }, TEN_MINUTES);
    return () => clearInterval(periodicAutoSaveRef.current);
  }, [autoSaveEnabled]);

  useEffect(() => {
    const page = pages.find((p) => p.id === activePageId);
    if (page) {
      setComponents(page.components || []);
      setTextElements(page.textElements || []);
      setImageElements(page.imageElements || []);
    }
  }, [activePageId]);

  // ── Load functions ──
  const loadProjectsFromDatabase = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/api/projects`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      const projectsData = response.data;
      setAllProjects(projectsData);
      if (currentProject?.id) {
        const dbProject = projectsData.find((p) => p.id === currentProject.id);
        if (dbProject) {
          setCurrentProject(dbProject);
          const customizations = dbProject.customizations || {};
          setComponents(customizations.components || []);
          setTextElements(customizations.textElements || []);
          setImageElements(customizations.imageElements || []);
          setUploadedImages(customizations.uploadedImages || []);
          if (customizations.styles)
            setGlobalStyles((prev) => ({ ...prev, ...customizations.styles }));
          if (customizations.pages) {
            setPages(customizations.pages);
            setActivePageId(customizations.pages[0]?.id || 'page-1');
          }
        }
      }
    } catch (error) {
      console.error('Error loading projects from database:', error);
      loadProjectsFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadProjectsFromLocalStorage = () => {
    const projectList = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('project_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '');
          if (data && data.id && data.name) projectList.push(data);
        } catch (e) {
          console.error('Error parsing project:', e);
        }
      }
    }
    setAllProjects(projectList);
  };

  const loadProjectFromUrl = async (projectId) => {
    setLoading(true);
    try {
      if (token) {
        const response = await axios.get(`${API_BASE}/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const project = response.data;
        if (project) {
          handleOpenProjectInEditor(project);
          saveProjectToLocalStorage({ ...project, id: projectId });
          showSnackbar(`Loaded "${project.name}"`, 'success');
          return;
        }
      }
      const localData = localStorage.getItem(`project_${projectId}`);
      if (localData) {
        const project = JSON.parse(localData);
        handleOpenProjectInEditor(project);
        localStorage.setItem('latest_project_id', projectId);
        showSnackbar(`Loaded "${project.name}" from local storage`, 'success');
        return;
      }
      showSnackbar(`Project ${projectId} not found`, 'warning');
    } catch (error) {
      console.error('Error loading project from URL:', error);
      const localData = localStorage.getItem(`project_${projectId}`);
      if (localData) {
        try {
          const project = JSON.parse(localData);
          handleOpenProjectInEditor(project);
          localStorage.setItem('latest_project_id', projectId);
          showSnackbar(`Loaded "${project.name}" (offline)`, 'info');
        } catch (e) {
          showSnackbar('Failed to load project', 'error');
        }
      } else {
        showSnackbar('Failed to load project', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const saveProjectToDatabase = async (projectData) => {
    try {
      const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
      let response;
      try {
        const getResponse = await axios.get(`${API_BASE}/api/projects/${projectData.id}`, {
          headers,
        });
        if (getResponse.data) {
          response = await axios.put(
            `${API_BASE}/api/projects/${projectData.id}`,
            {
              name: projectData.name,
              customizations: {
                components: projectData.components || [],
                textElements: projectData.textElements || [],
                imageElements: projectData.imageElements || [],
                uploadedImages: projectData.uploadedImages || [],
                styles: projectData.styles || {},
                pages: projectData.pages || [],
              },
              html_code: projectData.html_code || '',
            },
            { headers }
          );
        }
      } catch (error) {
        response = await axios.post(
          `${API_BASE}/api/projects`,
          {
            name: projectData.name,
            designs: [],
            customizations: {
              components: projectData.components || [],
              textElements: projectData.textElements || [],
              imageElements: projectData.imageElements || [],
              uploadedImages: projectData.uploadedImages || [],
              styles: projectData.styles || {},
              pages: projectData.pages || [],
            },
          },
          { headers }
        );
      }
      return response.data;
    } catch (error) {
      console.error('Error saving to database:', error);
      throw error;
    }
  };

  const saveProjectToLocalStorage = (projectData) => {
    localStorage.setItem(`project_${projectData.id}`, JSON.stringify(projectData));
    localStorage.setItem('latest_project_id', projectData.id);
    localStorage.setItem('latest_project_data', JSON.stringify(projectData));
  };

  const checkSlugUniqueness = async (slug) => {
    if (!slug || slug.length < 3) return true;
    setIsCheckingSlug(true);
    try {
      const response = await axios.get(`${API_BASE}/api/websites/check-slug`, {
        params: { slug },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setIsCheckingSlug(false);
      return response.data.isUnique;
    } catch (error) {
      setIsCheckingSlug(false);
      console.error('Error checking slug:', error);
      return false;
    }
  };

  const generateThumbnailDataUrl = (styles) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 340;
      const ctx = canvas.getContext('2d');
      if (!CanvasRenderingContext2D.prototype.roundRect) {
        CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
          if (w < 2 * r) r = w / 2;
          if (h < 2 * r) r = h / 2;
          this.moveTo(x + r, y);
          this.lineTo(x + w - r, y);
          this.quadraticCurveTo(x + w, y, x + w, y + r);
          this.lineTo(x + w, y + h - r);
          this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
          this.lineTo(x + r, y + h);
          this.quadraticCurveTo(x, y + h, x, y + h - r);
          this.lineTo(x, y + r);
          this.quadraticCurveTo(x, y, x + r, y);
          return this;
        };
      }
      ctx.fillStyle = styles.backgroundColor || '#080C14';
      ctx.fillRect(0, 0, 600, 340);
      const grad = ctx.createLinearGradient(0, 0, 600, 180);
      grad.addColorStop(0, styles.primaryColor || '#4F6EF7');
      grad.addColorStop(1, styles.secondaryColor || '#2DBCB6');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(20, 20, 560, 160, 12);
      ctx.fill();
      ctx.fillStyle = styles.headingColor || '#FFFFFF';
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.roundRect(120, 65, 360, 18, 4);
      ctx.fill();
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.roundRect(170, 95, 260, 10, 3);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(240, 122, 120, 32, 8);
      ctx.fill();
      const cardColors = [styles.primaryColor, styles.secondaryColor, styles.accentColor];
      [0, 1, 2].forEach((i) => {
        ctx.globalAlpha = 0.12;
        ctx.fillStyle = cardColors[i] || '#4F6EF7';
        ctx.beginPath();
        ctx.roundRect(20 + i * 194, 200, 174, 120, 10);
        ctx.fill();
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = cardColors[i] || '#4F6EF7';
        ctx.beginPath();
        ctx.roundRect(40 + i * 194, 220, 80, 8, 3);
        ctx.fill();
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = styles.textColor || '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(40 + i * 194, 240, 130, 6, 2);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(40 + i * 194, 254, 100, 6, 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      return canvas.toDataURL('image/png');
    } catch (_) {
      return null;
    }
  };

  // ── Theme functions ──
  const applyColorTheme = (theme) => {
    setGlobalStyles((prev) => ({
      ...prev,
      primaryColor: theme.styles.primaryColor,
      secondaryColor: theme.styles.secondaryColor,
      accentColor: theme.styles.accentColor,
      backgroundColor: theme.styles.backgroundColor,
      textColor: theme.styles.textColor,
      headingColor: theme.styles.headingColor,
      buttonStyle: theme.styles.buttonStyle,
    }));
    localStorage.setItem(
      'selectedDesignColors',
      JSON.stringify({
        primaryColor: theme.styles.primaryColor,
        secondaryColor: theme.styles.secondaryColor,
        accentColor: theme.styles.accentColor,
        backgroundColor: theme.styles.backgroundColor,
        textColor: theme.styles.textColor,
        headingColor: theme.styles.headingColor,
      })
    );
    localStorage.setItem('currentColorTheme', theme.id);
    showSnackbar(`${theme.name} theme applied!`, 'success');
  };

  const applyColorPalette = (palette) => {
    setGlobalStyles((prev) => ({
      ...prev,
      primaryColor: palette.colors[0],
      secondaryColor: palette.colors[1],
      accentColor: palette.colors[2],
    }));
    localStorage.setItem(
      'selectedDesignColors',
      JSON.stringify({
        primaryColor: palette.colors[0],
        secondaryColor: palette.colors[1],
        accentColor: palette.colors[2],
        backgroundColor: globalStyles.backgroundColor,
        textColor: globalStyles.textColor,
        headingColor: globalStyles.headingColor,
      })
    );
    showSnackbar(`${palette.name} palette applied`, 'success');
  };

  const showSnackbar = (message, severity = 'success') =>
    setSnackbar({ open: true, message, severity });

  // ── Initialize ──
  const initializeDefaultComponents = () =>
    setComponents([
      {
        id: 'hero-1',
        type: 'hero',
        content: {
          title: 'Welcome to Your Website',
          subtitle: 'Create something amazing with our drag-and-drop editor',
          buttonText: 'Get Started',
          image: null,
        },
        styles: { textAlign: 'center', padding: '80px 0' },
      },
    ]);

  const initializeDefaultTextElements = () =>
    setTextElements([
      {
        id: 'text-1',
        type: 'text',
        tag: 'h1',
        content: 'Welcome to Your Website',
        styles: {
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#FFFFFF',
          textAlign: 'center',
          margin: '20px 0',
          fontFamily: globalStyles.fontFamily,
        },
        position: { x: 50, y: 100 },
      },
      {
        id: 'text-2',
        type: 'text',
        tag: 'p',
        content:
          'Create something amazing with our drag-and-drop editor. Add text, images, and components to build your perfect website.',
        styles: {
          fontSize: '18px',
          fontWeight: 'normal',
          color: 'rgba(255,255,255,0.8)',
          textAlign: 'center',
          margin: '20px 0',
          fontFamily: globalStyles.fontFamily,
          maxWidth: '800px',
        },
        position: { x: 50, y: 180 },
      },
    ]);

  const initializeFromDesign = () => {
    if (mergedDesign?.components) setComponents(mergedDesign.components);
    if (mergedDesign?.textElements) setTextElements(mergedDesign.textElements);
    if (mergedDesign?.imageElements) setImageElements(mergedDesign.imageElements);
    if (mergedDesign?.uploadedImages) setUploadedImages(mergedDesign.uploadedImages);
    if (mergedDesign?.styles) setGlobalStyles({ ...globalStyles, ...mergedDesign.styles });
  };

  // ── Template loading ──
  const loadTemplateDesign = (designName) => {
    const templateStyles = getTemplateStyles(designName);
    setGlobalStyles((prev) => ({ ...prev, ...templateStyles }));
    localStorage.setItem(
      'selectedDesignColors',
      JSON.stringify({
        primaryColor: templateStyles.primaryColor,
        secondaryColor: templateStyles.secondaryColor,
        accentColor: templateStyles.accentColor,
        backgroundColor: templateStyles.backgroundColor,
        textColor: templateStyles.textColor,
        headingColor: templateStyles.headingColor,
      })
    );
    const templateComponents = getTemplateComponents(designName);
    setComponents(templateComponents);
    const defaultTexts = [
      {
        id: Date.now().toString(),
        type: 'text',
        tag: 'h1',
        content: templateStyles.heroTitle || 'Welcome to Your Website',
        styles: {
          fontSize: '48px',
          fontWeight: 'bold',
          color: templateStyles.headingColor,
          textAlign: 'center',
          margin: '20px 0',
          fontFamily: templateStyles.fontFamily,
        },
        position: { x: 50, y: 100 },
      },
      {
        id: (Date.now() + 1).toString(),
        type: 'text',
        tag: 'p',
        content:
          templateStyles.heroSubtitle || 'Create something amazing with our drag-and-drop editor',
        styles: {
          fontSize: '18px',
          fontWeight: 'normal',
          color: templateStyles.textColor,
          textAlign: 'center',
          margin: '20px 0',
          fontFamily: templateStyles.fontFamily,
          maxWidth: '800px',
        },
        position: { x: 50, y: 180 },
      },
    ];
    setTextElements(defaultTexts);
    addToHistory(
      templateComponents,
      { ...globalStyles, ...templateStyles },
      defaultTexts,
      imageElements,
      uploadedImages
    );
  };

  const getTemplateStyles = (designName) => {
    const styles = {
      'Modern Minimalist': {
        primaryColor: '#A59B8C',
        secondaryColor: '#6B5E4A',
        accentColor: '#C4B5A0',
        backgroundColor: '#FAF9F7',
        textColor: '#2C2C2C',
        headingColor: '#1A1A1A',
        borderRadius: '8px',
        spacing: '32px',
        fontFamily: 'Inter, sans-serif',
        buttonStyle: 'rounded',
        heroTitle: 'Modern Minimalist Design',
        heroSubtitle: 'Clean, professional, and effective',
      },
      'Creative Agency': {
        primaryColor: '#2C6E6B',
        secondaryColor: '#FF6B6B',
        accentColor: '#4ECDC4',
        backgroundColor: '#FFFFFF',
        textColor: '#2C3E50',
        headingColor: '#1A2A3A',
        borderRadius: '0px',
        spacing: '48px',
        fontFamily: 'Poppins, sans-serif',
        buttonStyle: 'square',
        heroTitle: 'Creative Agency',
        heroSubtitle: 'We create bold digital experiences',
      },
      'Shop Modern': {
        primaryColor: '#1F2A2E',
        secondaryColor: '#E67E22',
        accentColor: '#F39C12',
        backgroundColor: '#FFFFFF',
        textColor: '#2C3E50',
        headingColor: '#1F2A2E',
        borderRadius: '4px',
        spacing: '40px',
        fontFamily: 'Roboto, sans-serif',
        buttonStyle: 'rounded',
        heroTitle: 'Shop Modern',
        heroSubtitle: 'Discover the latest trends',
      },
      default: {
        primaryColor: G_START,
        secondaryColor: G_MID,
        accentColor: G_END,
        backgroundColor: '#080C14',
        textColor: '#FFFFFF',
        headingColor: '#FFFFFF',
        borderRadius: '12px',
        spacing: '24px',
        fontFamily: 'Inter, sans-serif',
        buttonStyle: 'rounded',
        heroTitle: 'Welcome to Your Website',
        heroSubtitle: 'Create something amazing',
      },
    };
    return styles[designName] || styles.default;
  };

  const getTemplateComponents = (designName) => {
    const componentsMap = {
      'Modern Minimalist': [
        {
          id: 'hero-1',
          type: 'hero',
          content: {
            title: 'Modern Minimalist Design',
            subtitle: 'Clean, professional, and effective',
            buttonText: 'Get Started',
            image: null,
          },
          styles: { textAlign: 'center', padding: '80px 0' },
        },
        {
          id: 'features-1',
          type: 'features',
          content: {
            title: 'Why Choose Us',
            items: [
              {
                title: 'Clean Design',
                description: 'Minimalist approach for maximum impact',
                image: null,
              },
              {
                title: 'Fast Performance',
                description: 'Optimized for speed and efficiency',
                image: null,
              },
              {
                title: 'Responsive Layout',
                description: 'Looks great on all devices',
                image: null,
              },
            ],
          },
          styles: { padding: '60px 0', backgroundColor: 'rgba(0,0,0,0.02)' },
        },
      ],
      'Creative Agency': [
        {
          id: 'hero-1',
          type: 'hero',
          content: {
            title: 'Creative Agency',
            subtitle: 'We create bold digital experiences',
            buttonText: 'View Work',
            image: null,
          },
          styles: {
            textAlign: 'center',
            padding: '100px 0',
            background: 'linear-gradient(135deg, #2C6E6B, #FF6B6B)',
          },
        },
        {
          id: 'portfolio-1',
          type: 'gallery',
          content: {
            title: 'Our Work',
            items: [
              { title: 'Project 1', description: 'Brand Identity', image: null },
              { title: 'Project 2', description: 'Web Design', image: null },
              { title: 'Project 3', description: 'Digital Marketing', image: null },
            ],
          },
          styles: { padding: '60px 0' },
        },
      ],
      'Shop Modern': [
        {
          id: 'hero-1',
          type: 'hero',
          content: {
            title: 'Shop Modern',
            subtitle: 'Discover the latest trends',
            buttonText: 'Shop Now',
            image: null,
          },
          styles: { textAlign: 'center', padding: '80px 0' },
        },
        {
          id: 'products-1',
          type: 'pricing',
          content: {
            title: 'Featured Products',
            plans: [
              { name: 'Basic', price: '$29', features: ['Feature 1', 'Feature 2'] },
              { name: 'Pro', price: '$79', features: ['Feature 1', 'Feature 2', 'Feature 3'] },
              { name: 'Enterprise', price: '$199', features: ['All features', 'Priority support'] },
            ],
          },
          styles: { padding: '60px 0' },
        },
      ],
      default: [
        {
          id: 'hero-1',
          type: 'hero',
          content: {
            title: 'Welcome to Your Website',
            subtitle: 'Create something amazing',
            buttonText: 'Get Started',
            image: null,
          },
          styles: { textAlign: 'center', padding: '80px 0' },
        },
      ],
    };
    return componentsMap[designName] || componentsMap.default;
  };

  // ── History ──
  const addToHistory = (
    newComponents,
    newStyles,
    newTextElements,
    newImageElements,
    newUploadedImages
  ) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      components: newComponents,
      styles: newStyles,
      textElements: newTextElements || textElements,
      imageElements: newImageElements || imageElements,
      uploadedImages: newUploadedImages || uploadedImages,
    });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setComponents(prevState.components);
      setGlobalStyles(prevState.styles);
      setTextElements(prevState.textElements || []);
      setImageElements(prevState.imageElements || []);
      setUploadedImages(prevState.uploadedImages || []);
      setHistoryIndex(historyIndex - 1);
      showSnackbar('Undo successful', 'info');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setComponents(nextState.components);
      setGlobalStyles(nextState.styles);
      setTextElements(nextState.textElements || []);
      setImageElements(nextState.imageElements || []);
      setUploadedImages(nextState.uploadedImages || []);
      setHistoryIndex(historyIndex + 1);
      showSnackbar('Redo successful', 'info');
    }
  };

  // ── Style change ──
  const handleStyleChange = (property, value) => {
    const newStyles = { ...globalStyles, [property]: value };
    setGlobalStyles(newStyles);
    if (
      [
        'primaryColor',
        'secondaryColor',
        'accentColor',
        'backgroundColor',
        'textColor',
        'headingColor',
      ].includes(property)
    ) {
      localStorage.setItem(
        'selectedDesignColors',
        JSON.stringify({
          primaryColor: property === 'primaryColor' ? value : globalStyles.primaryColor,
          secondaryColor: property === 'secondaryColor' ? value : globalStyles.secondaryColor,
          accentColor: property === 'accentColor' ? value : globalStyles.accentColor,
          backgroundColor: property === 'backgroundColor' ? value : globalStyles.backgroundColor,
          textColor: property === 'textColor' ? value : globalStyles.textColor,
          headingColor: property === 'headingColor' ? value : globalStyles.headingColor,
        })
      );
    }
    addToHistory(components, newStyles, textElements, imageElements, uploadedImages);
  };

  // ── Component functions ──
  const getDefaultContent = (type) => {
    switch (type) {
      case 'hero':
        return {
          title: 'New Hero Section',
          subtitle: 'Add your compelling message here',
          buttonText: 'Learn More',
          image: null,
        };
      case 'features':
        return {
          title: 'Features',
          items: [
            { title: 'Feature 1', description: 'Description of feature 1', image: null },
            { title: 'Feature 2', description: 'Description of feature 2', image: null },
            { title: 'Feature 3', description: 'Description of feature 3', image: null },
          ],
        };
      case 'gallery':
        return {
          title: 'Gallery',
          items: [
            { title: 'Project 1', description: 'Project description', image: null },
            { title: 'Project 2', description: 'Project description', image: null },
            { title: 'Project 3', description: 'Project description', image: null },
          ],
        };
      case 'contact':
        return {
          title: 'Contact Us',
          formFields: ['name', 'email', 'message'],
          address: '123 Business St, City, Country',
          email: 'info@example.com',
          phone: '+1 234 567 890',
        };
      case 'pricing':
        return {
          title: 'Pricing Plans',
          plans: [
            { name: 'Basic', price: '$29', features: ['Feature 1', 'Feature 2'] },
            { name: 'Pro', price: '$79', features: ['Feature 1', 'Feature 2', 'Feature 3'] },
            { name: 'Enterprise', price: '$199', features: ['All features', 'Priority support'] },
          ],
        };
      case 'logo':
        return {
          text: 'Your Logo',
          image: null,
          link: '/',
          alignment: 'left',
          size: 'medium',
          tagline: '',
        };
      case 'footer':
        return {
          companyName: 'Your Company',
          tagline: 'Building amazing websites',
          links: [
            { label: 'Home', url: '/' },
            { label: 'About', url: '/about' },
            { label: 'Services', url: '/services' },
            { label: 'Contact', url: '/contact' },
          ],
          socialLinks: [
            { platform: 'Facebook', url: '#' },
            { platform: 'Twitter', url: '#' },
            { platform: 'Instagram', url: '#' },
            { platform: 'LinkedIn', url: '#' },
          ],
          copyright: '© 2024 Your Company. All rights reserved.',
          columns: 4,
          showNewsletter: true,
        };
      default:
        return { text: 'New Section' };
    }
  };

  const getComponentIcon = (type) => {
    switch (type) {
      case 'hero':
        return <ImageIcon />;
      case 'features':
        return <GridOn />;
      case 'gallery':
        return <PhotoLibrary />;
      case 'contact':
        return <ContactMail />;
      case 'pricing':
        return <ShoppingCart />;
      case 'logo':
        return <ImageIcon />;
      case 'footer':
        return <ViewQuilt />;
      default:
        return <TextFields />;
    }
  };

  const getComponentName = (type) => type.charAt(0).toUpperCase() + type.slice(1);

  const handleAddComponent = (type) => {
    const newComponent = {
      id: Date.now().toString(),
      type,
      content: getDefaultContent(type),
      styles: {},
      position: components.length,
    };
    const newComponents = [...components, newComponent];
    setComponents(newComponents);
    addToHistory(newComponents, globalStyles, textElements, imageElements, uploadedImages);
    showSnackbar(`${type} component added`, 'success');
  };

  const handleUpdateComponent = (id, updates) => {
    const newComponents = components.map((comp) =>
      comp.id === id ? { ...comp, ...updates } : comp
    );
    setComponents(newComponents);
    addToHistory(newComponents, globalStyles, textElements, imageElements, uploadedImages);
  };

  const handleDeleteComponent = (id) => {
    const newComponents = components.filter((comp) => comp.id !== id);
    setComponents(newComponents);
    addToHistory(newComponents, globalStyles, textElements, imageElements, uploadedImages);
    if (selectedComponent?.id === id) setSelectedComponent(null);
    showSnackbar('Component deleted', 'info');
  };

  const handleUpdateComponentContent = (componentId, field, value, itemIndex = null) => {
    const component = components.find((c) => c.id === componentId);
    if (!component) return;
    let updatedContent = { ...component.content };
    if (itemIndex !== null && component.type === 'features' && component.content.items) {
      const updatedItems = [...component.content.items];
      updatedItems[itemIndex] = { ...updatedItems[itemIndex], [field]: value };
      updatedContent.items = updatedItems;
    } else if (itemIndex !== null && component.type === 'gallery' && component.content.items) {
      const updatedItems = [...component.content.items];
      updatedItems[itemIndex] = { ...updatedItems[itemIndex], [field]: value };
      updatedContent.items = updatedItems;
    } else if (itemIndex !== null && component.type === 'pricing' && component.content.plans) {
      const updatedPlans = [...component.content.plans];
      updatedPlans[itemIndex] = { ...updatedPlans[itemIndex], [field]: value };
      updatedContent.plans = updatedPlans;
    } else if (component.type === 'logo') {
      updatedContent[field] = value;
    } else if (component.type === 'footer') {
      if (field === 'links' || field === 'socialLinks') updatedContent[field] = value;
      else updatedContent[field] = value;
    } else {
      updatedContent[field] = value;
    }
    handleUpdateComponent(componentId, { content: updatedContent });
  };

  const handleAddComponentItem = (componentId, type) => {
    const component = components.find((c) => c.id === componentId);
    if (!component) return;
    let updatedContent = { ...component.content };
    const newItem = { title: 'New Item', description: 'Description', image: null };
    if (component.type === 'features' && updatedContent.items)
      updatedContent.items = [...updatedContent.items, newItem];
    else if (component.type === 'gallery' && updatedContent.items)
      updatedContent.items = [...updatedContent.items, newItem];
    else if (component.type === 'pricing' && updatedContent.plans)
      updatedContent.plans = [
        ...updatedContent.plans,
        { name: 'New Plan', price: '$0', features: ['Feature 1'] },
      ];
    else if (component.type === 'footer') {
      if (type === 'link')
        updatedContent.links = [...(updatedContent.links || []), { label: 'New Link', url: '#' }];
      else if (type === 'social')
        updatedContent.socialLinks = [
          ...(updatedContent.socialLinks || []),
          { platform: 'Social', url: '#' },
        ];
    }
    handleUpdateComponent(componentId, { content: updatedContent });
    showSnackbar('New item added', 'success');
  };

  const handleDeleteComponentItem = (componentId, type, index) => {
    const component = components.find((c) => c.id === componentId);
    if (!component) return;
    let updatedContent = { ...component.content };
    if (type === 'feature' && updatedContent.items)
      updatedContent.items = updatedContent.items.filter((_, i) => i !== index);
    else if (type === 'gallery' && updatedContent.items)
      updatedContent.items = updatedContent.items.filter((_, i) => i !== index);
    else if (type === 'plan' && updatedContent.plans)
      updatedContent.plans = updatedContent.plans.filter((_, i) => i !== index);
    else if (type === 'link' && updatedContent.links)
      updatedContent.links = updatedContent.links.filter((_, i) => i !== index);
    else if (type === 'social' && updatedContent.socialLinks)
      updatedContent.socialLinks = updatedContent.socialLinks.filter((_, i) => i !== index);
    handleUpdateComponent(componentId, { content: updatedContent });
    showSnackbar('Item deleted', 'info');
  };

  // ── Text element functions ──
  const handleAddTextElement = (textStyle) => {
    const newTextElement = {
      id: Date.now().toString(),
      type: 'text',
      tag: textStyle.tag,
      content: textStyle.defaultText,
      styles: {
        fontSize: textStyle.fontSize,
        fontWeight: textStyle.fontWeight,
        color: globalStyles.textColor,
        textAlign: 'center',
        margin: '10px 0',
        fontFamily: globalStyles.fontFamily,
        ...(textStyle.tag === 'a' && { textDecoration: 'underline', cursor: 'pointer' }),
        ...(textStyle.isNav && {
          display: 'flex',
          gap: '24px',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '12px 0',
          flexWrap: 'wrap',
        }),
      },
      position: { x: 50, y: Math.random() * 300 + 100 },
      href: textStyle.href,
      isNav: textStyle.isNav || false,
    };
    const newTextElements = [...textElements, newTextElement];
    setTextElements(newTextElements);
    addToHistory(components, globalStyles, newTextElements, imageElements, uploadedImages);
    showSnackbar(`${textStyle.name} added to canvas`, 'success');
  };

  const handleUpdateTextElement = (id, updates) => {
    const newTextElements = textElements.map((el) => (el.id === id ? { ...el, ...updates } : el));
    setTextElements(newTextElements);
    addToHistory(components, globalStyles, newTextElements, imageElements, uploadedImages);
  };

  const handleDeleteTextElement = (id) => {
    const newTextElements = textElements.filter((el) => el.id !== id);
    setTextElements(newTextElements);
    addToHistory(components, globalStyles, newTextElements, imageElements, uploadedImages);
    if (selectedTextElement?.id === id) setSelectedTextElement(null);
    showSnackbar('Element deleted', 'info');
  };

  const handleTextStyleChange = (id, property, value) => {
    const element = textElements.find((el) => el.id === id);
    if (element) handleUpdateTextElement(id, { styles: { ...element.styles, [property]: value } });
  };

  const handleTextPositionChange = (id, x, y) => {
    const element = [...textElements, ...imageElements].find((el) => el.id === id);
    if (element) {
      if (element.type === 'text') handleUpdateTextElement(id, { position: { x, y } });
      else handleUpdateImageElement(id, { position: { x, y } });
    }
  };

  // ── Image functions ──
  const processImages = (files) => {
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target.result;
        const newImage = {
          id: Date.now() + Math.random().toString(36).substr(2, 9),
          url: result,
          name: file.name,
          size: file.size,
          type: file.type,
          width: 0,
          height: 0,
          dateAdded: new Date().toISOString(),
        };
        const img = new Image();
        img.onload = () => {
          newImage.width = img.width;
          newImage.height = img.height;
          setUploadedImages((prev) => [...prev, newImage]);
          addToHistory(components, globalStyles, textElements, imageElements, [
            ...uploadedImages,
            newImage,
          ]);
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    });
    showSnackbar(`${files.length} image(s) uploaded successfully`, 'success');
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    processImages(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    processImages(imageFiles);
  };

  const handleAddMockImage = () => {
    const url = mockImageUrl.trim();
    if (!url) {
      showSnackbar('Please enter an image URL', 'warning');
      return;
    }
    const newImage = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      url,
      name: `mock-${Date.now()}.jpg`,
      size: 0,
      type: 'image/jpeg',
      width: 800,
      height: 600,
      dateAdded: new Date().toISOString(),
      isMock: true,
    };
    setUploadedImages((prev) => [...prev, newImage]);
    setMockImageUrl('');
    showSnackbar('Mock image added to library', 'success');
  };

  const handleAddImageToCanvas = (image, imageStyle = null) => {
    const styleToUse = imageStyle || imageStyles[0];
    const newImageElement = {
      id: Date.now().toString(),
      type: 'image',
      imageId: image.id,
      imageUrl: image.url,
      alt: image.name,
      width: styleToUse.width,
      height: styleToUse.height,
      objectFit: styleToUse.objectFit || 'cover',
      borderRadius: styleToUse.borderRadius || globalStyles.borderRadius,
      filters: {
        brightness: 100,
        contrast: 100,
        saturate: 100,
        blur: 0,
        grayscale: 0,
        sepia: 0,
        hueRotate: 0,
      },
      position: { x: 50, y: Math.random() * 300 + 100 },
      styles: {
        width: styleToUse.width,
        height: styleToUse.height,
        objectFit: styleToUse.objectFit || 'cover',
        borderRadius: styleToUse.borderRadius || globalStyles.borderRadius,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      },
    };
    const newImageElements = [...imageElements, newImageElement];
    setImageElements(newImageElements);
    addToHistory(components, globalStyles, textElements, newImageElements, uploadedImages);
    showSnackbar('Image added to canvas', 'success');
  };

  const handleUpdateImageElement = (id, updates) => {
    const newImageElements = imageElements.map((el) => (el.id === id ? { ...el, ...updates } : el));
    setImageElements(newImageElements);
    addToHistory(components, globalStyles, textElements, newImageElements, uploadedImages);
  };

  const handleReplaceImage = (id, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target.result;
      handleUpdateImageElement(id, { imageUrl: result });
      const newUploadedImage = {
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        url: result,
        name: file.name,
        size: file.size,
        type: file.type,
        dateAdded: new Date().toISOString(),
      };
      setUploadedImages((prev) => [...prev, newUploadedImage]);
      showSnackbar('Image replaced', 'success');
    };
    reader.onerror = () => showSnackbar('Failed to replace image', 'error');
    reader.readAsDataURL(file);
  };

  const handleDeleteImageElement = (id) => {
    const newImageElements = imageElements.filter((el) => el.id !== id);
    setImageElements(newImageElements);
    addToHistory(components, globalStyles, textElements, newImageElements, uploadedImages);
    if (selectedImageElement?.id === id) setSelectedImageElement(null);
    showSnackbar('Image removed from canvas', 'info');
  };

  const handleDeleteUploadedImage = (imageId) => {
    setUploadedImages(uploadedImages.filter((img) => img.id !== imageId));
    const newImageElements = imageElements.filter((el) => el.imageId !== imageId);
    setImageElements(newImageElements);
    addToHistory(
      components,
      globalStyles,
      textElements,
      newImageElements,
      uploadedImages.filter((img) => img.id !== imageId)
    );
    showSnackbar('Image deleted from library', 'info');
  };

  const handleResizeImage = (id, newWidth, newHeight) => {
    const imageElement = imageElements.find((el) => el.id === id);
    if (imageElement)
      handleUpdateImageElement(id, {
        width: newWidth,
        height: newHeight,
        styles: { ...imageElement.styles, width: newWidth, height: newHeight },
      });
  };

  const handleApplyImageStyle = (id, style) => {
    const imageElement = imageElements.find((el) => el.id === id);
    if (imageElement) {
      handleUpdateImageElement(id, {
        width: style.width,
        height: style.height,
        objectFit: style.objectFit,
        borderRadius: style.borderRadius,
        styles: {
          ...imageElement.styles,
          width: style.width,
          height: style.height,
          objectFit: style.objectFit,
          borderRadius: style.borderRadius,
        },
      });
      showSnackbar(`Applied ${style.name} style`, 'success');
    }
  };

  const handleApplyImageFilter = (id, filterType, value) => {
    const imageElement = imageElements.find((el) => el.id === id);
    if (imageElement) {
      const newFilters = { ...imageElement.filters, [filterType]: value };
      const filterString = `brightness(${newFilters.brightness}%) contrast(${newFilters.contrast}%) saturate(${newFilters.saturate}%) blur(${newFilters.blur}px) grayscale(${newFilters.grayscale}%) sepia(${newFilters.sepia}%) hue-rotate(${newFilters.hueRotate}deg)`;
      handleUpdateImageElement(id, {
        filters: newFilters,
        styles: { ...imageElement.styles, filter: filterString },
      });
    }
  };

  const handleRotateImage = (id, degrees) => {
    const imageElement = imageElements.find((el) => el.id === id);
    if (imageElement) {
      const currentRotate = imageElement.rotate || 0;
      const newRotate = currentRotate + degrees;
      handleUpdateImageElement(id, {
        rotate: newRotate,
        styles: { ...imageElement.styles, transform: `rotate(${newRotate}deg)` },
      });
    }
  };

  const handleFlipImage = (id, direction) => {
    const imageElement = imageElements.find((el) => el.id === id);
    if (imageElement) {
      const currentFlip = imageElement.flip || { horizontal: false, vertical: false };
      const newFlip = { ...currentFlip, [direction]: !currentFlip[direction] };
      const transform = `scaleX(${newFlip.horizontal ? -1 : 1}) scaleY(${newFlip.vertical ? -1 : 1}) rotate(${imageElement.rotate || 0}deg)`;
      handleUpdateImageElement(id, {
        flip: newFlip,
        styles: { ...imageElement.styles, transform },
      });
    }
  };

  const handleAddImageToComponent = (image, componentId, itemIndex = null) => {
    const updatedComponents = components.map((comp) => {
      if (comp.id === componentId) {
        if (comp.type === 'hero')
          return { ...comp, content: { ...comp.content, image: image.url } };
        if (comp.type === 'logo')
          return { ...comp, content: { ...comp.content, image: image.url } };
        if (comp.type === 'features' && itemIndex !== null) {
          const updatedItems = [...comp.content.items];
          updatedItems[itemIndex] = { ...updatedItems[itemIndex], image: image.url };
          return { ...comp, content: { ...comp.content, items: updatedItems } };
        }
        if (comp.type === 'gallery' && itemIndex !== null) {
          const updatedItems = [...comp.content.items];
          updatedItems[itemIndex] = { ...updatedItems[itemIndex], image: image.url };
          return { ...comp, content: { ...comp.content, items: updatedItems } };
        }
      }
      return comp;
    });
    setComponents(updatedComponents);
    addToHistory(updatedComponents, globalStyles, textElements, imageElements, uploadedImages);
    showSnackbar('Image added to component', 'success');
  };

  // ── Save and Publish ──
  const handleSave = () => {
    setProjectNameInput(currentProject?.name || savedProjectCard?.name || 'Untitled Project');
    setSaveModalOpen(true);
  };

  const handleSaveConfirm = async () => {
    setSaving(true);
    try {
      const projectId = currentProject?.id || savedProjectCard?.id || Date.now().toString();
      const projectName = projectNameInput.trim() || 'Untitled Project';
      const updatedPages = pages.map((p) =>
        p.id === activePageId ? { ...p, components, textElements, imageElements } : p
      );
      const projectData = {
        id: projectId,
        name: projectName,
        components,
        textElements,
        imageElements,
        uploadedImages,
        styles: globalStyles,
        pages: updatedPages,
        lastEdited: new Date().toISOString(),
        type: currentProject?.type || 'custom',
        status: 'draft',
      };
      if (token) await saveProjectToDatabase(projectData);
      saveProjectToLocalStorage(projectData);
      if (setCurrentProject) setCurrentProject(projectData);
      setPages(updatedPages);
      setSavedProjectCard({ name: projectName, id: projectId, status: 'draft' });
      setSaveModalOpen(false);
      showSnackbar('Project saved successfully!', 'success');
      if (token) await loadProjectsFromDatabase();
    } catch (error) {
      console.error('Error saving project:', error);
      showSnackbar('Error saving project. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setPublishModalOpen(true);
    setWebsiteName(currentProject?.name || savedProjectCard?.name || 'My Website');
    setGeneratedSlug('');
    setSlugError('');
  };

  const saveWebsiteToDatabase = async () => {
    if (!websiteName.trim()) {
      showSnackbar('Please enter a website name', 'warning');
      return;
    }
    let finalSlug = generatedSlug;
    if (!finalSlug)
      finalSlug = websiteName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    if (!/^[a-z0-9-]+$/.test(finalSlug)) {
      setSlugError('Slug can only contain lowercase letters, numbers, and hyphens');
      return;
    }
    if (finalSlug.length < 3 || finalSlug.length > 50) {
      setSlugError('Slug must be between 3 and 50 characters');
      return;
    }
    const isUnique = await checkSlugUniqueness(finalSlug);
    if (!isUnique) {
      setSlugError('This URL slug is already taken. Please choose another one.');
      return;
    }
    setIsSavingToDB(true);
    try {
      const projectId = savedProjectCard?.id || currentProject?.id || Date.now().toString();
      const updatedPages = pages.map((p) =>
        p.id === activePageId ? { ...p, components, textElements, imageElements } : p
      );
      const projectData = {
        id: projectId,
        name: websiteName.trim(),
        components,
        textElements,
        imageElements,
        uploadedImages,
        styles: globalStyles,
        pages: updatedPages,
        lastEdited: new Date().toISOString(),
        type: 'custom',
        status: 'published',
        slug: finalSlug,
        published_url: `${window.location.origin}/p/${finalSlug}`,
      };
      if (token) {
        await saveProjectToDatabase(projectData);
        const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
        const publishResponse = await axios.post(
          `${API_BASE}/api/projects/${projectId}/publish`,
          {},
          { headers }
        );
        setPublishUrl(publishResponse.data.published_url || projectData.published_url);
      } else {
        saveProjectToLocalStorage(projectData);
        setPublishUrl(projectData.published_url);
      }
      setSavedProjectCard({
        name: websiteName.trim(),
        id: projectId,
        slug: finalSlug,
        status: 'published',
      });
      setPublishModalOpen(false);
      setPublishDialogOpen(true);
      if (setCurrentProject)
        setCurrentProject({
          ...currentProject,
          ...projectData,
          status: 'published',
          id: projectId,
        });
      setPages(updatedPages);
      showSnackbar('Website published successfully!', 'success');
      if (token) await loadProjectsFromDatabase();
    } catch (error) {
      console.error('Error publishing website:', error);
      const errorMessage = error.response?.data?.detail || 'Error publishing website';
      showSnackbar(errorMessage, 'error');
    } finally {
      setIsSavingToDB(false);
    }
  };

  const handlePreview = () => {
    const projectId = currentProject?.id || savedProjectCard?.id || Date.now().toString();
    const projectData = {
      id: projectId,
      name: currentProject?.name || savedProjectCard?.name || 'Untitled Project',
      components,
      textElements,
      imageElements,
      uploadedImages,
      styles: globalStyles,
      lastEdited: new Date().toISOString(),
      type: currentProject?.type || 'custom',
      status: 'draft',
    };
    saveProjectToLocalStorage(projectData);
    navigate(`/preview?id=${projectId}&t=${Date.now()}`);
    showSnackbar('Opening preview...', 'info');
  };

  const handleOpenProjectInEditor = (project) => {
    if (setCurrentProject) setCurrentProject(project);
    const customizations = project.customizations || {};
    setComponents(customizations.components || []);
    setTextElements(customizations.textElements || []);
    setImageElements(customizations.imageElements || []);
    setUploadedImages(customizations.uploadedImages || []);
    if (customizations.styles) setGlobalStyles((prev) => ({ ...prev, ...customizations.styles }));
    if (customizations.pages) {
      setPages(customizations.pages);
      setActivePageId(customizations.pages[0]?.id || 'page-1');
    }
    setSavedProjectCard({
      name: project.name,
      id: project.id,
      slug: project.slug || project.publishSlug,
    });
    setShowProjectsGallery(false);
    showSnackbar(`Opened "${project.name}"`, 'success');
  };

  const loadProjectFromSavedPages = useCallback(
    (project) => {
      if (!project) return;
      setLoading(true);
      try {
        const customizations = project.customizations || {};
        setComponents(customizations.components || project.components || []);
        setTextElements(customizations.textElements || project.textElements || []);
        setImageElements(customizations.imageElements || project.imageElements || []);
        setUploadedImages(customizations.uploadedImages || project.uploadedImages || []);
        if (customizations.styles || project.styles)
          setGlobalStyles((prev) => ({
            ...prev,
            ...(customizations.styles || project.styles || {}),
          }));
        if (customizations.pages || project.pages) {
          const pagesData = customizations.pages || project.pages;
          setPages(pagesData);
          setActivePageId(pagesData[0]?.id || 'page-1');
        }
        setSavedProjectCard({
          name: project.name,
          id: project.id,
          slug: project.slug || project.publishSlug,
          status: project.status || 'draft',
        });
        if (setCurrentProject) setCurrentProject(project);
        setShowProjectsGallery(false);
        showSnackbar(`Loaded "${project.name}" successfully!`, 'success');
      } catch (error) {
        console.error('Error loading project from Saved Pages:', error);
        showSnackbar('Error loading project', 'error');
      } finally {
        setLoading(false);
      }
    },
    [setCurrentProject]
  );

  const loadDesignFromTemplates = useCallback(
    (template) => {
      if (!template) return;
      setLoading(true);
      try {
        if (template.colors) {
          setGlobalStyles((prev) => ({ ...prev, ...template.colors }));
          localStorage.setItem('selectedDesignColors', JSON.stringify(template.colors));
        }
        const newProject = {
          id: `project_${Date.now()}`,
          name: template.name || 'Untitled Design',
          type: template.category || 'custom',
          lastEdited: new Date().toISOString(),
          status: 'draft',
          design: template.name,
          templateId: template.id,
          colors: template.colors || {},
        };
        const templateComponents = getTemplateComponents(template.name);
        setComponents(templateComponents);
        const defaultTexts = [
          {
            id: `text_${Date.now()}`,
            type: 'text',
            tag: 'h1',
            content: template.colors?.heroTitle || 'Welcome to Your Website',
            styles: {
              fontSize: '48px',
              fontWeight: 'bold',
              color: template.colors?.headingColor || '#FFFFFF',
              textAlign: 'center',
              margin: '20px 0',
              fontFamily: globalStyles.fontFamily,
            },
            position: { x: 50, y: 100 },
          },
          {
            id: `text_${Date.now() + 1}`,
            type: 'text',
            tag: 'p',
            content:
              template.colors?.heroSubtitle ||
              'Create something amazing with our drag-and-drop editor',
            styles: {
              fontSize: '18px',
              fontWeight: 'normal',
              color: template.colors?.textColor || 'rgba(255,255,255,0.8)',
              textAlign: 'center',
              margin: '20px 0',
              fontFamily: globalStyles.fontFamily,
              maxWidth: '800px',
            },
            position: { x: 50, y: 180 },
          },
        ];
        setTextElements(defaultTexts);
        setImageElements([]);
        setSavedProjectCard({ name: newProject.name, id: newProject.id, status: 'draft' });
        if (setCurrentProject) setCurrentProject(newProject);
        saveProjectToLocalStorage({
          ...newProject,
          components: templateComponents,
          textElements: defaultTexts,
          imageElements: [],
          uploadedImages: [],
          styles: { ...globalStyles, ...(template.colors || {}) },
          pages: [
            {
              id: 'page-1',
              name: 'Home',
              components: templateComponents,
              textElements: defaultTexts,
              imageElements: [],
            },
          ],
        });
        showSnackbar(`"${template.name}" template loaded successfully!`, 'success');
      } catch (error) {
        console.error('Error loading design from templates:', error);
        showSnackbar('Error loading template', 'error');
      } finally {
        setLoading(false);
      }
    },
    [globalStyles.fontFamily, setCurrentProject]
  );

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      if (token)
        await axios.delete(`${API_BASE}/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      localStorage.removeItem(`project_${projectId}`);
      setAllProjects((prev) => prev.filter((p) => p.id !== projectId));
      setShowProjectsGallery(false);
      showSnackbar('Project deleted successfully', 'info');
      if (token) await loadProjectsFromDatabase();
    } catch (error) {
      console.error('Error deleting project:', error);
      showSnackbar('Error deleting project', 'error');
    }
  };

  // ── Page management ──
  const handleSwitchPage = (pageId) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === activePageId ? { ...p, components, textElements, imageElements } : p
      )
    );
    setActivePageId(pageId);
  };

  const handleAddPage = () => {
    const name = newPageName.trim() || `Page ${pages.length + 1}`;
    const newPage = {
      id: `page-${Date.now()}`,
      name,
      components: [],
      textElements: [],
      imageElements: [],
    };
    setPages((prev) => [...prev, newPage]);
    setNewPageName('');
    setAddPageDialogOpen(false);
    handleSwitchPage(newPage.id);
    showSnackbar(`Page "${name}" created`, 'success');
  };

  const handleDeletePage = (pageId) => {
    if (pages.length === 1) {
      showSnackbar('Cannot delete the only page', 'warning');
      return;
    }
    const remaining = pages.filter((p) => p.id !== pageId);
    setPages(remaining);
    if (activePageId === pageId) handleSwitchPage(remaining[0].id);
    showSnackbar('Page deleted', 'info');
  };

  // ── Color picker ──
  const handleColorPickerOpen = (event, target, property) => {
    setColorPickerAnchor(event.currentTarget);
    setSelectedColorTarget({ target, property });
  };

  const handleColorPickerClose = () => {
    setColorPickerAnchor(null);
    setSelectedColorTarget(null);
  };

  const handleColorChange = (color) => {
    if (selectedColorTarget) {
      if (selectedColorTarget.target === 'global')
        handleStyleChange(selectedColorTarget.property, color.hex);
      else if (selectedColorTarget.target === 'text' && selectedTextElement)
        handleTextStyleChange(selectedTextElement.id, selectedColorTarget.property, color.hex);
      else if (selectedColorTarget.target === 'component' && selectedComponent)
        handleUpdateComponent(selectedComponent.id, {
          styles: { ...selectedComponent.styles, [selectedColorTarget.property]: color.hex },
        });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publishUrl);
    showSnackbar('Link copied to clipboard!', 'success');
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    showSnackbar('Code copied to clipboard!', 'success');
  };

  // ── Generate HTML ──
  const generateHTMLCode = () => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${currentProject?.name || 'My Website'}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background-color: ${globalStyles.backgroundColor}; color: ${globalStyles.textColor}; font-family: ${globalStyles.fontFamily}; line-height: 1.6; }
    h1, h2, h3, h4, h5, h6 { color: ${globalStyles.headingColor}; }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    .hero { text-align: center; padding: 80px 20px; background: linear-gradient(135deg, ${globalStyles.primaryColor}, ${globalStyles.secondaryColor}); border-radius: ${globalStyles.borderRadius}; }
    button { background: ${globalStyles.primaryColor}; border: none; padding: 12px 24px; border-radius: ${globalStyles.buttonStyle === 'rounded' ? '999px' : globalStyles.borderRadius}; color: white; cursor: pointer; }
    .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; padding: 60px 20px; }
    .feature-card { background: rgba(255,255,255,0.05); padding: 24px; border-radius: ${globalStyles.borderRadius}; text-align: center; }
    .footer { background: ${alpha(globalStyles.primaryColor, 0.05)}; padding: 40px 20px; margin-top: 40px; border-top: 1px solid ${alpha(globalStyles.primaryColor, 0.1)}; }
    .nav-menu { display: flex; gap: 24px; justify-content: center; padding: 12px 0; flex-wrap: wrap; }
    .nav-menu a { color: ${globalStyles.textColor}; text-decoration: none; padding: 8px 16px; border-radius: ${globalStyles.borderRadius}; transition: all 0.3s ease; }
    .nav-menu a:hover { color: ${globalStyles.primaryColor}; background: ${alpha(globalStyles.primaryColor, 0.1)}; }
    .logo-text { font-weight: 700; background: linear-gradient(135deg, ${globalStyles.primaryColor}, ${globalStyles.secondaryColor}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  </style>
</head>
<body>
  <div class="container">
    ${components.find((c) => c.type === 'logo') ? `<div style="display: flex; align-items: center; gap: 16px; padding: 16px 0;">${components.find((c) => c.type === 'logo').content.image ? `<img src="${components.find((c) => c.type === 'logo').content.image}" alt="Logo" style="height: 48px; width: auto;" />` : `<span class="logo-text" style="font-size: 24px;">${components.find((c) => c.type === 'logo').content.text || 'Your Logo'}</span>`}</div>` : ''}
    ${
      textElements.find((el) => el.isNav)
        ? `<nav class="nav-menu">${textElements
            .find((el) => el.isNav)
            .content.split('|')
            .map((item) => `<a href="#">${item.trim()}</a>`)
            .join('')}</nav>`
        : ''
    }
    ${components.find((c) => c.type === 'hero') ? `<div class="hero"><h1>${components.find((c) => c.type === 'hero')?.content?.title || 'Welcome to Your Website'}</h1><p>${components.find((c) => c.type === 'hero')?.content?.subtitle || 'Create something amazing'}</p><button>${components.find((c) => c.type === 'hero')?.content?.buttonText || 'Get Started'}</button></div>` : ''}
    ${
      components.find((c) => c.type === 'features')
        ? `<div class="features-grid">${
            components
              .find((c) => c.type === 'features')
              ?.content?.items?.map(
                (item) =>
                  `<div class="feature-card"><h3>${item.title}</h3><p>${item.description}</p></div>`
              )
              .join('') || ''
          }</div>`
        : ''
    }
    ${
      components.find((c) => c.type === 'footer')
        ? `<div class="footer"><h3>${components.find((c) => c.type === 'footer')?.content?.companyName || 'Your Company'}</h3><p>${components.find((c) => c.type === 'footer')?.content?.tagline || ''}</p><div style="margin-top: 20px;">${
            components
              .find((c) => c.type === 'footer')
              ?.content?.links?.map(
                (link) =>
                  `<a href="${link.url}" style="color: ${globalStyles.primaryColor}; margin: 0 8px; text-decoration: none;">${link.label}</a>`
              )
              .join('') || ''
          }</div><p style="margin-top: 20px; color: ${alpha(globalStyles.textColor, 0.5)};">${components.find((c) => c.type === 'footer')?.content?.copyright || `© ${new Date().getFullYear()} ${components.find((c) => c.type === 'footer')?.content?.companyName || 'Your Company'}. All rights reserved.`}</p></div>`
        : ''
    }
  </div>
</body>
</html>`;
    setGeneratedCode(html);
  };

  useEffect(() => {
    if (showCode) generateHTMLCode();
  }, [showCode, components, globalStyles, textElements]);

  useEffect(() => {
    if (currentProject?.design) loadTemplateDesign(currentProject.design);
    else if (mergedDesign) initializeFromDesign();
    else if (currentProject?.components) {
      setComponents(currentProject.components);
      if (currentProject.textElements) setTextElements(currentProject.textElements);
      if (currentProject.imageElements) setImageElements(currentProject.imageElements);
      if (currentProject.uploadedImages) setUploadedImages(currentProject.uploadedImages);
      if (currentProject.styles) setGlobalStyles(currentProject.styles);
    } else {
      initializeDefaultComponents();
      initializeDefaultTextElements();
    }
  }, [currentProject, mergedDesign]);

  // ── Render component ──
  const renderComponent = (component) => {
    const styles = { color: globalStyles.textColor, ...component.styles };
    switch (component.type) {
      case 'hero':
        return (
          <Box sx={{ ...styles, textAlign: 'center', py: 8, px: 4 }}>
            {component.content.image && (
              <Box
                component="img"
                src={component.content.image}
                alt="Hero"
                sx={{
                  maxWidth: '100%',
                  height: 'auto',
                  mb: 4,
                  borderRadius: globalStyles.borderRadius,
                }}
              />
            )}
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                mb: 2,
                fontWeight: 'bold',
                color: globalStyles.headingColor,
              }}
            >
              {component.content.title}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                color: alpha(globalStyles.textColor, 0.8),
                maxWidth: '800px',
                mx: 'auto',
              }}
            >
              {component.content.subtitle}
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: globalStyles.primaryColor,
                '&:hover': { bgcolor: globalStyles.secondaryColor },
                borderRadius:
                  globalStyles.buttonStyle === 'rounded' ? '999px' : globalStyles.borderRadius,
                px: 4,
                py: 1.5,
              }}
            >
              {component.content.buttonText}
            </Button>
          </Box>
        );
      case 'logo':
        return (
          <Box sx={{ ...styles, display: 'flex', alignItems: 'center', gap: 2, py: 2, px: 4 }}>
            {component.content.image ? (
              <Box
                component="img"
                src={component.content.image}
                alt="Logo"
                sx={{
                  height:
                    component.content.size === 'small'
                      ? 32
                      : component.content.size === 'large'
                        ? 64
                        : 48,
                  width: 'auto',
                  objectFit: 'contain',
                }}
              />
            ) : (
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${globalStyles.primaryColor}, ${globalStyles.secondaryColor})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  fontSize:
                    component.content.size === 'small'
                      ? '1.2rem'
                      : component.content.size === 'large'
                        ? '2rem'
                        : '1.5rem',
                }}
              >
                {component.content.text || 'Your Logo'}
              </Typography>
            )}
            {component.content.tagline && (
              <Typography variant="body2" sx={{ color: alpha(globalStyles.textColor, 0.6), ml: 1 }}>
                {component.content.tagline}
              </Typography>
            )}
          </Box>
        );
      case 'footer': {
        const footerLinks = component.content.links || [];
        const socialLinks = component.content.socialLinks || [];
        const columns = component.content.columns || 4;
        return (
          <Box
            sx={{
              ...styles,
              py: 6,
              px: 4,
              mt: 4,
              backgroundColor: alpha(globalStyles.primaryColor, 0.05),
              borderTop: `1px solid ${alpha(globalStyles.primaryColor, 0.1)}`,
            }}
          >
            <Grid container spacing={4}>
              <Grid item xs={12} md={3}>
                <Typography
                  variant="h6"
                  sx={{ color: globalStyles.headingColor, fontWeight: 600, mb: 2 }}
                >
                  {component.content.companyName || 'Your Company'}
                </Typography>
                {component.content.tagline && (
                  <Typography
                    variant="body2"
                    sx={{ color: alpha(globalStyles.textColor, 0.7), mb: 2 }}
                  >
                    {component.content.tagline}
                  </Typography>
                )}
                {component.content.showNewsletter && (
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      size="small"
                      placeholder="Subscribe to newsletter"
                      sx={{
                        '& .MuiInputBase-input': { color: globalStyles.textColor },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(globalStyles.textColor, 0.2),
                        },
                        mr: 1,
                        width: '70%',
                      }}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        bgcolor: globalStyles.primaryColor,
                        '&:hover': { bgcolor: globalStyles.secondaryColor },
                        mt: { xs: 1, sm: 0 },
                      }}
                    >
                      Subscribe
                    </Button>
                  </Box>
                )}
              </Grid>
              {columns > 1 && (
                <Grid item xs={12} md={3}>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: globalStyles.headingColor, fontWeight: 600, mb: 2 }}
                  >
                    Quick Links
                  </Typography>
                  {footerLinks.slice(0, Math.ceil(footerLinks.length / 2)).map((link, idx) => (
                    <Typography
                      key={idx}
                      component="a"
                      href={link.url}
                      sx={{
                        display: 'block',
                        color: alpha(globalStyles.textColor, 0.7),
                        textDecoration: 'none',
                        mb: 1,
                        '&:hover': { color: globalStyles.primaryColor },
                      }}
                    >
                      {link.label}
                    </Typography>
                  ))}
                </Grid>
              )}
              {columns > 2 && (
                <Grid item xs={12} md={3}>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: globalStyles.headingColor, fontWeight: 600, mb: 2 }}
                  >
                    Resources
                  </Typography>
                  {footerLinks.slice(Math.ceil(footerLinks.length / 2)).map((link, idx) => (
                    <Typography
                      key={idx}
                      component="a"
                      href={link.url}
                      sx={{
                        display: 'block',
                        color: alpha(globalStyles.textColor, 0.7),
                        textDecoration: 'none',
                        mb: 1,
                        '&:hover': { color: globalStyles.primaryColor },
                      }}
                    >
                      {link.label}
                    </Typography>
                  ))}
                </Grid>
              )}
              {columns > 3 && (
                <Grid item xs={12} md={3}>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: globalStyles.headingColor, fontWeight: 600, mb: 2 }}
                  >
                    Connect With Us
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {socialLinks.map((social, idx) => (
                      <IconButton
                        key={idx}
                        component="a"
                        href={social.url}
                        target="_blank"
                        sx={{
                          color: globalStyles.textColor,
                          bgcolor: alpha(globalStyles.primaryColor, 0.1),
                          '&:hover': { bgcolor: globalStyles.primaryColor, color: '#FFFFFF' },
                        }}
                      >
                        {social.platform === 'Facebook' && <Facebook />}
                        {social.platform === 'Twitter' && <Twitter />}
                        {social.platform === 'Instagram' && <Instagram />}
                        {social.platform === 'LinkedIn' && <LinkedIn />}
                        {social.platform === 'YouTube' && <YouTube />}
                        {social.platform === 'WhatsApp' && <WhatsApp />}
                      </IconButton>
                    ))}
                  </Box>
                </Grid>
              )}
            </Grid>
            <Divider sx={{ my: 3, borderColor: alpha(globalStyles.textColor, 0.1) }} />
            <Typography
              variant="body2"
              sx={{ textAlign: 'center', color: alpha(globalStyles.textColor, 0.5) }}
            >
              {component.content.copyright ||
                `© ${new Date().getFullYear()} ${component.content.companyName || 'Your Company'}. All rights reserved.`}
            </Typography>
          </Box>
        );
      }
      case 'features':
        return (
          <Box sx={{ ...styles, py: 6, px: 4 }}>
            <Typography
              variant="h2"
              sx={{
                textAlign: 'center',
                mb: 6,
                color: globalStyles.headingColor,
                fontWeight: 'bold',
              }}
            >
              {component.content.title}
            </Typography>
            <Grid container spacing={4}>
              {component.content.items?.map((item, idx) => (
                <Grid item xs={12} md={4} key={idx}>
                  <Paper
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      bgcolor: alpha(globalStyles.primaryColor, 0.05),
                      borderRadius: globalStyles.borderRadius,
                      transition: 'transform 0.3s',
                      '&:hover': { transform: 'translateY(-8px)' },
                    }}
                  >
                    {item.image && (
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.title}
                        sx={{
                          width: '100%',
                          height: 200,
                          objectFit: 'cover',
                          borderRadius: globalStyles.borderRadius,
                          mb: 2,
                        }}
                      />
                    )}
                    <Typography variant="h5" sx={{ mb: 2, color: globalStyles.primaryColor }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ color: alpha(globalStyles.textColor, 0.7) }}>
                      {item.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      case 'gallery':
        return (
          <Box sx={{ ...styles, py: 6, px: 4 }}>
            <Typography
              variant="h2"
              sx={{
                textAlign: 'center',
                mb: 6,
                color: globalStyles.headingColor,
                fontWeight: 'bold',
              }}
            >
              {component.content.title}
            </Typography>
            <Grid container spacing={3}>
              {component.content.items?.map((item, idx) => (
                <Grid item xs={12} md={4} key={idx}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      bgcolor: alpha(globalStyles.primaryColor, 0.05),
                      borderRadius: globalStyles.borderRadius,
                      transition: 'transform 0.3s',
                      '&:hover': { transform: 'translateY(-5px)' },
                    }}
                  >
                    {item.image ? (
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.title}
                        sx={{
                          width: '100%',
                          height: 200,
                          objectFit: 'cover',
                          borderRadius: globalStyles.borderRadius,
                          mb: 2,
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: '100%',
                          height: 200,
                          bgcolor: alpha(globalStyles.primaryColor, 0.2),
                          borderRadius: globalStyles.borderRadius,
                          mb: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <PhotoLibrary sx={{ fontSize: 48, color: globalStyles.primaryColor }} />
                      </Box>
                    )}
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography variant="body2" sx={{ color: alpha(globalStyles.textColor, 0.7) }}>
                      {item.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      case 'contact':
        return (
          <Box sx={{ ...styles, py: 6, px: 4 }}>
            <Typography
              variant="h2"
              sx={{
                textAlign: 'center',
                mb: 6,
                color: globalStyles.headingColor,
                fontWeight: 'bold',
              }}
            >
              {component.content.title}
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 4,
                    bgcolor: alpha(globalStyles.primaryColor, 0.05),
                    borderRadius: globalStyles.borderRadius,
                  }}
                >
                  <TextField
                    fullWidth
                    label="Name"
                    sx={{ mb: 2 }}
                    InputLabelProps={{ sx: { color: alpha(globalStyles.textColor, 0.7) } }}
                    InputProps={{ sx: { color: globalStyles.textColor } }}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    sx={{ mb: 2 }}
                    InputLabelProps={{ sx: { color: alpha(globalStyles.textColor, 0.7) } }}
                    InputProps={{ sx: { color: globalStyles.textColor } }}
                  />
                  <TextField
                    fullWidth
                    label="Message"
                    multiline
                    rows={4}
                    sx={{ mb: 2 }}
                    InputLabelProps={{ sx: { color: alpha(globalStyles.textColor, 0.7) } }}
                    InputProps={{ sx: { color: globalStyles.textColor } }}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      bgcolor: globalStyles.primaryColor,
                      '&:hover': { bgcolor: globalStyles.secondaryColor },
                    }}
                  >
                    Send Message
                  </Button>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 4,
                    bgcolor: alpha(globalStyles.primaryColor, 0.05),
                    borderRadius: globalStyles.borderRadius,
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, color: globalStyles.headingColor }}>
                    Contact Information
                  </Typography>
                  <Typography sx={{ mb: 1, color: alpha(globalStyles.textColor, 0.8) }}>
                    📍 {component.content.address}
                  </Typography>
                  <Typography sx={{ mb: 1, color: alpha(globalStyles.textColor, 0.8) }}>
                    📧 {component.content.email}
                  </Typography>
                  <Typography sx={{ color: alpha(globalStyles.textColor, 0.8) }}>
                    📞 {component.content.phone}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
      case 'pricing':
        return (
          <Box sx={{ ...styles, py: 6, px: 4 }}>
            <Typography
              variant="h2"
              sx={{
                textAlign: 'center',
                mb: 6,
                color: globalStyles.headingColor,
                fontWeight: 'bold',
              }}
            >
              {component.content.title}
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              {component.content.plans?.map((plan, idx) => (
                <Grid item xs={12} md={4} key={idx}>
                  <Paper
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      bgcolor: alpha(globalStyles.primaryColor, 0.05),
                      borderRadius: globalStyles.borderRadius,
                      transition: 'transform 0.3s',
                      '&:hover': { transform: 'translateY(-8px)' },
                    }}
                  >
                    <Typography variant="h4" sx={{ mb: 2, color: globalStyles.primaryColor }}>
                      {plan.name}
                    </Typography>
                    <Typography variant="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                      {plan.price}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    {plan.features?.map((feature, fIdx) => (
                      <Typography
                        key={fIdx}
                        sx={{ mb: 1, color: alpha(globalStyles.textColor, 0.7) }}
                      >
                        ✓ {feature}
                      </Typography>
                    ))}
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        mt: 3,
                        bgcolor: globalStyles.primaryColor,
                        '&:hover': { bgcolor: globalStyles.secondaryColor },
                      }}
                    >
                      Choose Plan
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      default:
        return (
          <Typography variant="body1" sx={styles}>
            {component.content?.text}
          </Typography>
        );
    }
  };

  // ── Render preview ──
  const renderPreview = () => {
    const previewWidth = { mobile: '375px', tablet: '768px', desktop: '100%' }[previewMode];

    const renderTextFloatingToolbar = (element) => (
      <Box
        sx={{
          position: 'absolute',
          top: -48,
          left: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          bgcolor: '#1A1F2E',
          border: `1px solid ${alpha(G_START, 0.4)}`,
          borderRadius: '10px',
          px: 1,
          py: 0.5,
          boxShadow: `0 4px 20px ${alpha('#000', 0.5)}`,
          pointerEvents: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Tooltip title="Bold">
          <IconButton
            size="small"
            onClick={() =>
              handleTextStyleChange(
                element.id,
                'fontWeight',
                element.styles?.fontWeight === 'bold' ? 'normal' : 'bold'
              )
            }
            sx={{ color: element.styles?.fontWeight === 'bold' ? G_START : 'white', p: 0.5 }}
          >
            <FormatBold fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Italic">
          <IconButton
            size="small"
            onClick={() =>
              handleTextStyleChange(
                element.id,
                'fontStyle',
                element.styles?.fontStyle === 'italic' ? 'normal' : 'italic'
              )
            }
            sx={{ color: element.styles?.fontStyle === 'italic' ? G_START : 'white', p: 0.5 }}
          >
            <FormatItalic fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Underline">
          <IconButton
            size="small"
            onClick={() =>
              handleTextStyleChange(
                element.id,
                'textDecoration',
                element.styles?.textDecoration === 'underline' ? 'none' : 'underline'
              )
            }
            sx={{
              color: element.styles?.textDecoration === 'underline' ? G_START : 'white',
              p: 0.5,
            }}
          >
            <FormatUnderlined fontSize="small" />
          </IconButton>
        </Tooltip>
        <Box sx={{ width: 1, height: 20, bgcolor: alpha('#FFFFFF', 0.2) }} />
        <Tooltip title="Align Left">
          <IconButton
            size="small"
            onClick={() => handleTextStyleChange(element.id, 'textAlign', 'left')}
            sx={{ color: element.styles?.textAlign === 'left' ? G_START : 'white', p: 0.5 }}
          >
            <FormatAlignLeft fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Align Center">
          <IconButton
            size="small"
            onClick={() => handleTextStyleChange(element.id, 'textAlign', 'center')}
            sx={{ color: element.styles?.textAlign === 'center' ? G_START : 'white', p: 0.5 }}
          >
            <FormatAlignCenter fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Align Right">
          <IconButton
            size="small"
            onClick={() => handleTextStyleChange(element.id, 'textAlign', 'right')}
            sx={{ color: element.styles?.textAlign === 'right' ? G_START : 'white', p: 0.5 }}
          >
            <FormatAlignRight fontSize="small" />
          </IconButton>
        </Tooltip>
        <Box sx={{ width: 1, height: 20, bgcolor: alpha('#FFFFFF', 0.2) }} />
        <Tooltip title="Edit Text">
          <IconButton
            size="small"
            onClick={() => setEditingText(element.id)}
            sx={{ color: G_MID, p: 0.5 }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            size="small"
            onClick={() => handleDeleteTextElement(element.id)}
            sx={{ color: '#ff4444', p: 0.5 }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    );

    const renderImageFloatingToolbar = (element) => (
      <Box
        sx={{
          position: 'absolute',
          top: -48,
          left: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          bgcolor: '#1A1F2E',
          border: `1px solid ${alpha(G_MID, 0.4)}`,
          borderRadius: '10px',
          px: 1,
          py: 0.5,
          boxShadow: `0 4px 20px ${alpha('#000', 0.5)}`,
          pointerEvents: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Tooltip title="Rotate Left">
          <IconButton
            size="small"
            onClick={() => handleRotateImage(element.id, -90)}
            sx={{ color: 'white', p: 0.5 }}
          >
            <RotateLeft fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Rotate Right">
          <IconButton
            size="small"
            onClick={() => handleRotateImage(element.id, 90)}
            sx={{ color: 'white', p: 0.5 }}
          >
            <RotateRight fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Flip H">
          <IconButton
            size="small"
            onClick={() => handleFlipImage(element.id, 'horizontal')}
            sx={{ color: 'white', p: 0.5 }}
          >
            <Flip fontSize="small" />
          </IconButton>
        </Tooltip>
        <Box sx={{ width: 1, height: 20, bgcolor: alpha('#FFFFFF', 0.2) }} />
        <Tooltip title="Delete">
          <IconButton
            size="small"
            onClick={() => handleDeleteImageElement(element.id)}
            sx={{ color: '#ff4444', p: 0.5 }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    );

    const renderComponentFloatingToolbar = (component) => (
      <Box
        sx={{
          position: 'absolute',
          top: -48,
          left: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          bgcolor: '#1A1F2E',
          border: `1px solid ${alpha(G_END, 0.4)}`,
          borderRadius: '10px',
          px: 1,
          py: 0.5,
          boxShadow: `0 4px 20px ${alpha('#000', 0.5)}`,
          pointerEvents: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Typography variant="caption" sx={{ color: G_END, px: 1, fontWeight: 600 }}>
          {getComponentName(component.type)}
        </Typography>
        <Box sx={{ width: 1, height: 20, bgcolor: alpha('#FFFFFF', 0.2) }} />
        <Tooltip title="Move Up">
          <IconButton
            size="small"
            onClick={() => {
              const idx = components.findIndex((c) => c.id === component.id);
              if (idx > 0) {
                const newComps = [...components];
                [newComps[idx - 1], newComps[idx]] = [newComps[idx], newComps[idx - 1]];
                setComponents(newComps);
                addToHistory(newComps, globalStyles, textElements, imageElements, uploadedImages);
              }
            }}
            sx={{ color: 'white', p: 0.5 }}
          >
            <Typography sx={{ fontSize: 14, lineHeight: 1 }}>↑</Typography>
          </IconButton>
        </Tooltip>
        <Tooltip title="Move Down">
          <IconButton
            size="small"
            onClick={() => {
              const idx = components.findIndex((c) => c.id === component.id);
              if (idx < components.length - 1) {
                const newComps = [...components];
                [newComps[idx], newComps[idx + 1]] = [newComps[idx + 1], newComps[idx]];
                setComponents(newComps);
                addToHistory(newComps, globalStyles, textElements, imageElements, uploadedImages);
              }
            }}
            sx={{ color: 'white', p: 0.5 }}
          >
            <Typography sx={{ fontSize: 14, lineHeight: 1 }}>↓</Typography>
          </IconButton>
        </Tooltip>
        <Tooltip title="Duplicate">
          <IconButton
            size="small"
            onClick={() => {
              const newComp = { ...component, id: Date.now().toString() };
              const newComps = [...components, newComp];
              setComponents(newComps);
              addToHistory(newComps, globalStyles, textElements, imageElements, uploadedImages);
              showSnackbar('Component duplicated', 'success');
            }}
            sx={{ color: G_START, p: 0.5 }}
          >
            <ContentCopy fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            size="small"
            onClick={() => handleDeleteComponent(component.id)}
            sx={{ color: '#ff4444', p: 0.5 }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    );

    return (
      <Box
        ref={canvasRef}
        sx={{
          width: previewWidth,
          margin: '0 auto',
          transition: 'all 0.3s ease',
          color: globalStyles.textColor,
          fontFamily: globalStyles.fontFamily,
          minHeight: '100vh',
          position: 'relative',
          backgroundColor: globalStyles.backgroundColor,
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          setSelectedComponent(null);
          setSelectedTextElement(null);
          setSelectedImageElement(null);
        }}
      >
        <div className="preview-container" style={{ position: 'relative', minHeight: '100vh' }}>
          {textElements.map((element, index) => (
            <motion.div
              key={element.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              style={{
                position: dragDropMode ? 'absolute' : 'relative',
                left: dragDropMode ? `${element.position?.x || 50}px` : 'auto',
                top: dragDropMode ? `${element.position?.y || 100}px` : 'auto',
                cursor: dragDropMode ? 'move' : 'pointer',
                ...element.styles,
                ...(selectedTextElement?.id === element.id && !dragDropMode
                  ? {
                      outline: `2px solid ${G_START}`,
                      outlineOffset: '4px',
                      borderRadius: '4px',
                      position: 'relative',
                    }
                  : {}),
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (!dragDropMode) {
                  setSelectedTextElement(element);
                  setSelectedComponent(null);
                  setSelectedImageElement(null);
                }
              }}
              onMouseDown={(e) => {
                if (dragDropMode) {
                  const startX = e.clientX;
                  const startY = e.clientY;
                  const startPos = { x: element.position?.x || 50, y: element.position?.y || 100 };
                  const onMouseMove = (moveEvent) => {
                    const dx = moveEvent.clientX - startX;
                    const dy = moveEvent.clientY - startY;
                    handleTextPositionChange(element.id, startPos.x + dx, startPos.y + dy);
                  };
                  const onMouseUp = () => {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                  };
                  document.addEventListener('mousemove', onMouseMove);
                  document.addEventListener('mouseup', onMouseUp);
                }
              }}
            >
              {selectedTextElement?.id === element.id &&
                !dragDropMode &&
                renderTextFloatingToolbar(element)}
              {editingText === element.id ? (
                <TextField
                  autoFocus
                  fullWidth
                  multiline={element.tag === 'p' || element.tag === 'div' || element.isNav}
                  value={element.content}
                  onChange={(e) => handleUpdateTextElement(element.id, { content: e.target.value })}
                  onBlur={() => setEditingText(null)}
                  onKeyPress={(e) => e.key === 'Enter' && setEditingText(null)}
                  sx={{
                    '& .MuiInputBase-root': {
                      color: element.styles.color,
                      fontSize: element.styles.fontSize,
                      fontWeight: element.styles.fontWeight,
                      fontFamily: element.styles.fontFamily,
                      backgroundColor: 'rgba(0,0,0,0.1)',
                    },
                  }}
                />
              ) : element.isNav ? (
                <Box
                  sx={{
                    display: 'flex',
                    gap: '24px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '12px 0',
                    flexWrap: 'wrap',
                  }}
                >
                  {element.content.split('|').map((item, idx) => (
                    <Typography
                      key={idx}
                      component="a"
                      href="#"
                      sx={{
                        color: globalStyles.textColor,
                        textDecoration: 'none',
                        padding: '8px 16px',
                        borderRadius: globalStyles.borderRadius,
                        transition: 'all 0.3s ease',
                        fontSize: element.styles.fontSize,
                        fontWeight: element.styles.fontWeight,
                        '&:hover': {
                          color: globalStyles.primaryColor,
                          backgroundColor: alpha(globalStyles.primaryColor, 0.1),
                        },
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        if (!dragDropMode) setEditingText(element.id);
                      }}
                    >
                      {item.trim()}
                    </Typography>
                  ))}
                </Box>
              ) : (
                React.createElement(
                  element.tag,
                  {
                    style: element.styles,
                    onClick: (e) => {
                      e.stopPropagation();
                      if (!dragDropMode) setEditingText(element.id);
                    },
                    ...(element.tag === 'a' && { href: element.href || '#', target: '_blank' }),
                  },
                  element.content
                )
              )}
            </motion.div>
          ))}

          {imageElements.map((element, index) => (
            <motion.div
              key={element.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              style={{
                position: dragDropMode ? 'absolute' : 'relative',
                left: dragDropMode ? `${element.position?.x || 50}px` : 'auto',
                top: dragDropMode ? `${element.position?.y || 100}px` : 'auto',
                cursor: dragDropMode ? 'move' : 'pointer',
                display: 'inline-block',
                ...(selectedImageElement?.id === element.id && !dragDropMode
                  ? { outline: `2px solid ${G_MID}`, outlineOffset: '4px', borderRadius: '4px' }
                  : {}),
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (!dragDropMode) {
                  setSelectedImageElement(element);
                  setSelectedComponent(null);
                  setSelectedTextElement(null);
                }
              }}
            >
              {selectedImageElement?.id === element.id &&
                !dragDropMode &&
                renderImageFloatingToolbar(element)}
              <img
                src={element.imageUrl}
                alt={element.alt}
                style={{
                  width: element.width,
                  height: element.height,
                  objectFit: element.objectFit,
                  borderRadius: element.borderRadius,
                  filter: element.styles?.filter,
                  transform: element.styles?.transform,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'block',
                }}
              />
            </motion.div>
          ))}

          {components.map((component, index) => (
            <motion.div
              key={component.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedComponent(component);
                setSelectedTextElement(null);
                setSelectedImageElement(null);
              }}
              style={{
                cursor: 'pointer',
                position: 'relative',
                ...component.styles,
                ...(selectedComponent?.id === component.id
                  ? { outline: `2px solid ${G_END}`, outlineOffset: '2px' }
                  : {}),
              }}
            >
              {selectedComponent?.id === component.id && renderComponentFloatingToolbar(component)}
              {renderComponent(component)}
            </motion.div>
          ))}
        </div>
      </Box>
    );
  };

  // ── Publish Modal ──
  const renderPublishModal = () => (
    <Dialog
      open={publishModalOpen}
      onClose={() => !isSavingToDB && setPublishModalOpen(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#0A0F1A',
          backgroundImage: 'none',
          borderRadius: '20px',
          border: `1px solid ${alpha(G_START, 0.25)}`,
          color: 'white',
          overflow: 'hidden',
        },
      }}
    >
      <Box sx={{ height: 4, background: GRAD }} />
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pt: 3 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '12px',
            background: GRAD,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Publish sx={{ fontSize: 20, color: 'white' }} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
            Publish Your Website
          </Typography>
          <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.45) }}>
            Your website will be saved to your account and given a unique URL
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" sx={{ color: alpha('#FFFFFF', 0.7), mb: 1 }}>
              Website Name *
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g., My Awesome Portfolio"
              value={websiteName}
              onChange={(e) => setWebsiteName(e.target.value)}
              disabled={isSavingToDB}
              sx={{
                '& .MuiInputBase-input': { color: 'white' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha('#FFFFFF', 0.2) },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: alpha(G_START, 0.6) },
              }}
            />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ color: alpha('#FFFFFF', 0.7), mb: 1 }}>
              Custom URL (optional)
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ color: alpha('#FFFFFF', 0.5), fontSize: '14px' }}>
                {window.location.origin}/p/
              </Typography>
              <TextField
                placeholder="my-unique-url"
                value={generatedSlug}
                onChange={(e) => {
                  const newSlug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                  setGeneratedSlug(newSlug);
                  setSlugError('');
                }}
                disabled={isSavingToDB}
                error={!!slugError}
                helperText={slugError}
                sx={{
                  flex: 1,
                  '& .MuiInputBase-input': { color: 'white' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha('#FFFFFF', 0.2) },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: alpha(G_START, 0.6) },
                }}
              />
            </Box>
            <Typography
              variant="caption"
              sx={{ color: alpha('#FFFFFF', 0.35), mt: 0.5, display: 'block' }}
            >
              Leave empty to auto-generate from website name.
            </Typography>
          </Box>
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: '12px',
              bgcolor: alpha(G_START, 0.05),
              border: `1px solid ${alpha(G_START, 0.15)}`,
            }}
          >
            <Typography variant="subtitle2" sx={{ color: G_START, mb: 1.5 }}>
              Publish Summary
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                  Components
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                  {components.length}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                  Text Elements
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                  {textElements.length}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                  Images
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                  {imageElements.length}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                  Uploaded Assets
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                  {uploadedImages.length}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Alert
            severity="info"
            sx={{
              bgcolor: alpha(G_START, 0.1),
              color: alpha('#FFFFFF', 0.8),
              '& .MuiAlert-icon': { color: G_START },
            }}
          >
            <Typography variant="caption">
              Your website will be saved to your account database.
            </Typography>
          </Alert>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1.5 }}>
        <Button
          onClick={() => setPublishModalOpen(false)}
          disabled={isSavingToDB}
          sx={{ color: alpha('#FFFFFF', 0.6), '&:hover': { color: 'white' } }}
        >
          Cancel
        </Button>
        <Button
          onClick={saveWebsiteToDatabase}
          variant="contained"
          disabled={isSavingToDB || !websiteName.trim()}
          startIcon={isSavingToDB ? <CircularProgress size={18} /> : <Publish />}
          sx={{
            background: GRAD,
            borderRadius: '10px',
            fontWeight: 700,
            px: 4,
            '&:hover': { opacity: 0.9 },
            '&:disabled': { opacity: 0.5 },
          }}
        >
          {isSavingToDB ? 'Publishing...' : 'Publish Website'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  // ── Loading state ──
  if (loading) {
    return (
      <Box
        sx={{
          bgcolor: '#080C14',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress sx={{ color: G_START }} />
      </Box>
    );
  }

  // ── Main render ──
  return (
    <Box
      sx={{ display: 'flex', height: '100vh', bgcolor: '#080C14', position: 'relative', zIndex: 0 }}
    >
      {/* Left Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 320,
          flexShrink: 0,
          zIndex: 1,
          '& .MuiDrawer-paper': {
            width: 320,
            boxSizing: 'border-box',
            position: 'relative',
            borderRight: `1px solid ${alpha('#FFFFFF', 0.1)}`,
            bgcolor: '#0A0F1A',
            zIndex: 1,
          },
        }}
      >
        <Toolbar />
        <Box sx={{ p: 2, overflow: 'auto', height: 'calc(100% - 64px)', width: '100%' }}>
          <div
            style={{
              width: '100%',
              overflow: 'auto',
              scrollBehavior: 'smooth',
              scrollbarWidth: '2px',
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(e, v) => setActiveTab(v)}
              sx={{ mb: 2, minWidth: 'min-content' }}
              style={{ width: '100%', overflow: 'auto', scrollBehavior: 'smooth' }}
            >
              <Tab label="Components" sx={{ color: 'white' }} />
              <Tab label="Text Styles" sx={{ color: 'white' }} />
              <Tab label="Images" sx={{ color: 'white' }} />
              <Tab label="Themes" sx={{ color: 'white' }} />
              <Tab label="Colors" sx={{ color: 'white' }} />
              <Tab label="Integrations" sx={{ color: 'white' }} />
            </Tabs>
          </div>

          {activeTab === 0 && (
            <>
              <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                Components
              </Typography>
              <Divider sx={{ mb: 2, borderColor: alpha('#FFFFFF', 0.1) }} />
              <Grid container spacing={1}>
                {['hero', 'features', 'gallery', 'contact', 'pricing', 'logo', 'footer'].map(
                  (type) => (
                    <Grid item xs={6} key={type}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={getComponentIcon(type)}
                        onClick={() => handleAddComponent(type)}
                        sx={{
                          justifyContent: 'flex-start',
                          mb: 1,
                          color: 'white',
                          borderColor: alpha('#FFFFFF', 0.2),
                          '&:hover': { borderColor: G_START, bgcolor: alpha(G_START, 0.1) },
                        }}
                      >
                        {getComponentName(type)}
                      </Button>
                    </Grid>
                  )
                )}
              </Grid>
            </>
          )}

          {activeTab === 1 && (
            <>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ color: 'white' }}>
                  Text Styles
                </Typography>
                <Tooltip title="Drag & Drop Mode">
                  <IconButton
                    onClick={() => setDragDropMode(!dragDropMode)}
                    sx={{
                      color: dragDropMode ? G_START : 'white',
                      bgcolor: dragDropMode ? alpha(G_START, 0.2) : 'transparent',
                    }}
                  >
                    <DragHandle />
                  </IconButton>
                </Tooltip>
              </Box>
              <Divider sx={{ mb: 2, borderColor: alpha('#FFFFFF', 0.1) }} />
              <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.7), mb: 2 }}>
                {dragDropMode
                  ? 'Drag mode active - click and drag elements'
                  : 'Click on text to edit, drag icon to move.'}
              </Typography>
              <Grid container spacing={1}>
                {textStyles.map((style) => (
                  <Grid item xs={12} key={style.id}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<TextFields />}
                      onClick={() => handleAddTextElement(style)}
                      sx={{
                        justifyContent: 'flex-start',
                        mb: 1,
                        color: 'white',
                        borderColor: alpha('#FFFFFF', 0.2),
                        '&:hover': { borderColor: G_START, bgcolor: alpha(G_START, 0.1) },
                      }}
                    >
                      <Box
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                      >
                        <Typography variant="body2">{style.name}</Typography>
                        <Typography
                          variant="caption"
                          sx={{ fontSize: style.fontSize, opacity: 0.7 }}
                        >
                          {style.defaultText.substring(0, 30)}...
                        </Typography>
                      </Box>
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {activeTab === 2 && (
            <>
              <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                Image Library
              </Typography>
              <Divider sx={{ mb: 2, borderColor: alpha('#FFFFFF', 0.1) }} />
              <Typography variant="subtitle2" sx={{ color: alpha('#FFFFFF', 0.7), mb: 1, mt: 2 }}>
                Image Size Presets
              </Typography>
              <Grid container spacing={1} sx={{ mb: 3 }}>
                {imageStyles.map((style) => (
                  <Grid item xs={6} key={style.id}>
                    <Button
                      fullWidth
                      size="small"
                      variant="outlined"
                      startIcon={<AspectRatio />}
                      onClick={() => {
                        if (uploadedImages.length > 0)
                          handleAddImageToCanvas(uploadedImages[0], style);
                        else showSnackbar('Upload an image first', 'warning');
                      }}
                      sx={{
                        color: 'white',
                        borderColor: alpha('#FFFFFF', 0.2),
                        '&:hover': { borderColor: G_START },
                      }}
                    >
                      {style.name}
                    </Button>
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: alpha('#FFFFFF', 0.7), mb: 1 }}>
                  Upload Mode
                </Typography>
                <ToggleButtonGroup
                  value={imageUploadMode}
                  exclusive
                  onChange={(_, v) => v && setImageUploadMode(v)}
                  size="small"
                  fullWidth
                  sx={{
                    '& .MuiToggleButton-root': {
                      color: alpha('#FFFFFF', 0.6),
                      borderColor: alpha('#FFFFFF', 0.2),
                      fontSize: '0.75rem',
                    },
                    '& .Mui-selected': {
                      color: G_START,
                      bgcolor: alpha(G_START, 0.15) + ' !important',
                    },
                  }}
                >
                  <ToggleButton value="mock">Mock (URL)</ToggleButton>
                  <ToggleButton value="production">Production (File)</ToggleButton>
                </ToggleButtonGroup>
              </Box>
              {imageUploadMode === 'mock' ? (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: alpha('#FFFFFF', 0.5), display: 'block', mb: 1 }}
                  >
                    Paste any image URL to add it as a mock placeholder
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="https://example.com/image.jpg"
                    value={mockImageUrl}
                    onChange={(e) => setMockImageUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddMockImage()}
                    sx={{
                      mb: 1,
                      '& .MuiInputBase-input': { color: 'white', fontSize: '0.8rem' },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha('#FFFFFF', 0.2) },
                      '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: G_START,
                      },
                    }}
                  />
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleAddMockImage}
                    sx={{
                      color: 'white',
                      borderColor: alpha(G_START, 0.5),
                      '&:hover': { borderColor: G_START, bgcolor: alpha(G_START, 0.1) },
                    }}
                  >
                    Add Mock Image
                  </Button>
                  <Typography
                    variant="caption"
                    sx={{ color: alpha('#FFFFFF', 0.3), display: 'block', mt: 1 }}
                  >
                    Tip: try picsum.photos/800/600 for placeholders
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: alpha('#FFFFFF', 0.5), display: 'block', mb: 1 }}
                  >
                    Upload files — unlimited images saved to the database
                  </Typography>
                  <Paper
                    sx={{
                      p: 3,
                      mb: 2,
                      textAlign: 'center',
                      border: `2px dashed ${alpha(G_START, 0.5)}`,
                      bgcolor: alpha(G_START, 0.05),
                      borderRadius: globalStyles.borderRadius,
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      '&:hover': { borderColor: G_START, bgcolor: alpha(G_START, 0.1) },
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                      onChange={handleImageUpload}
                    />
                    <Upload sx={{ fontSize: 48, color: alpha(G_START, 0.7), mb: 1 }} />
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      Click or drag images here
                    </Typography>
                    <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                      Supports JPG, PNG, GIF, SVG, WebP — no limit
                    </Typography>
                  </Paper>
                </Box>
              )}
              <Typography variant="subtitle2" sx={{ color: alpha('#FFFFFF', 0.7), mb: 1 }}>
                Uploaded Images ({uploadedImages.length})
              </Typography>
              <ImageList sx={{ mb: 2 }} cols={2} gap={8}>
                {uploadedImages.map((image) => (
                  <ImageListItem key={image.id}>
                    <img
                      src={image.url}
                      alt={image.name}
                      style={{
                        borderRadius: globalStyles.borderRadius,
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        width: '100%',
                        height: 90,
                        objectFit: 'cover',
                      }}
                      onClick={() => handleAddImageToCanvas(image)}
                    />
                    {image.isMock && (
                      <Box sx={{ position: 'absolute', top: 4, left: 4 }}>
                        <Chip
                          label="mock"
                          size="small"
                          sx={{
                            height: 16,
                            fontSize: '0.6rem',
                            bgcolor: alpha(G_MID, 0.8),
                            color: 'white',
                          }}
                        />
                      </Box>
                    )}
                    <ImageListItemBar
                      title={
                        image.name.length > 20 ? image.name.substring(0, 20) + '…' : image.name
                      }
                      subtitle={image.isMock ? 'Mock URL' : `${image.width}×${image.height}`}
                      actionIcon={
                        <Box>
                          <Tooltip title="Add to canvas">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddImageToCanvas(image);
                              }}
                              sx={{ color: 'white' }}
                            >
                              <Add />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteUploadedImage(image.id);
                              }}
                              sx={{ color: '#ff4444' }}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      }
                      sx={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
              {uploadedImages.length === 0 && (
                <Box sx={{ textAlign: 'center', width: '100%', py: 4 }}>
                  <PhotoLibrary sx={{ fontSize: 48, color: alpha('#FFFFFF', 0.3), mb: 1 }} />
                  <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                    No images uploaded yet
                  </Typography>
                  <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.3) }}>
                    Use Mock mode to paste a URL, or Production to upload files
                  </Typography>
                </Box>
              )}
            </>
          )}

          {activeTab === 3 && (
            <>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                Color Themes
              </Typography>
              <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.7), mb: 2 }}>
                Choose a pre-designed theme to instantly transform your website's look and feel
              </Typography>
              <Divider sx={{ mb: 2, borderColor: alpha('#FFFFFF', 0.1) }} />
              <Grid container spacing={2}>
                {colorThemes.map((theme) => (
                  <Grid item xs={12} key={theme.id}>
                    <Card
                      sx={{
                        bgcolor: alpha(theme.styles.backgroundColor, 0.5),
                        border: `1px solid ${alpha(theme.styles.primaryColor, 0.3)}`,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          borderColor: theme.styles.primaryColor,
                          boxShadow: `0 8px 24px ${alpha(theme.styles.primaryColor, 0.2)}`,
                        },
                      }}
                      onClick={() => applyColorTheme(theme)}
                    >
                      <Box
                        sx={{
                          height: 100,
                          background: `linear-gradient(135deg, ${theme.styles.primaryColor}, ${theme.styles.secondaryColor})`,
                          borderRadius: '12px 12px 0 0',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 8,
                            left: 8,
                            right: 8,
                            display: 'flex',
                            gap: 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: 40,
                              height: 8,
                              bgcolor: theme.styles.headingColor,
                              borderRadius: '4px',
                              opacity: 0.9,
                            }}
                          />
                          <Box
                            sx={{
                              width: 60,
                              height: 8,
                              bgcolor: theme.styles.textColor,
                              borderRadius: '4px',
                              opacity: 0.6,
                            }}
                          />
                        </Box>
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            width: 50,
                            height: 20,
                            bgcolor: theme.styles.primaryColor,
                            borderRadius: '10px',
                          }}
                        />
                      </Box>
                      <CardContent sx={{ p: 2 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ color: 'white', fontWeight: 'bold', mb: 0.5 }}
                        >
                          {theme.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.6) }}>
                          {theme.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              bgcolor: theme.styles.primaryColor,
                              borderRadius: '4px',
                              border: '1px solid rgba(255,255,255,0.2)',
                            }}
                          />
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              bgcolor: theme.styles.secondaryColor,
                              borderRadius: '4px',
                              border: '1px solid rgba(255,255,255,0.2)',
                            }}
                          />
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              bgcolor: theme.styles.accentColor,
                              borderRadius: '4px',
                              border: '1px solid rgba(255,255,255,0.2)',
                            }}
                          />
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              bgcolor: theme.styles.backgroundColor,
                              borderRadius: '4px',
                              border: '1px solid rgba(255,255,255,0.2)',
                            }}
                          />
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              bgcolor: theme.styles.textColor,
                              borderRadius: '4px',
                              border: '1px solid rgba(255,255,255,0.2)',
                            }}
                          />
                        </Box>
                      </CardContent>
                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button
                          fullWidth
                          size="small"
                          variant="outlined"
                          onClick={(e) => {
                            e.stopPropagation();
                            applyColorTheme(theme);
                          }}
                          sx={{
                            color: 'white',
                            borderColor: alpha(theme.styles.primaryColor, 0.5),
                            '&:hover': {
                              borderColor: theme.styles.primaryColor,
                              bgcolor: alpha(theme.styles.primaryColor, 0.1),
                            },
                          }}
                        >
                          Apply Theme
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {activeTab === 4 && (
            <>
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography variant="h6" sx={{ color: 'white' }}>
                    Colour Palette
                  </Typography>
                  <Tooltip title={paletteComponentOpen ? 'Collapse' : 'Expand'}>
                    <IconButton
                      size="small"
                      onClick={() => setPaletteComponentOpen((v) => !v)}
                      sx={{ color: 'white' }}
                    >
                      <ExpandMore
                        sx={{
                          transform: paletteComponentOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: '0.3s',
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                  Click any swatch to assign it to a site colour role
                </Typography>
              </Box>
              {paletteComponentOpen && (
                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    bgcolor: alpha('#FFFFFF', 0.04),
                    borderRadius: '12px',
                    border: `1px solid ${alpha('#FFFFFF', 0.08)}`,
                  }}
                >
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {[
                      'primaryColor',
                      'secondaryColor',
                      'accentColor',
                      'backgroundColor',
                      'textColor',
                      'headingColor',
                    ].map((key) => (
                      <Tooltip
                        key={key}
                        title={`${key.replace('Color', '')}: ${globalStyles[key]}`}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            px: 1,
                            py: 0.4,
                            borderRadius: '6px',
                            border: `1px solid ${alpha('#FFFFFF', 0.15)}`,
                            bgcolor: alpha('#FFFFFF', 0.06),
                            cursor: 'pointer',
                            '&:hover': { borderColor: G_START },
                          }}
                          onClick={(e) => handleColorPickerOpen(e, 'global', key)}
                        >
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              bgcolor: globalStyles[key],
                              borderRadius: '3px',
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{ color: alpha('#FFFFFF', 0.7), fontSize: '0.65rem' }}
                          >
                            {key.replace('Color', '')}
                          </Typography>
                        </Box>
                      </Tooltip>
                    ))}
                  </Box>
                  {colorPalettes.map((palette) => {
                    const roles = [
                      'primaryColor',
                      'secondaryColor',
                      'accentColor',
                      'backgroundColor',
                      'textColor',
                    ];
                    return (
                      <Box key={palette.name} sx={{ mb: 2 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ color: alpha('#FFFFFF', 0.6), fontWeight: 600 }}
                          >
                            {palette.name}
                          </Typography>
                          <Button
                            size="small"
                            onClick={() => applyColorPalette(palette)}
                            sx={{
                              color: G_START,
                              fontSize: '0.65rem',
                              py: 0,
                              minWidth: 0,
                              textTransform: 'none',
                            }}
                          >
                            Apply All
                          </Button>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {palette.colors.map((color, cIdx) => (
                            <Tooltip
                              key={cIdx}
                              title={`Assign ${color} → ${roles[cIdx] || 'accentColor'}`}
                              placement="top"
                            >
                              <Box
                                onClick={() => {
                                  const role = roles[cIdx] || 'accentColor';
                                  handleStyleChange(role, color);
                                  showSnackbar(
                                    `${role.replace('Color', '')} → ${color}`,
                                    'success'
                                  );
                                }}
                                sx={{
                                  width: 34,
                                  height: 34,
                                  bgcolor: color,
                                  borderRadius: '6px',
                                  border: `2px solid ${alpha('#FFFFFF', 0.12)}`,
                                  cursor: 'pointer',
                                  transition: 'transform 0.15s, box-shadow 0.15s',
                                  '&:hover': {
                                    transform: 'scale(1.18)',
                                    boxShadow: `0 0 10px ${color}99`,
                                    borderColor: 'white',
                                  },
                                }}
                              />
                            </Tooltip>
                          ))}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              )}
              <Divider sx={{ mb: 2, borderColor: alpha('#FFFFFF', 0.1) }} />
              <Typography variant="subtitle2" sx={{ color: alpha('#FFFFFF', 0.6), mb: 1 }}>
                All Palettes
              </Typography>
              <Grid container spacing={1}>
                {colorPalettes.map((palette) => (
                  <Grid item xs={12} key={palette.name}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => applyColorPalette(palette)}
                      sx={{
                        justifyContent: 'flex-start',
                        mb: 1,
                        color: 'white',
                        borderColor: alpha('#FFFFFF', 0.2),
                        '&:hover': { borderColor: G_START },
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                        {palette.colors.map((color, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              width: 20,
                              height: 20,
                              bgcolor: color,
                              borderRadius: '4px',
                              border: '1px solid rgba(255,255,255,0.2)',
                            }}
                          />
                        ))}
                        <Typography sx={{ ml: 1, fontSize: '0.8rem' }}>{palette.name}</Typography>
                      </Box>
                    </Button>
                  </Grid>
                ))}
              </Grid>
              <Typography variant="h6" gutterBottom sx={{ color: 'white', mt: 3 }}>
                Custom Colors
              </Typography>
              <Divider sx={{ mb: 2, borderColor: alpha('#FFFFFF', 0.1) }} />
              <Stack spacing={2}>
                {[
                  'primaryColor',
                  'secondaryColor',
                  'accentColor',
                  'backgroundColor',
                  'textColor',
                  'headingColor',
                ].map((key) => (
                  <Button
                    key={key}
                    fullWidth
                    variant="outlined"
                    startIcon={<Palette />}
                    onClick={(e) => handleColorPickerOpen(e, 'global', key)}
                    sx={{
                      color: 'white',
                      borderColor: alpha('#FFFFFF', 0.2),
                      justifyContent: 'space-between',
                    }}
                  >
                    {key.replace('Color', '')} Color
                    <Box
                      sx={{
                        ml: 1,
                        width: 24,
                        height: 24,
                        bgcolor: globalStyles[key],
                        borderRadius: '4px',
                        border: '1px solid rgba(255,255,255,0.2)',
                      }}
                    />
                  </Button>
                ))}
              </Stack>
            </>
          )}

          {activeTab === 5 && (
            <IntegrationsPanel
              showSnackbar={showSnackbar}
              projectId={currentProject?.id || savedProjectCard?.id}
            />
          )}

          <Typography variant="h6" gutterBottom sx={{ color: 'white', mt: 3 }}>
            Global Styles
          </Typography>
          <Divider sx={{ mb: 2, borderColor: alpha('#FFFFFF', 0.1) }} />
          <Accordion sx={{ bgcolor: 'transparent', color: 'white', boxShadow: 'none' }}>
            <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'white' }} />}>
              <Typography>Typography</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ color: alpha('#FFFFFF', 0.7) }}>Font Family</InputLabel>
                  <Select
                    value={globalStyles.fontFamily}
                    onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
                    label="Font Family"
                    sx={{
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha('#FFFFFF', 0.2) },
                    }}
                  >
                    <MenuItem value="Inter, sans-serif">Inter</MenuItem>
                    <MenuItem value="Poppins, sans-serif">Poppins</MenuItem>
                    <MenuItem value="Roboto, sans-serif">Roboto</MenuItem>
                    <MenuItem value="Montserrat, sans-serif">Montserrat</MenuItem>
                    <MenuItem value="Space Grotesk, sans-serif">Space Grotesk</MenuItem>
                    <MenuItem value="Playfair Display, serif">Playfair Display</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ bgcolor: 'transparent', color: 'white', boxShadow: 'none' }}>
            <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'white' }} />}>
              <Typography>Layout</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <Typography variant="body2" gutterBottom>
                  Border Radius
                </Typography>
                <Slider
                  value={parseInt(globalStyles.borderRadius)}
                  onChange={(e, val) => handleStyleChange('borderRadius', `${val}px`)}
                  min={0}
                  max={32}
                  size="small"
                  sx={{ color: G_START }}
                />
                <Typography variant="body2" gutterBottom>
                  Spacing
                </Typography>
                <Slider
                  value={parseInt(globalStyles.spacing)}
                  onChange={(e, val) => handleStyleChange('spacing', `${val}px`)}
                  min={8}
                  max={64}
                  size="small"
                  sx={{ color: G_START }}
                />
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ color: alpha('#FFFFFF', 0.7) }}>Button Style</InputLabel>
                  <Select
                    value={globalStyles.buttonStyle}
                    onChange={(e) => handleStyleChange('buttonStyle', e.target.value)}
                    label="Button Style"
                    sx={{
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha('#FFFFFF', 0.2) },
                    }}
                  >
                    <MenuItem value="rounded">Rounded</MenuItem>
                    <MenuItem value="square">Square</MenuItem>
                  </Select>
                </FormControl>
                <FormControlLabel
                  control={
                    <Switch
                      checked={globalStyles.animationEnabled}
                      onChange={(e) => handleStyleChange('animationEnabled', e.target.checked)}
                      sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G_START } }}
                    />
                  }
                  label="Enable Animations"
                  sx={{ color: 'white' }}
                />
                <Typography variant="body2" gutterBottom>
                  Canvas Scale
                </Typography>
                <Slider
                  value={canvasScale}
                  onChange={(e, val) => setCanvasScale(val)}
                  min={0.5}
                  max={1.5}
                  step={0.05}
                  size="small"
                  sx={{ color: G_START }}
                />
              </Stack>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ bgcolor: 'transparent', color: 'white', boxShadow: 'none' }}>
            <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'white' }} />}>
              <Typography>Background Effects</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <Typography variant="body2" gutterBottom>
                  Blur Effect
                </Typography>
                <Slider
                  value={globalStyles.backgroundBlur || 0}
                  onChange={(e, val) => handleStyleChange('backgroundBlur', val)}
                  min={0}
                  max={20}
                  size="small"
                  sx={{ color: G_START }}
                />
                <Typography variant="body2" gutterBottom>
                  Opacity
                </Typography>
                <Slider
                  value={globalStyles.backgroundOpacity || 1}
                  onChange={(e, val) => handleStyleChange('backgroundOpacity', val)}
                  min={0}
                  max={1}
                  step={0.05}
                  size="small"
                  sx={{ color: G_START }}
                />
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 0,
          marginTop: '68px',
        }}
      >
        <AppBar
          position="sticky"
          color="transparent"
          elevation={1}
          sx={{ bgcolor: '#0A0F1A', borderBottom: `1px solid ${alpha('#FFFFFF', 0.1)}`, zIndex: 2 }}
        >
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>
              {currentProject?.name || 'Design Studio'}
            </Typography>
            {autoSaveStatus !== 'idle' && autoSaveEnabled && (
              <Chip
                size="small"
                label={autoSaveStatus === 'saving' ? 'Auto-saving…' : '✓ Saved'}
                sx={{
                  mr: 2,
                  bgcolor: autoSaveStatus === 'saved' ? alpha(G_END, 0.2) : alpha(G_START, 0.2),
                  color: autoSaveStatus === 'saved' ? G_END : G_START,
                  fontSize: '0.7rem',
                }}
              />
            )}
            <Tooltip
              title={autoSaveEnabled ? 'Auto-save is on (every 10 min)' : 'Auto-save is off'}
            >
              <FormControlLabel
                sx={{ mr: 2, ml: 0 }}
                control={
                  <Switch
                    size="small"
                    checked={autoSaveEnabled}
                    onChange={(e) => {
                      const enabled = e.target.checked;
                      setAutoSaveEnabled(enabled);
                      if (!enabled) setAutoSaveStatus('idle');
                      showSnackbar(
                        enabled ? 'Auto-save turned on' : 'Auto-save turned off',
                        enabled ? 'success' : 'info'
                      );
                    }}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: G_START },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: G_START,
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.7) }}>
                    Auto-save
                  </Typography>
                }
              />
            </Tooltip>
            <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
              <Tooltip title="Undo">
                <IconButton
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  sx={{ color: 'white' }}
                >
                  <Undo />
                </IconButton>
              </Tooltip>
              <Tooltip title="Redo">
                <IconButton
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  sx={{ color: 'white' }}
                >
                  <Redo />
                </IconButton>
              </Tooltip>
              <Divider orientation="vertical" flexItem sx={{ bgcolor: alpha('#FFFFFF', 0.2) }} />
              <Tooltip title="Mobile">
                <IconButton
                  onClick={() => setPreviewMode('mobile')}
                  color={previewMode === 'mobile' ? 'primary' : 'default'}
                  sx={{ color: previewMode === 'mobile' ? G_START : 'white' }}
                >
                  <MobileFriendly />
                </IconButton>
              </Tooltip>
              <Tooltip title="Tablet">
                <IconButton
                  onClick={() => setPreviewMode('tablet')}
                  color={previewMode === 'tablet' ? 'primary' : 'default'}
                  sx={{ color: previewMode === 'tablet' ? G_START : 'white' }}
                >
                  <TabletMac />
                </IconButton>
              </Tooltip>
              <Tooltip title="Desktop">
                <IconButton
                  onClick={() => setPreviewMode('desktop')}
                  color={previewMode === 'desktop' ? 'primary' : 'default'}
                  sx={{ color: previewMode === 'desktop' ? G_START : 'white' }}
                >
                  <DesktopWindows />
                </IconButton>
              </Tooltip>
            </Box>
            <Tooltip title="Code View">
              <IconButton
                onClick={() => setShowCode(!showCode)}
                color={showCode ? 'primary' : 'default'}
                sx={{ color: showCode ? G_START : 'white', mr: 1 }}
              >
                <Code />
              </IconButton>
            </Tooltip>
            <Tooltip title={dragDropMode ? 'Switch to Select Mode' : 'Switch to Drag-Drop Mode'}>
              <IconButton
                onClick={() => {
                  setDragDropMode(!dragDropMode);
                  showSnackbar(
                    dragDropMode
                      ? 'Select mode: click elements to edit'
                      : 'Drag-drop mode: drag elements to reposition',
                    'info'
                  );
                }}
                sx={{
                  color: dragDropMode ? G_MID : alpha('#FFFFFF', 0.5),
                  mr: 1,
                  border: `1px solid ${dragDropMode ? G_MID : 'transparent'}`,
                  borderRadius: '8px',
                }}
              >
                {dragDropMode ? <OpenWith fontSize="small" /> : <DragIndicator fontSize="small" />}
              </IconButton>
            </Tooltip>
            <Button
              variant="outlined"
              startIcon={<FolderOpen />}
              onClick={() => setShowProjectsGallery(true)}
              sx={{ mr: 1, color: 'white', borderColor: alpha('#FFFFFF', 0.2) }}
            >
              My Projects
            </Button>
            <Button
              variant="outlined"
              startIcon={<Preview />}
              onClick={handlePreview}
              sx={{ mr: 1, color: 'white', borderColor: alpha('#FFFFFF', 0.2) }}
            >
              Preview
            </Button>
            <Button
              variant="contained"
              startIcon={saving ? <CircularProgress size={20} /> : <Save />}
              onClick={handleSave}
              disabled={saving}
              sx={{ mr: 1, background: GRAD, '&:hover': { opacity: 0.9 } }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              startIcon={publishing ? <CircularProgress size={20} /> : <Publish />}
              onClick={handlePublish}
              disabled={publishing}
              sx={{ bgcolor: G_END, '&:hover': { bgcolor: G_MID } }}
            >
              Publish
            </Button>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            px: 2,
            py: 0.75,
            bgcolor: '#0D1220',
            borderBottom: `1px solid ${alpha('#FFFFFF', 0.08)}`,
            overflowX: 'auto',
            flexShrink: 0,
          }}
        >
          {pages.map((page) => (
            <Chip
              key={page.id}
              label={page.name}
              onClick={() => handleSwitchPage(page.id)}
              onDelete={pages.length > 1 ? () => handleDeletePage(page.id) : undefined}
              sx={{
                bgcolor: activePageId === page.id ? alpha(G_START, 0.25) : alpha('#FFFFFF', 0.07),
                color: activePageId === page.id ? G_START : alpha('#FFFFFF', 0.7),
                border: `1px solid ${activePageId === page.id ? alpha(G_START, 0.5) : 'transparent'}`,
                fontWeight: activePageId === page.id ? 700 : 400,
                '& .MuiChip-deleteIcon': {
                  color: alpha('#FFFFFF', 0.4),
                  '&:hover': { color: '#ff4444' },
                },
                flexShrink: 0,
              }}
            />
          ))}
          <Tooltip title="Add new page">
            <IconButton
              size="small"
              onClick={() => setAddPageDialogOpen(true)}
              sx={{ color: alpha('#FFFFFF', 0.5), '&:hover': { color: G_START }, ml: 0.5 }}
            >
              <Add fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {showCode ? (
          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3, bgcolor: '#0A0F1A' }}>
            <Paper
              sx={{
                bgcolor: '#1A1F2E',
                borderRadius: globalStyles.borderRadius,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  p: 2,
                  borderBottom: `1px solid ${alpha('#FFFFFF', 0.1)}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h6" sx={{ color: 'white' }}>
                  Generated HTML/CSS Code
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={copyCodeToClipboard}
                  sx={{ color: 'white', borderColor: alpha('#FFFFFF', 0.2) }}
                >
                  Copy Code
                </Button>
              </Box>
              <Box sx={{ p: 2, maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
                <pre
                  style={{
                    color: '#E0E0E0',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                  }}
                >
                  {generatedCode}
                </pre>
              </Box>
            </Paper>
          </Box>
        ) : (
          <Box
            sx={{
              flexGrow: 1,
              overflow: 'auto',
              p: 3,
              bgcolor: '#080C14',
              transform: `scale(${canvasScale})`,
              transformOrigin: 'top center',
              transition: 'transform 0.3s ease',
              position: 'relative',
              zIndex: 0,
            }}
          >
            {renderPreview()}
          </Box>
        )}
      </Box>

      {/* Right Sidebar */}
      <Drawer
        variant="permanent"
        anchor="right"
        sx={{
          width: selectedComponent || selectedTextElement || selectedImageElement ? 360 : 0,
          flexShrink: 0,
          transition: 'width 0.3s',
          zIndex: 1,
          '& .MuiDrawer-paper': {
            width: 360,
            boxSizing: 'border-box',
            position: 'relative',
            borderLeft: `1px solid ${alpha('#FFFFFF', 0.1)}`,
            bgcolor: '#0A0F1A',
            transition: 'transform 0.3s',
            transform:
              selectedComponent || selectedTextElement || selectedImageElement
                ? 'translateX(0)'
                : 'translateX(100%)',
            zIndex: 1,
          },
        }}
      >
        <Toolbar />
        {(selectedComponent || selectedTextElement || selectedImageElement) && (
          <Box sx={{ height: 4, background: GRAD }} />
        )}
        {(selectedComponent || selectedTextElement || selectedImageElement) && (
          <Box
            sx={{
              px: 2,
              py: 1.5,
              bgcolor: alpha(G_START, 0.07),
              borderBottom: `1px solid ${alpha('#FFFFFF', 0.08)}`,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <EditIcon sx={{ color: G_START, fontSize: 18 }} />
            <Typography variant="subtitle2" sx={{ color: G_START, fontWeight: 700, flex: 1 }}>
              {selectedComponent
                ? `Edit ${getComponentName(selectedComponent.type)}`
                : selectedTextElement
                  ? 'Edit Text Element'
                  : 'Edit Image'}
            </Typography>
            <Tooltip title="Deselect (Esc)">
              <IconButton
                size="small"
                onClick={() => {
                  setSelectedComponent(null);
                  setSelectedTextElement(null);
                  setSelectedImageElement(null);
                }}
                sx={{ color: alpha('#FFFFFF', 0.5), '&:hover': { color: '#ff4444' } }}
              >
                <Close fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        <Box sx={{ p: 2, overflow: 'auto', height: 'calc(100% - 64px)' }}>
          {selectedComponent && (
            <>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ color: 'white' }}>
                  {getComponentName(selectedComponent.type)} Properties
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setSelectedComponent(null)}
                  sx={{ color: 'white' }}
                >
                  <Close />
                </IconButton>
              </Box>
              <Divider sx={{ mb: 2, borderColor: alpha('#FFFFFF', 0.1) }} />
              <Typography variant="subtitle2" sx={{ color: alpha('#FFFFFF', 0.7), mb: 1 }}>
                Appearance
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Palette />}
                  onClick={(e) => handleColorPickerOpen(e, 'component', 'backgroundColor')}
                  sx={{ color: 'white', borderColor: alpha('#FFFFFF', 0.2), flex: 1 }}
                >
                  Background
                  <Box
                    sx={{
                      ml: 1,
                      width: 16,
                      height: 16,
                      borderRadius: '4px',
                      bgcolor: selectedComponent.styles?.backgroundColor || 'transparent',
                      border: `1px solid ${alpha('#FFFFFF', 0.3)}`,
                    }}
                  />
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<FormatColorFill />}
                  onClick={(e) => handleColorPickerOpen(e, 'component', 'color')}
                  sx={{ color: 'white', borderColor: alpha('#FFFFFF', 0.2), flex: 1 }}
                >
                  Text
                  <Box
                    sx={{
                      ml: 1,
                      width: 16,
                      height: 16,
                      borderRadius: '4px',
                      bgcolor: selectedComponent.styles?.color || globalStyles.textColor,
                      border: `1px solid ${alpha('#FFFFFF', 0.3)}`,
                    }}
                  />
                </Button>
              </Box>
              <Divider sx={{ mb: 2, borderColor: alpha('#FFFFFF', 0.1) }} />
              {selectedComponent.type === 'logo' && (
                <>
                  <TextField
                    fullWidth
                    label="Logo Text"
                    value={selectedComponent.content?.text || ''}
                    onChange={(e) =>
                      handleUpdateComponentContent(selectedComponent.id, 'text', e.target.value)
                    }
                    sx={{
                      mb: 2,
                      input: { color: 'white' },
                      label: { color: alpha('#FFFFFF', 0.7) },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Tagline"
                    value={selectedComponent.content?.tagline || ''}
                    onChange={(e) =>
                      handleUpdateComponentContent(selectedComponent.id, 'tagline', e.target.value)
                    }
                    sx={{
                      mb: 2,
                      input: { color: 'white' },
                      label: { color: alpha('#FFFFFF', 0.7) },
                    }}
                  />
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel sx={{ color: alpha('#FFFFFF', 0.7) }}>Logo Size</InputLabel>
                    <Select
                      value={selectedComponent.content?.size || 'medium'}
                      onChange={(e) =>
                        handleUpdateComponentContent(selectedComponent.id, 'size', e.target.value)
                      }
                      label="Logo Size"
                      sx={{
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha('#FFFFFF', 0.2),
                        },
                      }}
                    >
                      <MenuItem value="small">Small</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="large">Large</MenuItem>
                    </Select>
                  </FormControl>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: alpha('#FFFFFF', 0.7), mb: 1, mt: 2 }}
                  >
                    Logo Image
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<ImageIcon />}
                      onClick={() => setImageUploadDialogOpen(true)}
                      sx={{ color: 'white', borderColor: alpha('#FFFFFF', 0.2) }}
                    >
                      Select Image
                    </Button>
                    {selectedComponent.content?.image && (
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() =>
                          handleUpdateComponentContent(selectedComponent.id, 'image', null)
                        }
                        sx={{ color: '#ff4444', borderColor: '#ff4444' }}
                      >
                        Remove
                      </Button>
                    )}
                  </Box>
                </>
              )}
              {selectedComponent.type === 'footer' && (
                <>
                  <TextField
                    fullWidth
                    label="Company Name"
                    value={selectedComponent.content?.companyName || ''}
                    onChange={(e) =>
                      handleUpdateComponentContent(
                        selectedComponent.id,
                        'companyName',
                        e.target.value
                      )
                    }
                    sx={{
                      mb: 2,
                      input: { color: 'white' },
                      label: { color: alpha('#FFFFFF', 0.7) },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Tagline"
                    value={selectedComponent.content?.tagline || ''}
                    onChange={(e) =>
                      handleUpdateComponentContent(selectedComponent.id, 'tagline', e.target.value)
                    }
                    sx={{
                      mb: 2,
                      input: { color: 'white' },
                      label: { color: alpha('#FFFFFF', 0.7) },
                    }}
                  />
                  <Typography variant="subtitle2" sx={{ color: alpha('#FFFFFF', 0.7), mb: 1 }}>
                    Links
                  </Typography>
                  {selectedComponent.content?.links?.map((link, idx) => (
                    <Paper
                      key={idx}
                      sx={{
                        p: 2,
                        mb: 2,
                        bgcolor: alpha('#FFFFFF', 0.05),
                        borderRadius: globalStyles.borderRadius,
                      }}
                    >
                      <TextField
                        fullWidth
                        size="small"
                        label="Label"
                        value={link.label || ''}
                        onChange={(e) => {
                          const newLinks = [...selectedComponent.content.links];
                          newLinks[idx] = { ...newLinks[idx], label: e.target.value };
                          handleUpdateComponentContent(selectedComponent.id, 'links', newLinks);
                        }}
                        sx={{ mb: 1, input: { color: 'white' } }}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label="URL"
                        value={link.url || ''}
                        onChange={(e) => {
                          const newLinks = [...selectedComponent.content.links];
                          newLinks[idx] = { ...newLinks[idx], url: e.target.value };
                          handleUpdateComponentContent(selectedComponent.id, 'links', newLinks);
                        }}
                        sx={{ mb: 1, input: { color: 'white' } }}
                      />
                      <Button
                        size="small"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleDeleteComponentItem(selectedComponent.id, 'link', idx)}
                      >
                        Delete
                      </Button>
                    </Paper>
                  ))}
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => handleAddComponentItem(selectedComponent.id, 'link')}
                    sx={{ mt: 1, color: 'white', borderColor: alpha('#FFFFFF', 0.2) }}
                  >
                    Add Link
                  </Button>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: alpha('#FFFFFF', 0.7), mb: 1, mt: 2 }}
                  >
                    Social Links
                  </Typography>
                  {selectedComponent.content?.socialLinks?.map((social, idx) => (
                    <Paper
                      key={idx}
                      sx={{
                        p: 2,
                        mb: 2,
                        bgcolor: alpha('#FFFFFF', 0.05),
                        borderRadius: globalStyles.borderRadius,
                      }}
                    >
                      <TextField
                        fullWidth
                        size="small"
                        label="Platform"
                        value={social.platform || ''}
                        onChange={(e) => {
                          const newSocial = [...selectedComponent.content.socialLinks];
                          newSocial[idx] = { ...newSocial[idx], platform: e.target.value };
                          handleUpdateComponentContent(
                            selectedComponent.id,
                            'socialLinks',
                            newSocial
                          );
                        }}
                        sx={{ mb: 1, input: { color: 'white' } }}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label="URL"
                        value={social.url || ''}
                        onChange={(e) => {
                          const newSocial = [...selectedComponent.content.socialLinks];
                          newSocial[idx] = { ...newSocial[idx], url: e.target.value };
                          handleUpdateComponentContent(
                            selectedComponent.id,
                            'socialLinks',
                            newSocial
                          );
                        }}
                        sx={{ mb: 1, input: { color: 'white' } }}
                      />
                      <Button
                        size="small"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() =>
                          handleDeleteComponentItem(selectedComponent.id, 'social', idx)
                        }
                      >
                        Delete
                      </Button>
                    </Paper>
                  ))}
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => handleAddComponentItem(selectedComponent.id, 'social')}
                    sx={{ mt: 1, color: 'white', borderColor: alpha('#FFFFFF', 0.2) }}
                  >
                    Add Social Link
                  </Button>
                  <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                    <InputLabel sx={{ color: alpha('#FFFFFF', 0.7) }}>Columns</InputLabel>
                    <Select
                      value={selectedComponent.content?.columns || 4}
                      onChange={(e) =>
                        handleUpdateComponentContent(
                          selectedComponent.id,
                          'columns',
                          parseInt(e.target.value)
                        )
                      }
                      label="Columns"
                      sx={{
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha('#FFFFFF', 0.2),
                        },
                      }}
                    >
                      <MenuItem value={1}>1 Column</MenuItem>
                      <MenuItem value={2}>2 Columns</MenuItem>
                      <MenuItem value={3}>3 Columns</MenuItem>
                      <MenuItem value={4}>4 Columns</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={selectedComponent.content?.showNewsletter !== false}
                        onChange={(e) =>
                          handleUpdateComponentContent(
                            selectedComponent.id,
                            'showNewsletter',
                            e.target.checked
                          )
                        }
                        sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G_START } }}
                      />
                    }
                    label="Show Newsletter"
                    sx={{ color: 'white', mt: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Copyright Text"
                    value={selectedComponent.content?.copyright || ''}
                    onChange={(e) =>
                      handleUpdateComponentContent(
                        selectedComponent.id,
                        'copyright',
                        e.target.value
                      )
                    }
                    sx={{
                      mt: 2,
                      input: { color: 'white' },
                      label: { color: alpha('#FFFFFF', 0.7) },
                    }}
                  />
                </>
              )}
              {selectedComponent.type === 'hero' && (
                <>
                  <TextField
                    fullWidth
                    label="Title"
                    value={selectedComponent.content?.title || ''}
                    onChange={(e) =>
                      handleUpdateComponentContent(selectedComponent.id, 'title', e.target.value)
                    }
                    sx={{
                      mb: 2,
                      input: { color: 'white' },
                      label: { color: alpha('#FFFFFF', 0.7) },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Subtitle"
                    value={selectedComponent.content?.subtitle || ''}
                    onChange={(e) =>
                      handleUpdateComponentContent(selectedComponent.id, 'subtitle', e.target.value)
                    }
                    sx={{
                      mb: 2,
                      input: { color: 'white' },
                      label: { color: alpha('#FFFFFF', 0.7) },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Button Text"
                    value={selectedComponent.content?.buttonText || ''}
                    onChange={(e) =>
                      handleUpdateComponentContent(
                        selectedComponent.id,
                        'buttonText',
                        e.target.value
                      )
                    }
                    sx={{
                      mb: 2,
                      input: { color: 'white' },
                      label: { color: alpha('#FFFFFF', 0.7) },
                    }}
                  />
                  <Typography
                    variant="subtitle2"
                    sx={{ color: alpha('#FFFFFF', 0.7), mb: 1, mt: 2 }}
                  >
                    Hero Image
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<ImageIcon />}
                      onClick={() => setImageUploadDialogOpen(true)}
                      sx={{ color: 'white', borderColor: alpha('#FFFFFF', 0.2) }}
                    >
                      Select Image
                    </Button>
                    {selectedComponent.content?.image && (
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() =>
                          handleUpdateComponentContent(selectedComponent.id, 'image', null)
                        }
                        sx={{ color: '#ff4444', borderColor: '#ff4444' }}
                      >
                        Remove
                      </Button>
                    )}
                  </Box>
                </>
              )}
              {selectedComponent.type === 'features' && (
                <>
                  <TextField
                    fullWidth
                    label="Section Title"
                    value={selectedComponent.content?.title || ''}
                    onChange={(e) =>
                      handleUpdateComponentContent(selectedComponent.id, 'title', e.target.value)
                    }
                    sx={{
                      mb: 2,
                      input: { color: 'white' },
                      label: { color: alpha('#FFFFFF', 0.7) },
                    }}
                  />
                  <Typography variant="subtitle2" sx={{ color: alpha('#FFFFFF', 0.7), mb: 1 }}>
                    Features ({selectedComponent.content?.items?.length || 0})
                  </Typography>
                  {selectedComponent.content?.items?.map((item, idx) => (
                    <Paper
                      key={idx}
                      sx={{
                        p: 2,
                        mb: 2,
                        bgcolor: alpha('#FFFFFF', 0.05),
                        borderRadius: globalStyles.borderRadius,
                      }}
                    >
                      <TextField
                        fullWidth
                        size="small"
                        label={`Feature ${idx + 1} Title`}
                        value={item.title || ''}
                        onChange={(e) =>
                          handleUpdateComponentContent(
                            selectedComponent.id,
                            'title',
                            e.target.value,
                            idx
                          )
                        }
                        sx={{ mb: 1, input: { color: 'white' } }}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label={`Feature ${idx + 1} Description`}
                        value={item.description || ''}
                        onChange={(e) =>
                          handleUpdateComponentContent(
                            selectedComponent.id,
                            'description',
                            e.target.value,
                            idx
                          )
                        }
                        sx={{ mb: 1, input: { color: 'white' } }}
                      />
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<ImageIcon />}
                          onClick={() => setImageUploadDialogOpen(true)}
                          sx={{ color: 'white', borderColor: alpha('#FFFFFF', 0.2) }}
                        >
                          Add Image
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<Delete />}
                          onClick={() =>
                            handleDeleteComponentItem(selectedComponent.id, 'feature', idx)
                          }
                        >
                          Delete
                        </Button>
                      </Box>
                    </Paper>
                  ))}
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => handleAddComponentItem(selectedComponent.id, 'feature')}
                    sx={{ mt: 1, color: 'white', borderColor: alpha('#FFFFFF', 0.2) }}
                  >
                    Add Feature
                  </Button>
                </>
              )}
              {selectedComponent.type === 'gallery' && (
                <>
                  <TextField
                    fullWidth
                    label="Section Title"
                    value={selectedComponent.content?.title || ''}
                    onChange={(e) =>
                      handleUpdateComponentContent(selectedComponent.id, 'title', e.target.value)
                    }
                    sx={{
                      mb: 2,
                      input: { color: 'white' },
                      label: { color: alpha('#FFFFFF', 0.7) },
                    }}
                  />
                  <Typography variant="subtitle2" sx={{ color: alpha('#FFFFFF', 0.7), mb: 1 }}>
                    Gallery Items ({selectedComponent.content?.items?.length || 0})
                  </Typography>
                  {selectedComponent.content?.items?.map((item, idx) => (
                    <Paper
                      key={idx}
                      sx={{
                        p: 2,
                        mb: 2,
                        bgcolor: alpha('#FFFFFF', 0.05),
                        borderRadius: globalStyles.borderRadius,
                      }}
                    >
                      <TextField
                        fullWidth
                        size="small"
                        label={`Item ${idx + 1} Title`}
                        value={item.title || ''}
                        onChange={(e) =>
                          handleUpdateComponentContent(
                            selectedComponent.id,
                            'title',
                            e.target.value,
                            idx
                          )
                        }
                        sx={{ mb: 1, input: { color: 'white' } }}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label={`Item ${idx + 1} Description`}
                        value={item.description || ''}
                        onChange={(e) =>
                          handleUpdateComponentContent(
                            selectedComponent.id,
                            'description',
                            e.target.value,
                            idx
                          )
                        }
                        sx={{ mb: 1, input: { color: 'white' } }}
                      />
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<ImageIcon />}
                          onClick={() => setImageUploadDialogOpen(true)}
                          sx={{ color: 'white', borderColor: alpha('#FFFFFF', 0.2) }}
                        >
                          Add Image
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<Delete />}
                          onClick={() =>
                            handleDeleteComponentItem(selectedComponent.id, 'gallery', idx)
                          }
                        >
                          Delete
                        </Button>
                      </Box>
                    </Paper>
                  ))}
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => handleAddComponentItem(selectedComponent.id, 'gallery')}
                    sx={{ mt: 1, color: 'white', borderColor: alpha('#FFFFFF', 0.2) }}
                  >
                    Add Gallery Item
                  </Button>
                </>
              )}
              {selectedComponent.type === 'contact' && (
                <>
                  <TextField
                    fullWidth
                    label="Section Title"
                    value={selectedComponent.content?.title || ''}
                    onChange={(e) =>
                      handleUpdateComponentContent(selectedComponent.id, 'title', e.target.value)
                    }
                    sx={{
                      mb: 2,
                      input: { color: 'white' },
                      label: { color: alpha('#FFFFFF', 0.7) },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Address"
                    value={selectedComponent.content?.address || ''}
                    onChange={(e) =>
                      handleUpdateComponentContent(selectedComponent.id, 'address', e.target.value)
                    }
                    sx={{
                      mb: 2,
                      input: { color: 'white' },
                      label: { color: alpha('#FFFFFF', 0.7) },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    value={selectedComponent.content?.email || ''}
                    onChange={(e) =>
                      handleUpdateComponentContent(selectedComponent.id, 'email', e.target.value)
                    }
                    sx={{
                      mb: 2,
                      input: { color: 'white' },
                      label: { color: alpha('#FFFFFF', 0.7) },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Phone"
                    value={selectedComponent.content?.phone || ''}
                    onChange={(e) =>
                      handleUpdateComponentContent(selectedComponent.id, 'phone', e.target.value)
                    }
                    sx={{
                      mb: 2,
                      input: { color: 'white' },
                      label: { color: alpha('#FFFFFF', 0.7) },
                    }}
                  />
                </>
              )}
              {selectedComponent.type === 'pricing' && (
                <>
                  <TextField
                    fullWidth
                    label="Section Title"
                    value={selectedComponent.content?.title || ''}
                    onChange={(e) =>
                      handleUpdateComponentContent(selectedComponent.id, 'title', e.target.value)
                    }
                    sx={{
                      mb: 2,
                      input: { color: 'white' },
                      label: { color: alpha('#FFFFFF', 0.7) },
                    }}
                  />
                  <Typography variant="subtitle2" sx={{ color: alpha('#FFFFFF', 0.7), mb: 1 }}>
                    Pricing Plans ({selectedComponent.content?.plans?.length || 0})
                  </Typography>
                  {selectedComponent.content?.plans?.map((plan, idx) => (
                    <Paper
                      key={idx}
                      sx={{
                        p: 2,
                        mb: 2,
                        bgcolor: alpha('#FFFFFF', 0.05),
                        borderRadius: globalStyles.borderRadius,
                      }}
                    >
                      <TextField
                        fullWidth
                        size="small"
                        label={`Plan ${idx + 1} Name`}
                        value={plan.name || ''}
                        onChange={(e) =>
                          handleUpdateComponentContent(
                            selectedComponent.id,
                            'name',
                            e.target.value,
                            idx
                          )
                        }
                        sx={{ mb: 1, input: { color: 'white' } }}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label={`Plan ${idx + 1} Price`}
                        value={plan.price || ''}
                        onChange={(e) =>
                          handleUpdateComponentContent(
                            selectedComponent.id,
                            'price',
                            e.target.value,
                            idx
                          )
                        }
                        sx={{ mb: 1, input: { color: 'white' } }}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label={`Plan ${idx + 1} Features (comma separated)`}
                        value={plan.features?.join(', ') || ''}
                        onChange={(e) =>
                          handleUpdateComponentContent(
                            selectedComponent.id,
                            'features',
                            e.target.value.split(',').map((f) => f.trim()),
                            idx
                          )
                        }
                        sx={{ mb: 1, input: { color: 'white' } }}
                      />
                      <Button
                        size="small"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleDeleteComponentItem(selectedComponent.id, 'plan', idx)}
                      >
                        Delete Plan
                      </Button>
                    </Paper>
                  ))}
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => handleAddComponentItem(selectedComponent.id, 'plan')}
                    sx={{ mt: 1, color: 'white', borderColor: alpha('#FFFFFF', 0.2) }}
                  >
                    Add Pricing Plan
                  </Button>
                </>
              )}
              <Button
                fullWidth
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={() => handleDeleteComponent(selectedComponent.id)}
                sx={{ mt: 2, color: '#ff4444', borderColor: '#ff4444' }}
              >
                Delete Component
              </Button>
            </>
          )}

          {selectedTextElement && !selectedComponent && (
            <>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ color: 'white' }}>
                  Text Properties
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setSelectedTextElement(null)}
                  sx={{ color: 'white' }}
                >
                  <Close />
                </IconButton>
              </Box>
              <Divider sx={{ mb: 2, borderColor: alpha('#FFFFFF', 0.1) }} />
              <TextField
                fullWidth
                label="Text Content"
                multiline
                rows={3}
                value={selectedTextElement.content || ''}
                onChange={(e) =>
                  handleUpdateTextElement(selectedTextElement.id, { content: e.target.value })
                }
                sx={{ mb: 2, input: { color: 'white' }, label: { color: alpha('#FFFFFF', 0.7) } }}
              />
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel sx={{ color: alpha('#FFFFFF', 0.7) }}>Tag Type</InputLabel>
                <Select
                  value={selectedTextElement.tag || 'p'}
                  onChange={(e) =>
                    handleUpdateTextElement(selectedTextElement.id, { tag: e.target.value })
                  }
                  label="Tag Type"
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha('#FFFFFF', 0.2) },
                  }}
                >
                  <MenuItem value="h1">Heading 1</MenuItem>
                  <MenuItem value="h2">Heading 2</MenuItem>
                  <MenuItem value="h3">Heading 3</MenuItem>
                  <MenuItem value="h4">Heading 4</MenuItem>
                  <MenuItem value="h5">Heading 5</MenuItem>
                  <MenuItem value="h6">Heading 6</MenuItem>
                  <MenuItem value="p">Paragraph</MenuItem>
                  <MenuItem value="span">Span</MenuItem>
                  <MenuItem value="div">Div</MenuItem>
                  <MenuItem value="a">Link</MenuItem>
                  <MenuItem value="nav">Navigation</MenuItem>
                </Select>
              </FormControl>
              {selectedTextElement.tag === 'a' && (
                <TextField
                  fullWidth
                  label="Link URL"
                  value={selectedTextElement.href || ''}
                  onChange={(e) =>
                    handleUpdateTextElement(selectedTextElement.id, { href: e.target.value })
                  }
                  sx={{ mb: 2, input: { color: 'white' }, label: { color: alpha('#FFFFFF', 0.7) } }}
                />
              )}
              {selectedTextElement.isNav && (
                <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.5), mb: 2 }}>
                  Navigation items separated by | (pipe) character.
                </Typography>
              )}
              <Typography variant="subtitle2" sx={{ color: alpha('#FFFFFF', 0.7), mb: 1 }}>
                Text Styling
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Tooltip title="Bold">
                  <IconButton
                    onClick={() =>
                      handleTextStyleChange(
                        selectedTextElement.id,
                        'fontWeight',
                        selectedTextElement.styles?.fontWeight === 'bold' ? 'normal' : 'bold'
                      )
                    }
                    sx={{
                      color: selectedTextElement.styles?.fontWeight === 'bold' ? G_START : 'white',
                      bgcolor: alpha('#FFFFFF', 0.05),
                    }}
                  >
                    <FormatBold />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Italic">
                  <IconButton
                    onClick={() =>
                      handleTextStyleChange(
                        selectedTextElement.id,
                        'fontStyle',
                        selectedTextElement.styles?.fontStyle === 'italic' ? 'normal' : 'italic'
                      )
                    }
                    sx={{
                      color: selectedTextElement.styles?.fontStyle === 'italic' ? G_START : 'white',
                      bgcolor: alpha('#FFFFFF', 0.05),
                    }}
                  >
                    <FormatItalic />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Underline">
                  <IconButton
                    onClick={() =>
                      handleTextStyleChange(
                        selectedTextElement.id,
                        'textDecoration',
                        selectedTextElement.styles?.textDecoration === 'underline'
                          ? 'none'
                          : 'underline'
                      )
                    }
                    sx={{
                      color:
                        selectedTextElement.styles?.textDecoration === 'underline'
                          ? G_START
                          : 'white',
                      bgcolor: alpha('#FFFFFF', 0.05),
                    }}
                  >
                    <FormatUnderlined />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Align Left">
                  <IconButton
                    onClick={() =>
                      handleTextStyleChange(selectedTextElement.id, 'textAlign', 'left')
                    }
                    sx={{
                      color: selectedTextElement.styles?.textAlign === 'left' ? G_START : 'white',
                    }}
                  >
                    <FormatAlignLeft />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Align Center">
                  <IconButton
                    onClick={() =>
                      handleTextStyleChange(selectedTextElement.id, 'textAlign', 'center')
                    }
                    sx={{
                      color: selectedTextElement.styles?.textAlign === 'center' ? G_START : 'white',
                    }}
                  >
                    <FormatAlignCenter />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Align Right">
                  <IconButton
                    onClick={() =>
                      handleTextStyleChange(selectedTextElement.id, 'textAlign', 'right')
                    }
                    sx={{
                      color: selectedTextElement.styles?.textAlign === 'right' ? G_START : 'white',
                    }}
                  >
                    <FormatAlignRight />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.7) }}>
                    Font Size
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        const currentSize = parseInt(selectedTextElement.styles?.fontSize) || 16;
                        handleTextStyleChange(
                          selectedTextElement.id,
                          'fontSize',
                          `${Math.max(8, currentSize - 2)}px`
                        );
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                    <Typography>{selectedTextElement.styles?.fontSize || '16px'}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => {
                        const currentSize = parseInt(selectedTextElement.styles?.fontSize) || 16;
                        handleTextStyleChange(
                          selectedTextElement.id,
                          'fontSize',
                          `${Math.min(72, currentSize + 2)}px`
                        );
                      }}
                    >
                      <Add fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.7) }}>
                    Line Height
                  </Typography>
                  <Slider
                    value={parseFloat(selectedTextElement.styles?.lineHeight) || 1.5}
                    onChange={(e, val) =>
                      handleTextStyleChange(selectedTextElement.id, 'lineHeight', val)
                    }
                    min={1}
                    max={2.5}
                    step={0.1}
                    size="small"
                    sx={{ color: G_START }}
                  />
                </Box>
              </Box>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Palette />}
                onClick={(e) => handleColorPickerOpen(e, 'text', 'color')}
                sx={{ mb: 2, color: 'white', borderColor: alpha('#FFFFFF', 0.2) }}
              >
                Text Color
                <Box
                  sx={{
                    ml: 1,
                    width: 24,
                    height: 24,
                    bgcolor: selectedTextElement.styles?.color || '#FFFFFF',
                    borderRadius: '4px',
                  }}
                />
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FormatColorFill />}
                onClick={(e) => handleColorPickerOpen(e, 'text', 'backgroundColor')}
                sx={{ mb: 2, color: 'white', borderColor: alpha('#FFFFFF', 0.2) }}
              >
                Background Color
                <Box
                  sx={{
                    ml: 1,
                    width: 24,
                    height: 24,
                    bgcolor: selectedTextElement.styles?.backgroundColor || 'transparent',
                    borderRadius: '4px',
                  }}
                />
              </Button>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedTextElement.styles?.textTransform === 'uppercase'}
                    onChange={(e) =>
                      handleTextStyleChange(
                        selectedTextElement.id,
                        'textTransform',
                        e.target.checked ? 'uppercase' : 'none'
                      )
                    }
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G_START } }}
                  />
                }
                label="Uppercase"
                sx={{ color: 'white', mb: 2 }}
              />
              <Button
                fullWidth
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={() => handleDeleteTextElement(selectedTextElement.id)}
                sx={{ mt: 2, color: '#ff4444', borderColor: '#ff4444' }}
              >
                Delete Text Element
              </Button>
            </>
          )}

          {selectedImageElement && !selectedComponent && (
            <>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ color: 'white' }}>
                  Image Properties
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setSelectedImageElement(null)}
                  sx={{ color: 'white' }}
                >
                  <Close />
                </IconButton>
              </Box>
              <Divider sx={{ mb: 2, borderColor: alpha('#FFFFFF', 0.1) }} />
              <Box
                component="img"
                src={selectedImageElement.imageUrl}
                alt={selectedImageElement.alt}
                sx={{ width: '100%', borderRadius: globalStyles.borderRadius, mb: 2 }}
              />
              <input
                type="file"
                ref={replaceImageInputRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleReplaceImage(selectedImageElement.id, file);
                  e.target.value = '';
                }}
              />
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Upload />}
                onClick={() => replaceImageInputRef.current?.click()}
                sx={{ mb: 2, color: 'white', borderColor: alpha(G_START, 0.5) }}
              >
                Replace Image
              </Button>
              <TextField
                fullWidth
                label="Alt Text"
                value={selectedImageElement.alt || ''}
                onChange={(e) =>
                  handleUpdateImageElement(selectedImageElement.id, { alt: e.target.value })
                }
                sx={{ mb: 2, input: { color: 'white' }, label: { color: alpha('#FFFFFF', 0.7) } }}
              />
              <Typography variant="subtitle2" sx={{ color: alpha('#FFFFFF', 0.7), mb: 1 }}>
                Image Size
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  label="Width"
                  type="number"
                  value={parseInt(selectedImageElement.width) || ''}
                  onChange={(e) => {
                    const newWidth = e.target.value;
                    handleResizeImage(
                      selectedImageElement.id,
                      newWidth,
                      selectedImageElement.height
                    );
                  }}
                  size="small"
                  sx={{ flex: 1, input: { color: 'white' } }}
                />
                <TextField
                  label="Height"
                  type="number"
                  value={parseInt(selectedImageElement.height) || ''}
                  onChange={(e) => {
                    const newHeight = e.target.value;
                    handleResizeImage(
                      selectedImageElement.id,
                      selectedImageElement.width,
                      newHeight
                    );
                  }}
                  size="small"
                  sx={{ flex: 1, input: { color: 'white' } }}
                />
              </Box>
              <Typography variant="subtitle2" sx={{ color: alpha('#FFFFFF', 0.7), mb: 1 }}>
                Image Style Presets
              </Typography>
              <Grid container spacing={1} sx={{ mb: 2 }}>
                {imageStyles.slice(0, 4).map((style) => (
                  <Grid item xs={6} key={style.id}>
                    <Button
                      fullWidth
                      size="small"
                      variant="outlined"
                      onClick={() => handleApplyImageStyle(selectedImageElement.id, style)}
                      sx={{ color: 'white', borderColor: alpha('#FFFFFF', 0.2) }}
                    >
                      {style.name}
                    </Button>
                  </Grid>
                ))}
              </Grid>
              <Typography variant="subtitle2" sx={{ color: alpha('#FFFFFF', 0.7), mb: 1 }}>
                Transform
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Tooltip title="Rotate Left">
                  <IconButton
                    onClick={() => handleRotateImage(selectedImageElement.id, -90)}
                    sx={{ color: 'white', bgcolor: alpha('#FFFFFF', 0.05) }}
                  >
                    <RotateLeft />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Rotate Right">
                  <IconButton
                    onClick={() => handleRotateImage(selectedImageElement.id, 90)}
                    sx={{ color: 'white', bgcolor: alpha('#FFFFFF', 0.05) }}
                  >
                    <RotateRight />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Flip Horizontal">
                  <IconButton
                    onClick={() => handleFlipImage(selectedImageElement.id, 'horizontal')}
                    sx={{ color: 'white', bgcolor: alpha('#FFFFFF', 0.05) }}
                  >
                    <Flip />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Flip Vertical">
                  <IconButton
                    onClick={() => handleFlipImage(selectedImageElement.id, 'vertical')}
                    sx={{ color: 'white', bgcolor: alpha('#FFFFFF', 0.05) }}
                  >
                    <Flip sx={{ transform: 'rotate(90deg)' }} />
                  </IconButton>
                </Tooltip>
              </Box>
              <Typography variant="subtitle2" sx={{ color: alpha('#FFFFFF', 0.7), mb: 1 }}>
                Filters
              </Typography>
              {['brightness', 'contrast', 'saturate', 'blur', 'grayscale'].map((filter) => (
                <Box key={filter} sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </Typography>
                  <Slider
                    value={
                      selectedImageElement.filters?.[filter] ||
                      (filter === 'brightness'
                        ? 100
                        : filter === 'contrast'
                          ? 100
                          : filter === 'saturate'
                            ? 100
                            : 0)
                    }
                    onChange={(e, val) =>
                      handleApplyImageFilter(selectedImageElement.id, filter, val)
                    }
                    min={filter === 'blur' ? 0 : 0}
                    max={filter === 'blur' ? 20 : filter === 'grayscale' ? 100 : 200}
                    size="small"
                    sx={{ color: G_START }}
                  />
                </Box>
              ))}
              <Button
                fullWidth
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={() => handleDeleteImageElement(selectedImageElement.id)}
                sx={{ mt: 2, color: '#ff4444', borderColor: '#ff4444' }}
              >
                Remove Image from Canvas
              </Button>
            </>
          )}
        </Box>
      </Drawer>

      {/* Dialogs */}
      <Dialog
        open={imageUploadDialogOpen}
        onClose={() => setImageUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#0A0F1A',
            borderRadius: '16px',
            border: `1px solid ${alpha(G_START, 0.3)}`,
          },
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>Select an Image</DialogTitle>
        <DialogContent>
          {uploadedImages.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <PhotoLibrary sx={{ fontSize: 64, color: alpha('#FFFFFF', 0.3), mb: 2 }} />
              <Typography variant="body1" sx={{ color: 'white', mb: 1 }}>
                No images uploaded yet
              </Typography>
              <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.5), mb: 2 }}>
                Please upload images in the Images tab first
              </Typography>
              <Button
                variant="contained"
                onClick={() => {
                  setImageUploadDialogOpen(false);
                  setActiveTab(2);
                }}
                sx={{ background: GRAD }}
              >
                Go to Images Tab
              </Button>
            </Box>
          ) : (
            <ImageList cols={2} gap={8}>
              {uploadedImages.map((image) => (
                <ImageListItem
                  key={image.id}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    if (selectedComponent) handleAddImageToComponent(image, selectedComponent.id);
                    setImageUploadDialogOpen(false);
                  }}
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    style={{
                      borderRadius: globalStyles.borderRadius,
                      width: '100%',
                      height: 120,
                      objectFit: 'cover',
                    }}
                  />
                  <ImageListItemBar
                    title={image.name.substring(0, 20)}
                    sx={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageUploadDialogOpen(false)} sx={{ color: 'white' }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Popover
        open={Boolean(colorPickerAnchor)}
        anchorEl={colorPickerAnchor}
        onClose={handleColorPickerClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ zIndex: 1300 }}
      >
        <Box sx={{ p: 2, bgcolor: '#1A1F2E' }}>
          <ChromePicker
            color={
              selectedColorTarget?.target === 'global'
                ? globalStyles[selectedColorTarget.property] || '#FFFFFF'
                : selectedColorTarget?.target === 'text'
                  ? selectedTextElement?.styles?.[selectedColorTarget.property] || '#FFFFFF'
                  : selectedColorTarget?.target === 'component'
                    ? selectedComponent?.styles?.[selectedColorTarget.property] || '#FFFFFF'
                    : '#FFFFFF'
            }
            onChange={handleColorChange}
          />
        </Box>
      </Popover>

      <Dialog
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#0A0F1A',
            backgroundImage: 'none',
            borderRadius: '20px',
            border: `1px solid ${alpha(G_START, 0.25)}`,
            color: 'white',
            overflow: 'hidden',
          },
        }}
      >
        <Box sx={{ height: 4, background: GRAD }} />
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pt: 3 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: GRAD,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Save sx={{ fontSize: 18, color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, lineHeight: 1.2 }}>
              Save Project
            </Typography>
            <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.45) }}>
              Enter a name and save your design
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <TextField
            autoFocus
            fullWidth
            label="Project Name"
            placeholder="e.g. My Portfolio Site"
            value={projectNameInput}
            onChange={(e) => setProjectNameInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveConfirm()}
            sx={{
              mt: 1,
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: alpha('#FFFFFF', 0.6) },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha('#FFFFFF', 0.2) },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: alpha(G_START, 0.6),
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: G_START,
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
          <Button
            onClick={() => setSaveModalOpen(false)}
            sx={{ color: alpha('#FFFFFF', 0.6), '&:hover': { color: 'white' } }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveConfirm}
            variant="contained"
            disabled={saving || !projectNameInput.trim()}
            startIcon={saving ? <CircularProgress size={18} sx={{ color: 'white' }} /> : <Save />}
            sx={{
              background: GRAD,
              borderRadius: '10px',
              fontWeight: 700,
              px: 3,
              '&:hover': { opacity: 0.9 },
              '&:disabled': { opacity: 0.5 },
            }}
          >
            {saving ? 'Saving…' : 'Save Project'}
          </Button>
        </DialogActions>
      </Dialog>

      {renderPublishModal()}

      <Dialog
        open={publishDialogOpen}
        onClose={() => setPublishDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: '#1A1F2E',
            backgroundImage: 'none',
            borderRadius: '16px',
            color: 'white',
            zIndex: 1300,
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Check sx={{ color: G_END }} />
          Website Published Successfully!
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.7)' }}>
            Your website has been saved to the database and is now live.
          </Typography>
          <Paper
            sx={{ p: 2, bgcolor: alpha(G_START, 0.1), borderRadius: '8px', wordBreak: 'break-all' }}
          >
            <Typography variant="body2" sx={{ color: G_START }}>
              {publishUrl}
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPublishDialogOpen(false)} sx={{ color: 'white' }}>
            Close
          </Button>
          <Button
            onClick={copyToClipboard}
            variant="contained"
            startIcon={<LinkIcon />}
            sx={{ background: GRAD }}
          >
            Copy Link
          </Button>
          <Button
            onClick={() => window.open(publishUrl, '_blank')}
            variant="outlined"
            startIcon={<Preview />}
            sx={{ color: 'white', borderColor: alpha('#FFFFFF', 0.2) }}
          >
            View Live
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={addPageDialogOpen}
        onClose={() => setAddPageDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#0A0F1A',
            backgroundImage: 'none',
            borderRadius: '16px',
            border: `1px solid ${alpha(G_START, 0.25)}`,
            color: 'white',
          },
        }}
      >
        <Box sx={{ height: 3, background: GRAD }} />
        <DialogTitle sx={{ color: 'white', fontWeight: 700 }}>Add New Page</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Page Name"
            placeholder="e.g. About, Services, Contact"
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddPage()}
            sx={{
              mt: 1,
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: alpha('#FFFFFF', 0.6) },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha('#FFFFFF', 0.2) },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: G_START,
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setAddPageDialogOpen(false)} sx={{ color: alpha('#FFFFFF', 0.6) }}>
            Cancel
          </Button>
          <Button
            onClick={handleAddPage}
            variant="contained"
            sx={{ background: GRAD, borderRadius: '10px', fontWeight: 700, px: 3 }}
          >
            Add Page
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showProjectsGallery}
        onClose={() => setShowProjectsGallery(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#0A0F1A',
            backgroundImage: 'none',
            borderRadius: '20px',
            border: `1px solid ${alpha(G_START, 0.2)}`,
            color: 'white',
            overflow: 'hidden',
            maxHeight: '92vh',
          },
        }}
      >
        <Box sx={{ height: 4, background: GRAD }} />
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pt: 2,
            pb: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                background: GRAD,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FolderOpen sx={{ fontSize: 18, color: 'white' }} />
            </Box>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
              My Projects
            </Typography>
          </Box>
          <IconButton
            onClick={() => setShowProjectsGallery(false)}
            sx={{ color: alpha('#FFFFFF', 0.6) }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, overflowY: 'auto' }}>
          <ProjectsGallery
            showHeader={false}
            onOpenProject={(project) => {
              loadProjectFromSavedPages(project);
              setShowProjectsGallery(false);
            }}
            onPreviewProject={(project) => {
              const projectId = project.id;
              const projectData = { ...project, id: projectId };
              saveProjectToLocalStorage(projectData);
              navigate(`/preview?id=${projectId}&t=${Date.now()}`);
            }}
            onPublishProject={(project) => {
              loadProjectFromSavedPages(project);
              setShowProjectsGallery(false);
              setTimeout(() => setPublishModalOpen(true), 300);
            }}
            onDeleteProject={(projectId) => {
              handleDeleteProject(projectId);
            }}
            onDuplicateProject={(project) => {
              const dupeId = Date.now().toString();
              const dupeData = {
                ...project,
                id: dupeId,
                name: `${project.name} (Copy)`,
                status: 'draft',
                lastEdited: new Date().toISOString(),
              };
              saveProjectToLocalStorage(dupeData);
              showSnackbar(`"${dupeData.name}" duplicated`, 'success');
              if (token) loadProjectsFromDatabase();
            }}
          />
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ width: '100%', bgcolor: '#1A1F2E', color: 'white' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DesignStudio;
