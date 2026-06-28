import React, { useState, useEffect, useRef } from 'react';
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
  Layout,
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
  TextIncrease,
  TextDecrease,
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
  CheckCircleRounded,
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
} from '@mui/icons-material';
import { ImageOutlined } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';
import { ChromePicker } from 'react-color';
import axios from 'axios';

// Import auth context - adjust path as needed
// import { useAuth } from '../contexts/AuthContext';

const G_START = '#4F6EF7';
const G_MID = '#2DBCB6';
const G_END = '#3ED67C';
const GRAD = `linear-gradient(135deg, ${G_START} 0%, ${G_MID} 50%, ${G_END} 100%)`;

// Predefined text styles for drag and drop
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
    defaultText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
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
];

// Predefined image styles/sizes
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

// Color Themes for the entire design studio
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
      cardBg: 'rgba(157, 78, 221, 0.1)',
      borderGlow: 'rgba(157, 78, 221, 0.3)',
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
      cardBg: 'rgba(44, 125, 160, 0.1)',
      borderGlow: 'rgba(44, 125, 160, 0.3)',
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
      cardBg: 'rgba(45, 106, 79, 0.1)',
      borderGlow: 'rgba(45, 106, 79, 0.3)',
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
      cardBg: 'rgba(232, 93, 4, 0.1)',
      borderGlow: 'rgba(232, 93, 4, 0.3)',
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
      cardBg: 'rgba(216, 27, 96, 0.1)',
      borderGlow: 'rgba(216, 27, 96, 0.3)',
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
      cardBg: 'rgba(0, 180, 216, 0.1)',
      borderGlow: 'rgba(0, 180, 216, 0.3)',
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
      cardBg: 'rgba(255, 215, 0, 0.1)',
      borderGlow: 'rgba(255, 215, 0, 0.3)',
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
      cardBg: 'rgba(185, 128, 234, 0.1)',
      borderGlow: 'rgba(185, 128, 234, 0.3)',
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
      cardBg: 'rgba(220, 20, 60, 0.1)',
      borderGlow: 'rgba(220, 20, 60, 0.3)',
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
      cardBg: 'rgba(0, 255, 157, 0.05)',
      borderGlow: 'rgba(0, 255, 157, 0.3)',
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
      cardBg: 'rgba(166, 124, 82, 0.1)',
      borderGlow: 'rgba(166, 124, 82, 0.3)',
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
      cardBg: 'rgba(255, 183, 197, 0.1)',
      borderGlow: 'rgba(255, 183, 197, 0.3)',
    },
  },
  {
    id: 'midnight-sapphire',
    name: 'Midnight Sapphire',
    description: 'Deep blue gemstone theme',
    styles: {
      backgroundColor: '#0A0F1A',
      primaryColor: '#1565C0',
      secondaryColor: '#1E88E5',
      accentColor: '#42A5F5',
      textColor: '#E3F2FD',
      headingColor: '#FFFFFF',
      buttonStyle: 'rounded',
      cardBg: 'rgba(21, 101, 192, 0.1)',
      borderGlow: 'rgba(21, 101, 192, 0.3)',
    },
  },
  {
    id: 'emerald-city',
    name: 'Emerald City',
    description: 'Rich emerald green theme',
    styles: {
      backgroundColor: '#0A1A0F',
      primaryColor: '#00A86B',
      secondaryColor: '#00C853',
      accentColor: '#69F0AE',
      textColor: '#E8F5E9',
      headingColor: '#FFFFFF',
      buttonStyle: 'rounded',
      cardBg: 'rgba(0, 168, 107, 0.1)',
      borderGlow: 'rgba(0, 168, 107, 0.3)',
    },
  },
  {
    id: 'twilight-purple',
    name: 'Twilight Purple',
    description: 'Mysterious twilight purple theme',
    styles: {
      backgroundColor: '#0E0A1A',
      primaryColor: '#6A1B9A',
      secondaryColor: '#8E24AA',
      accentColor: '#AB47BC',
      textColor: '#F3E5F5',
      headingColor: '#FFFFFF',
      buttonStyle: 'rounded',
      cardBg: 'rgba(106, 27, 154, 0.1)',
      borderGlow: 'rgba(106, 27, 154, 0.3)',
    },
  },
  {
    id: 'candy-cane',
    name: 'Candy Cane',
    description: 'Festive red and white theme',
    styles: {
      backgroundColor: '#1A0A0A',
      primaryColor: '#FF3B30',
      secondaryColor: '#FF5E3A',
      accentColor: '#FF7F50',
      textColor: '#FFFFFF',
      headingColor: '#FFFFFF',
      buttonStyle: 'rounded',
      cardBg: 'rgba(255, 59, 48, 0.1)',
      borderGlow: 'rgba(255, 59, 48, 0.3)',
    },
  },
  {
    id: 'electric-blue',
    name: 'Electric Blue',
    description: 'Vibrant electric blue theme',
    styles: {
      backgroundColor: '#0A0A1A',
      primaryColor: '#0055FF',
      secondaryColor: '#0088FF',
      accentColor: '#00AAFF',
      textColor: '#E0E0FF',
      headingColor: '#FFFFFF',
      buttonStyle: 'rounded',
      cardBg: 'rgba(0, 85, 255, 0.1)',
      borderGlow: 'rgba(0, 85, 255, 0.3)',
    },
  },
  {
    id: 'mint-fresh',
    name: 'Mint Fresh',
    description: 'Cool refreshing mint theme',
    styles: {
      backgroundColor: '#0A1A14',
      primaryColor: '#1DB954',
      secondaryColor: '#2EBD6B',
      accentColor: '#4CDA8C',
      textColor: '#E8F5E9',
      headingColor: '#FFFFFF',
      buttonStyle: 'rounded',
      cardBg: 'rgba(29, 185, 84, 0.1)',
      borderGlow: 'rgba(29, 185, 84, 0.3)',
    },
  },
  {
    id: 'platinum',
    name: 'Platinum',
    description: 'Clean modern platinum theme',
    styles: {
      backgroundColor: '#1A1A1A',
      primaryColor: '#B0BEC5',
      secondaryColor: '#CFD8DC',
      accentColor: '#ECEFF1',
      textColor: '#F5F5F5',
      headingColor: '#FFFFFF',
      buttonStyle: 'rounded',
      cardBg: 'rgba(176, 190, 197, 0.1)',
      borderGlow: 'rgba(176, 190, 197, 0.3)',
    },
  },
  {
    id: 'sunflower',
    name: 'Sunflower',
    description: 'Bright cheerful yellow theme',
    styles: {
      backgroundColor: '#1A1A0A',
      primaryColor: '#FFD700',
      secondaryColor: '#FFED4A',
      accentColor: '#FFF59D',
      textColor: '#FFF8E1',
      headingColor: '#FFFFFF',
      buttonStyle: 'rounded',
      cardBg: 'rgba(255, 215, 0, 0.1)',
      borderGlow: 'rgba(255, 215, 0, 0.3)',
    },
  },
  {
    id: 'berry-blast',
    name: 'Berry Blast',
    description: 'Bold berry colors theme',
    styles: {
      backgroundColor: '#1A0A1A',
      primaryColor: '#C2185B',
      secondaryColor: '#D81B60',
      accentColor: '#E91E63',
      textColor: '#FCE4EC',
      headingColor: '#FFFFFF',
      buttonStyle: 'rounded',
      cardBg: 'rgba(194, 24, 91, 0.1)',
      borderGlow: 'rgba(194, 24, 91, 0.3)',
    },
  },
];

// Function to apply a theme
const applyColorTheme = (theme, setGlobalStyles, showSnackbar) => {
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

  // Save to localStorage
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

  // Also save the current theme ID
  localStorage.setItem('currentColorTheme', theme.id);

  showSnackbar(`${theme.name} theme applied!`, 'success');
};

// Additional color palettes
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

// ---- Integration Panel Data (merged from IntegrationManager.js and Integrations.js) ----
const integrationTypes = [
  {
    type: 'forms',
    label: 'Form Builder',
    icon: DescriptionIcon,
    providers: ['formspree', 'typeform', 'google_forms'],
    description: 'Collect user submissions and leads',
  },
  {
    type: 'payment',
    label: 'Payment Gateway',
    icon: Payment,
    providers: ['stripe', 'paypal', 'square'],
    description: 'Accept payments and manage subscriptions',
  },
  {
    type: 'email',
    label: 'Email Marketing',
    icon: EmailIcon,
    providers: ['mailchimp', 'sendgrid', 'convertkit'],
    description: 'Email marketing and newsletters',
  },
  {
    type: 'calendar',
    label: 'Calendar/Scheduling',
    icon: CalendarToday,
    providers: ['calendly', 'acuity', 'bookings'],
    description: 'Schedule appointments and meetings',
  },
  {
    type: 'ads',
    label: 'Ad Platforms',
    icon: Campaign,
    providers: ['google_ads', 'meta_ads', 'linkedin_ads'],
    description: 'Track conversions and retargeting',
  },
];

const prebuiltIntegrationsList = [
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

// ---- Integration Panel Component (merged) ----
const IntegrationsPanel = ({ showSnackbar, projectId }) => {
  const [integrations, setIntegrations] = useState([]);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [configDialog, setConfigDialog] = useState(false);
  const [configData, setConfigData] = useState({
    type: '',
    provider: '',
    api_key: '',
    settings: {},
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [prebuiltIntegrations, setPrebuiltIntegrations] = useState(prebuiltIntegrationsList);

  const handleConfigure = async () => {
    setIntegrations([
      ...integrations,
      { ...configData, integration_code: '<!-- Integration code would appear here -->' },
    ]);
    setConfigDialog(false);
    setConfigData({ type: '', provider: '', api_key: '', settings: {} });
    if (showSnackbar) showSnackbar('Integration added successfully!', 'success');
  };

  const handleRemoveIntegration = (index) => {
    setIntegrations(integrations.filter((_, i) => i !== index));
    if (showSnackbar) showSnackbar('Integration removed', 'info');
  };

  const handleTogglePrebuilt = (id) => {
    setPrebuiltIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id ? { ...integration, connected: !integration.connected } : integration
      )
    );
    const integration = prebuiltIntegrations.find((i) => i.id === id);
    const newStatus = !integration.connected;
    if (showSnackbar) {
      showSnackbar(
        `${integration.name} ${newStatus ? 'connected' : 'disconnected'} successfully!`,
        newStatus ? 'success' : 'info'
      );
    }
  };

  const filteredPrebuilt = prebuiltIntegrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const connectedCount = prebuiltIntegrations.filter((i) => i.connected).length;
  const totalCount = prebuiltIntegrations.length;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Third-Party Integrations
      </Typography>
      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>
        Connect your website with popular services for forms, payments, email marketing, and more
      </Typography>

      <Typography variant="subtitle1" sx={{ color: 'white', mb: 1.5 }}>
        Quick Connect
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {integrationTypes.map((integration) => {
          const Icon = integration.icon;
          return (
            <Grid item xs={6} key={integration.type}>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
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
                  <Icon sx={{ fontSize: 28, color: G_START, mb: 0.5 }} />
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    {integration.label}
                  </Typography>
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

      <Box sx={{ maxHeight: 400, overflowY: 'auto', pr: 1 }}>
        {filteredPrebuilt.map((integration) => (
          <Card
            key={integration.id}
            sx={{
              mb: 1.5,
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${alpha(integration.color, 0.2)}`,
              borderRadius: '12px',
            }}
          >
            <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(integration.color, 0.2),
                      width: 32,
                      height: 32,
                      color: integration.color,
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
                  </Box>
                </Box>
                <Switch
                  checked={integration.connected}
                  onChange={() => handleTogglePrebuilt(integration.id)}
                  size="small"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: G_START },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: G_START,
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Typography variant="subtitle2" sx={{ color: 'white', mt: 2, mb: 1 }}>
        Custom Integrations ({integrations.length})
      </Typography>
      {integrations.length === 0 ? (
        <Alert
          severity="info"
          sx={{
            background: 'rgba(79,110,247,0.1)',
            border: `1px solid ${G_START}44`,
            color: '#A5B4FC',
            borderRadius: '12px',
            py: 0,
          }}
        >
          <Typography variant="caption">
            No custom integrations yet. Click any service above to add.
          </Typography>
        </Alert>
      ) : (
        integrations.map((integration, index) => {
          const integrationType = integrationTypes.find((t) => t.type === integration.type);
          const Icon = integrationType?.icon;
          return (
            <Card
              key={index}
              sx={{
                mb: 1,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
              }}
            >
              <CardContent sx={{ py: 1 }}>
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {Icon && <Icon sx={{ fontSize: 20, color: G_START }} />}
                    <Box>
                      <Typography variant="caption" sx={{ color: 'white' }}>
                        {integrationType?.label} - {integration.provider}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}
                      >
                        {integration.api_key ? 'API key configured' : 'Settings configured'}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveIntegration(index)}
                    sx={{ color: '#ff4444' }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          );
        })
      )}

      <Dialog
        open={configDialog}
        onClose={() => setConfigDialog(false)}
        maxWidth="xs"
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
                <FormControlLabel
                  control={<Switch size="small" />}
                  label="Enable on all pages"
                  sx={{
                    mt: 0,
                    '& .MuiTypography-root': {
                      fontSize: '0.75rem',
                      color: 'rgba(255,255,255,0.7)',
                    },
                  }}
                />
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
            Add Integration
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const DesignStudio = ({
  currentProject,
  setCurrentProject,
  mergedDesign,
  setMergedDesign,
  wsConnection,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  // const { user } = useAuth(); // Uncomment when auth is set up

  const [activeTab, setActiveTab] = useState(0);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [selectedTextElement, setSelectedTextElement] = useState(null);
  const [selectedImageElement, setSelectedImageElement] = useState(null);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [showCode, setShowCode] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [components, setComponents] = useState([]);
  const [textElements, setTextElements] = useState([]);
  const [imageElements, setImageElements] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [publishUrl, setPublishUrl] = useState('');
  const [colorPickerAnchor, setColorPickerAnchor] = useState(null);

  // Save modal state
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [projectNameInput, setProjectNameInput] = useState('');
  const [savedProjectCard, setSavedProjectCard] = useState(null);
  const [selectedColorTarget, setSelectedColorTarget] = useState(null);
  const [editingText, setEditingText] = useState(null);
  const [dragDropMode, setDragDropMode] = useState(false);
  const [canvasScale, setCanvasScale] = useState(1);
  const [imageUploadDialogOpen, setImageUploadDialogOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // New publish modal states
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [websiteName, setWebsiteName] = useState('');
  const [isSavingToDB, setIsSavingToDB] = useState(false);
  const [generatedSlug, setGeneratedSlug] = useState('');
  const [slugError, setSlugError] = useState('');
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const mockFileInputRef = useRef(null);
  const autoSaveTimerRef = useRef(null);

  // ── Multi-page support ────────────────────────────────────────────────
  const [pages, setPages] = useState([
    { id: 'page-1', name: 'Home', components: [], textElements: [], imageElements: [] },
  ]);
  const [activePageId, setActivePageId] = useState('page-1');
  const [addPageDialogOpen, setAddPageDialogOpen] = useState(false);
  const [newPageName, setNewPageName] = useState('');

  // ── Projects gallery ─────────────────────────────────────────────────
  const [showProjectsGallery, setShowProjectsGallery] = useState(false);
  const [allProjects, setAllProjects] = useState([]);
  const [galleryPreviewProject, setGalleryPreviewProject] = useState(null);

  // ── Mock / production image upload ───────────────────────────────────
  const [imageUploadMode, setImageUploadMode] = useState('mock'); // 'mock' | 'production'
  const [mockImageUrl, setMockImageUrl] = useState('');

  // ── Auto-save ─────────────────────────────────────────────────────────
  const [autoSaveStatus, setAutoSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved'

  // ── Colour palette component state ────────────────────────────────────
  const [paletteComponentOpen, setPaletteComponentOpen] = useState(false);

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

  // Add this to your existing styles or in a useEffect
  useEffect(() => {
    // Load saved theme on mount
    const savedThemeId = localStorage.getItem('currentColorTheme');
    if (savedThemeId) {
      const savedTheme = colorThemes.find((theme) => theme.id === savedThemeId);
      if (savedTheme) {
        applyColorTheme(savedTheme, setGlobalStyles, showSnackbar);
      }
    }
  }, []);

  // Load saved design colors from localStorage on mount
  useEffect(() => {
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

    // Load saved uploaded images
    const savedImages = localStorage.getItem('uploadedImages');
    if (savedImages) {
      try {
        setUploadedImages(JSON.parse(savedImages));
      } catch (e) {
        console.error('Error loading saved images:', e);
      }
    }
  }, []);

  // Save uploaded images to localStorage
  useEffect(() => {
    localStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));
  }, [uploadedImages]);

  // ── Auto-save whenever canvas content changes ─────────────────────────
  useEffect(() => {
    const projectId = currentProject?.id || savedProjectCard?.id;
    if (!projectId) return; // nothing to save until first named save

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
        localStorage.setItem(`project_${projectId}`, JSON.stringify(projectData));
        localStorage.setItem('latest_project_id', projectId);
        localStorage.setItem('latest_project_data', JSON.stringify(projectData));
        if (setCurrentProject) setCurrentProject(projectData);
        setAutoSaveStatus('saved');
        setTimeout(() => setAutoSaveStatus('idle'), 2000);
      } catch (e) {
        setAutoSaveStatus('idle');
      }
    }, 1500);

    return () => clearTimeout(autoSaveTimerRef.current);
  }, [components, textElements, imageElements, globalStyles, pages]); // eslint-disable-line

  // ── Sync active-page canvas on page switch ───────────────────────────
  useEffect(() => {
    const page = pages.find((p) => p.id === activePageId);
    if (page) {
      setComponents(page.components || []);
      setTextElements(page.textElements || []);
      setImageElements(page.imageElements || []);
    }
  }, [activePageId]); // eslint-disable-line

  // ── Load all saved projects for the gallery ───────────────────────────
  useEffect(() => {
    if (showProjectsGallery) {
      const projects = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('project_')) {
          try {
            const data = JSON.parse(localStorage.getItem(key));
            if (data && data.id && data.name) projects.push(data);
          } catch (_) {}
        }
      }
      projects.sort((a, b) => new Date(b.lastEdited) - new Date(a.lastEdited));
      setAllProjects(projects);
    }
  }, [showProjectsGallery]);

  // Generate code when showCode is toggled
  useEffect(() => {
    if (showCode) {
      generateHTMLCode();
    }
  }, [showCode, components, textElements, imageElements, globalStyles]);

  // Check slug uniqueness function
  const checkSlugUniqueness = async (slug) => {
    if (!slug || slug.length < 3) return true;

    setIsCheckingSlug(true);
    try {
      const response = await axios.get(`/api/websites/check-slug?slug=${slug}`);
      setIsCheckingSlug(false);
      return response.data.isUnique;
    } catch (error) {
      setIsCheckingSlug(false);
      console.error('Error checking slug:', error);
      return false;
    }
  };

  // Generate HTML/CSS code from the current design
  const generateHTMLCode = () => {
    const generateStyles = () => {
      return `
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            background-color: ${globalStyles.backgroundColor};
            color: ${globalStyles.textColor};
            font-family: ${globalStyles.fontFamily};
            line-height: 1.6;
          }
          
          h1, h2, h3, h4, h5, h6 {
            color: ${globalStyles.headingColor};
          }
          
          a {
            color: ${globalStyles.primaryColor};
            text-decoration: none;
          }
          
          a:hover {
            text-decoration: underline;
          }
          
          button {
            background: ${globalStyles.primaryColor};
            border: none;
            border-radius: ${globalStyles.buttonStyle === 'rounded' ? '999px' : globalStyles.borderRadius};
            padding: 12px 24px;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          }
          
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: ${globalStyles.spacing};
          }
          
          .hero-section {
            text-align: center;
            padding: 80px 20px;
            background: linear-gradient(135deg, ${globalStyles.primaryColor}, ${globalStyles.secondaryColor});
            border-radius: ${globalStyles.borderRadius};
            margin-bottom: ${globalStyles.spacing};
          }
          
          .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: ${globalStyles.spacing};
            padding: 60px 20px;
          }
          
          .feature-card {
            background: ${alpha(globalStyles.primaryColor, 0.05)};
            padding: 24px;
            border-radius: ${globalStyles.borderRadius};
            text-align: center;
            transition: transform 0.3s ease;
          }
          
          .feature-card:hover {
            transform: translateY(-8px);
          }
          
          .gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: ${globalStyles.spacing};
            padding: 60px 20px;
          }
          
          .gallery-item {
            background: ${alpha(globalStyles.primaryColor, 0.05)};
            padding: 16px;
            border-radius: ${globalStyles.borderRadius};
            text-align: center;
          }
          
          .gallery-item img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: ${globalStyles.borderRadius};
            margin-bottom: 16px;
          }
          
          .contact-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: ${globalStyles.spacing};
            padding: 60px 20px;
          }
          
          .contact-form input,
          .contact-form textarea {
            width: 100%;
            padding: 12px;
            margin-bottom: 16px;
            background: ${alpha(globalStyles.primaryColor, 0.05)};
            border: 1px solid ${alpha(globalStyles.textColor, 0.2)};
            border-radius: ${globalStyles.borderRadius};
            color: ${globalStyles.textColor};
          }
          
          .pricing-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: ${globalStyles.spacing};
            padding: 60px 20px;
          }
          
          .pricing-card {
            background: ${alpha(globalStyles.primaryColor, 0.05)};
            padding: 32px;
            border-radius: ${globalStyles.borderRadius};
            text-align: center;
            transition: transform 0.3s ease;
          }
          
          .pricing-card:hover {
            transform: translateY(-8px);
          }
          
          .pricing-price {
            font-size: 48px;
            font-weight: bold;
            margin: 20px 0;
          }
          
          .draggable-element {
            position: relative;
            cursor: pointer;
            transition: transform 0.2s ease;
          }
          
          .draggable-element:hover {
            transform: scale(1.02);
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          [data-animate] {
            animation: fadeInUp 0.6s ease-out;
          }
        </style>
      `;
    };

    const generateTextElements = () => {
      return textElements
        .map((element) => {
          const styles = element.styles;
          const styleString = Object.entries(styles)
            .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
            .join('; ');

          if (element.tag === 'a') {
            return `<${element.tag} href="${element.href || '#'}" style="${styleString}" class="draggable-element">${element.content}</${element.tag}>`;
          }
          return `<${element.tag} style="${styleString}" class="draggable-element">${element.content}</${element.tag}>`;
        })
        .join('\n');
    };

    const generateImageElements = () => {
      return imageElements
        .map((element) => {
          const styleString = `width: ${element.width}; height: ${element.height}; object-fit: ${element.objectFit}; border-radius: ${element.borderRadius}; filter: ${element.styles?.filter || 'none'}; transform: ${element.styles?.transform || 'none'};`;
          return `<img src="${element.imageUrl}" alt="${element.alt}" style="${styleString}" class="draggable-element" />`;
        })
        .join('\n');
    };

    const generateComponents = () => {
      return components
        .map((component) => {
          switch (component.type) {
            case 'hero':
              return `
              <div class="hero-section" style="text-align: center; padding: 80px 20px;">
                ${component.content.image ? `<img src="${component.content.image}" alt="Hero" style="max-width: 100%; margin-bottom: 24px; border-radius: ${globalStyles.borderRadius};" />` : ''}
                <h1 style="font-size: 48px; margin-bottom: 16px;">${component.content.title}</h1>
                <p style="font-size: 20px; margin-bottom: 32px; color: ${alpha(globalStyles.textColor, 0.8)};">${component.content.subtitle}</p>
                <button>${component.content.buttonText}</button>
              </div>
            `;

            case 'features':
              return `
              <div style="padding: 60px 20px;">
                <h2 style="text-align: center; margin-bottom: 48px;">${component.content.title}</h2>
                <div class="features-grid">
                  ${component.content.items
                    .map(
                      (item) => `
                    <div class="feature-card">
                      ${item.image ? `<img src="${item.image}" alt="${item.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: ${globalStyles.borderRadius}; margin-bottom: 16px;" />` : ''}
                      <h3 style="margin-bottom: 12px; color: ${globalStyles.primaryColor};">${item.title}</h3>
                      <p>${item.description}</p>
                    </div>
                  `
                    )
                    .join('')}
                </div>
              </div>
            `;

            case 'gallery':
              return `
              <div style="padding: 60px 20px;">
                <h2 style="text-align: center; margin-bottom: 48px;">${component.content.title}</h2>
                <div class="gallery-grid">
                  ${component.content.items
                    .map(
                      (item) => `
                    <div class="gallery-item">
                      ${item.image ? `<img src="${item.image}" alt="${item.title}" />` : '<div style="height: 200px; background: rgba(0,0,0,0.1); border-radius: 8px;"></div>'}
                      <h3>${item.title}</h3>
                      <p>${item.description}</p>
                    </div>
                  `
                    )
                    .join('')}
                </div>
              </div>
            `;

            case 'contact':
              return `
              <div style="padding: 60px 20px;">
                <h2 style="text-align: center; margin-bottom: 48px;">${component.content.title}</h2>
                <div class="contact-grid">
                  <div class="contact-form">
                    <input type="text" placeholder="Name" />
                    <input type="email" placeholder="Email" />
                    <textarea rows="4" placeholder="Message"></textarea>
                    <button>Send Message</button>
                  </div>
                  <div>
                    <h3>Contact Information</h3>
                    <p>📍 ${component.content.address}</p>
                    <p>📧 ${component.content.email}</p>
                    <p>📞 ${component.content.phone}</p>
                  </div>
                </div>
              </div>
            `;

            case 'pricing':
              return `
              <div style="padding: 60px 20px;">
                <h2 style="text-align: center; margin-bottom: 48px;">${component.content.title}</h2>
                <div class="pricing-grid">
                  ${component.content.plans
                    .map(
                      (plan) => `
                    <div class="pricing-card">
                      <h3>${plan.name}</h3>
                      <div class="pricing-price">${plan.price}</div>
                      <ul style="list-style: none; margin: 20px 0;">
                        ${plan.features.map((feature) => `<li>✓ ${feature}</li>`).join('')}
                      </ul>
                      <button>Choose Plan</button>
                    </div>
                  `
                    )
                    .join('')}
                </div>
              </div>
            `;
            case 'colors':
              return `<div class="colors-grid">${component.content.colors.map((color) => `<div class="color-item" style="background-color: ${color};"></div>`).join('')}</div>`;
            default:
              return '';
          }
        })
        .join('\n');
    };

    const htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${currentProject?.name || 'My Website'}</title>
  ${generateStyles()}
</head>
<body>
  <div class="container">
    ${generateTextElements()}
    ${generateImageElements()}
    ${generateComponents()}
  </div>
</body>
</html>`;

    setGeneratedCode(htmlCode);
  };

  // Load template design when component mounts or currentProject changes
  useEffect(() => {
    if (currentProject?.design) {
      loadTemplateDesign(currentProject.design);
    } else if (mergedDesign) {
      initializeFromDesign();
    } else if (currentProject?.components) {
      setComponents(currentProject.components);
      if (currentProject.textElements) {
        setTextElements(currentProject.textElements);
      }
      if (currentProject.imageElements) {
        setImageElements(currentProject.imageElements);
      }
      if (currentProject.uploadedImages) {
        setUploadedImages(currentProject.uploadedImages);
      }
      if (currentProject.styles) {
        setGlobalStyles(currentProject.styles);
      }
    } else {
      initializeDefaultComponents();
      initializeDefaultTextElements();
    }
  }, [currentProject, mergedDesign]);

  const initializeDefaultTextElements = () => {
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
  };

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
      EduSmart: {
        primaryColor: '#4A5D73',
        secondaryColor: '#7F8C8D',
        accentColor: '#3498DB',
        backgroundColor: '#F8F9FA',
        textColor: '#2C3E50',
        headingColor: '#2C3E50',
        borderRadius: '12px',
        spacing: '28px',
        fontFamily: 'Montserrat, sans-serif',
        buttonStyle: 'rounded',
        heroTitle: 'Learn Something New Today',
        heroSubtitle: 'Access quality education from anywhere',
      },
      'Foodie Delight': {
        primaryColor: '#7B3E19',
        secondaryColor: '#E67E22',
        accentColor: '#F1C40F',
        backgroundColor: '#FFF9F5',
        textColor: '#4A2C1A',
        headingColor: '#7B3E19',
        borderRadius: '16px',
        spacing: '36px',
        fontFamily: 'Playfair Display, serif',
        buttonStyle: 'rounded',
        heroTitle: 'Delicious Food Awaits',
        heroSubtitle: 'Experience culinary excellence',
      },
      'Tech Startup': {
        primaryColor: '#283655',
        secondaryColor: '#4D648D',
        accentColor: '#1E81B0',
        backgroundColor: '#0A0F1A',
        textColor: '#E0E0E0',
        headingColor: '#FFFFFF',
        borderRadius: '8px',
        spacing: '32px',
        fontFamily: 'Space Grotesk, sans-serif',
        buttonStyle: 'square',
        heroTitle: 'Innovation Meets Technology',
        heroSubtitle: 'Build the future with us',
      },
    };

    return styles[designName] || styles['Modern Minimalist'];
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
                icon: 'brush',
                image: null,
              },
              {
                title: 'Fast Performance',
                description: 'Optimized for speed and efficiency',
                icon: 'speed',
                image: null,
              },
              {
                title: 'Responsive Layout',
                description: 'Looks great on all devices',
                icon: 'mobile',
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

  const initializeDefaultComponents = () => {
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
  };

  const initializeFromDesign = () => {
    if (mergedDesign?.components) {
      setComponents(mergedDesign.components);
    }
    if (mergedDesign?.textElements) {
      setTextElements(mergedDesign.textElements);
    }
    if (mergedDesign?.imageElements) {
      setImageElements(mergedDesign.imageElements);
    }
    if (mergedDesign?.uploadedImages) {
      setUploadedImages(mergedDesign.uploadedImages);
    }
    if (mergedDesign?.styles) {
      setGlobalStyles({ ...globalStyles, ...mergedDesign.styles });
    }
  };

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
    showSnackbar(`${property} updated`, 'success');
  };

  // Image Upload Functions
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

  // Add image to canvas as standalone element
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

  // Add image to component (hero, feature, etc.)
  const handleAddImageToComponent = (image, componentId, itemIndex = null) => {
    const updatedComponents = components.map((comp) => {
      if (comp.id === componentId) {
        if (comp.type === 'hero') {
          return {
            ...comp,
            content: { ...comp.content, image: image.url },
          };
        } else if (comp.type === 'features' && itemIndex !== null) {
          const updatedItems = [...comp.content.items];
          updatedItems[itemIndex] = { ...updatedItems[itemIndex], image: image.url };
          return {
            ...comp,
            content: { ...comp.content, items: updatedItems },
          };
        } else if (comp.type === 'gallery' && itemIndex !== null) {
          const updatedItems = [...comp.content.items];
          updatedItems[itemIndex] = { ...updatedItems[itemIndex], image: image.url };
          return {
            ...comp,
            content: { ...comp.content, items: updatedItems },
          };
        }
      }
      return comp;
    });
    setComponents(updatedComponents);
    addToHistory(updatedComponents, globalStyles, textElements, imageElements, uploadedImages);
    showSnackbar('Image added to component', 'success');
  };

  const handleUpdateImageElement = (id, updates) => {
    const newImageElements = imageElements.map((el) => (el.id === id ? { ...el, ...updates } : el));
    setImageElements(newImageElements);
    addToHistory(components, globalStyles, textElements, newImageElements, uploadedImages);
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
    // Also remove any image elements that use this image
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
    if (imageElement) {
      handleUpdateImageElement(id, {
        width: newWidth,
        height: newHeight,
        styles: {
          ...imageElement.styles,
          width: newWidth,
          height: newHeight,
        },
      });
    }
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
        styles: {
          ...imageElement.styles,
          filter: filterString,
        },
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
        styles: {
          ...imageElement.styles,
          transform: `rotate(${newRotate}deg)`,
        },
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
        styles: {
          ...imageElement.styles,
          transform: transform,
        },
      });
    }
  };

  const handleTextPositionChange = (id, x, y) => {
    const element = [...textElements, ...imageElements].find((el) => el.id === id);
    if (element) {
      if (element.type === 'text') {
        handleUpdateTextElement(id, { position: { x, y } });
      } else {
        handleUpdateImageElement(id, { position: { x, y } });
      }
    }
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
    if (element) {
      handleUpdateTextElement(id, {
        styles: { ...element.styles, [property]: value },
      });
    }
  };

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
      },
      position: { x: 50, y: Math.random() * 300 + 100 },
      href: textStyle.href,
    };
    const newTextElements = [...textElements, newTextElement];
    setTextElements(newTextElements);
    addToHistory(components, globalStyles, newTextElements, imageElements, uploadedImages);
    showSnackbar(`${textStyle.name} added to canvas`, 'success');
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

  const handleAddComponent = (type) => {
    const newComponent = {
      id: Date.now().toString(),
      type: type,
      content: getDefaultContent(type),
      styles: {},
      position: components.length,
    };
    const newComponents = [...components, newComponent];
    setComponents(newComponents);
    addToHistory(newComponents, globalStyles, textElements, imageElements, uploadedImages);
    showSnackbar(`${type} component added`, 'success');
  };

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
            {
              title: 'Feature 1',
              description: 'Description of feature 1',
              icon: 'star',
              image: null,
            },
            {
              title: 'Feature 2',
              description: 'Description of feature 2',
              icon: 'star',
              image: null,
            },
            {
              title: 'Feature 3',
              description: 'Description of feature 3',
              icon: 'star',
              image: null,
            },
          ],
        };
      case 'gallery':
        return {
          title: 'Gallery',
          items: [
            { title: 'Project 1', image: null, description: 'Project description' },
            { title: 'Project 2', image: null, description: 'Project description' },
            { title: 'Project 3', image: null, description: 'Project description' },
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
      case 'colors':
        return {
          activeTab: 3,
        };
      default:
        return { text: 'New Section' };
    }
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
    } else {
      updatedContent[field] = value;
    }

    handleUpdateComponent(componentId, { content: updatedContent });
  };

  const handleAddComponentItem = (componentId, type) => {
    const component = components.find((c) => c.id === componentId);
    if (!component) return;

    let updatedContent = { ...component.content };
    const newItem = getNewItemByType(type);

    if (component.type === 'features' && updatedContent.items) {
      updatedContent.items = [...updatedContent.items, newItem];
    } else if (component.type === 'gallery' && updatedContent.items) {
      updatedContent.items = [...updatedContent.items, newItem];
    } else if (component.type === 'pricing' && updatedContent.plans) {
      updatedContent.plans = [...updatedContent.plans, newItem];
    }

    handleUpdateComponent(componentId, { content: updatedContent });
    showSnackbar(`New ${type} item added`, 'success');
  };

  const getNewItemByType = (type) => {
    switch (type) {
      case 'feature':
        return {
          title: 'New Feature',
          description: 'Feature description',
          icon: 'star',
          image: null,
        };
      case 'gallery':
        return { title: 'New Project', description: 'Project description', image: null };
      case 'plan':
        return { name: 'New Plan', price: '$0', features: ['Feature 1'] };
      default:
        return {};
    }
  };

  const handleDeleteComponentItem = (componentId, type, index) => {
    const component = components.find((c) => c.id === componentId);
    if (!component) return;

    let updatedContent = { ...component.content };

    if (type === 'feature' && updatedContent.items) {
      updatedContent.items = updatedContent.items.filter((_, i) => i !== index);
    } else if (type === 'gallery' && updatedContent.items) {
      updatedContent.items = updatedContent.items.filter((_, i) => i !== index);
    } else if (type === 'plan' && updatedContent.plans) {
      updatedContent.plans = updatedContent.plans.filter((_, i) => i !== index);
    }

    handleUpdateComponent(componentId, { content: updatedContent });
    showSnackbar('Item deleted', 'info');
  };

  // Opens save modal — actual save happens in handleSaveConfirm
  const handleSave = () => {
    setProjectNameInput(currentProject?.name || savedProjectCard?.name || 'Untitled Project');
    setSaveModalOpen(true);
  };

  // Generate a visual thumbnail colour strip from globalStyles
  const generateThumbnailDataUrl = (styles) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 340;
      const ctx = canvas.getContext('2d');

      // Add roundRect helper if not available
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

      // Background
      ctx.fillStyle = styles.backgroundColor || '#080C14';
      ctx.fillRect(0, 0, 600, 340);

      // Hero gradient band
      const grad = ctx.createLinearGradient(0, 0, 600, 180);
      grad.addColorStop(0, styles.primaryColor || '#4F6EF7');
      grad.addColorStop(1, styles.secondaryColor || '#2DBCB6');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(20, 20, 560, 160, 12);
      ctx.fill();

      // Heading mock text bars
      ctx.fillStyle = styles.headingColor || '#FFFFFF';
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.roundRect(120, 65, 360, 18, 4);
      ctx.fill();
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.roundRect(170, 95, 260, 10, 3);
      ctx.fill();

      // Button mock
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(240, 122, 120, 32, 8);
      ctx.fill();

      // Card mocks below
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

  const handleSaveConfirm = async () => {
    setSaving(true);
    try {
      const projectName = projectNameInput.trim() || 'Untitled Project';

      // Flush current canvas into the active page before saving
      const updatedPages = pages.map((p) =>
        p.id === activePageId ? { ...p, components, textElements, imageElements } : p
      );

      const token = localStorage.getItem('authToken');

      // ── Decide create vs update ──────────────────────────────────────
      let savedId = currentProject?.id || savedProjectCard?.id;
      let apiProject;

      if (savedId) {
        // Update existing project
        const res = await fetch(`/api/projects/${savedId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({
            name: projectName,
            customizations: { styles: globalStyles, pages: updatedPages },
            html_code: generatedCode || null,
          }),
        });
        if (!res.ok) throw new Error((await res.json()).detail || 'Update failed');
        apiProject = await res.json();
      } else {
        // Create new project
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({
            name: projectName,
            designs: [],
            customizations: { styles: globalStyles, pages: updatedPages },
          }),
        });
        if (!res.ok) throw new Error((await res.json()).detail || 'Create failed');
        apiProject = await res.json();
        savedId = apiProject.id;
      }

      // ── Also persist locally for auto-save / gallery ─────────────────
      const publishSlug = savedProjectCard?.publishSlug ||
        `site-${savedId}-${Math.random().toString(36).slice(2, 8)}`;

      const projectData = {
        id: savedId,
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
        publishSlug,
      };

      localStorage.setItem(`project_${savedId}`, JSON.stringify(projectData));
      localStorage.setItem('latest_project_id', savedId);
      localStorage.setItem('latest_project_data', JSON.stringify(projectData));

      const indexRaw = localStorage.getItem('projects_index');
      const index = indexRaw ? JSON.parse(indexRaw) : [];
      if (!index.includes(savedId)) {
        index.push(savedId);
        localStorage.setItem('projects_index', JSON.stringify(index));
      }

      if (setCurrentProject) setCurrentProject({ ...projectData, ...apiProject });
      setPages(updatedPages);

      const thumbnail = generateThumbnailDataUrl(globalStyles);
      // Keep modal OPEN so the saved project card is visible
      setSavedProjectCard({ name: projectName, id: savedId, publishSlug, thumbnail });
      showSnackbar('Project saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving project:', error);
      showSnackbar(error.message || 'Error saving project', 'error');
    } finally {
      setSaving(false);
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

    localStorage.setItem(`project_${projectId}`, JSON.stringify(projectData));
    localStorage.setItem('latest_project_id', projectId);
    localStorage.setItem('latest_project_data', JSON.stringify(projectData));

    navigate(`/preview?id=${projectId}&t=${Date.now()}`);
    showSnackbar('Opening preview...', 'info');
  };

  // Updated handlePublish - opens modal instead of directly publishing
  const handlePublish = async () => {
    setPublishModalOpen(true);
    setWebsiteName(currentProject?.name || savedProjectCard?.name || 'My Website');
    setGeneratedSlug('');
    setSlugError('');
  };

  // Save website to database and generate link
  const saveWebsiteToDatabase = async () => {
    if (!websiteName.trim()) {
      showSnackbar('Please enter a website name', 'warning');
      return;
    }

    let finalSlug = generatedSlug;

    // Generate slug from website name if not provided
    if (!finalSlug) {
      finalSlug = websiteName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(finalSlug)) {
      setSlugError('Slug can only contain lowercase letters, numbers, and hyphens');
      return;
    }

    if (finalSlug.length < 3 || finalSlug.length > 50) {
      setSlugError('Slug must be between 3 and 50 characters');
      return;
    }

    // Check slug uniqueness
    const isUnique = await checkSlugUniqueness(finalSlug);
    if (!isUnique) {
      setSlugError('This URL slug is already taken. Please choose another one.');
      return;
    }

    setIsSavingToDB(true);

    try {
      const projectId = savedProjectCard?.id || currentProject?.id || Date.now().toString();

      // Prepare website data
      const websiteData = {
        id: projectId,
        name: websiteName.trim(),
        slug: finalSlug,
        components: components,
        textElements: textElements,
        imageElements: imageElements,
        uploadedImages: uploadedImages,
        styles: globalStyles,
        lastEdited: new Date().toISOString(),
        type: currentProject?.type || 'custom',
        status: 'published',
        publishedAt: new Date().toISOString(),
        publishedUrl: `${window.location.origin}/p/${finalSlug}`,
      };

      // ── Save to backend API ──────────────────────────────────────────
      const token = localStorage.getItem('authToken');
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

      // Upsert the project so html_code / customizations are current
      const isExisting = !!(savedProjectCard?.id || currentProject?.id);
      const upsertUrl = isExisting
        ? `/api/projects/${projectId}`
        : '/api/projects';
      const upsertRes = await fetch(upsertUrl, {
        method: isExisting ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify({
          name: websiteName.trim(),
          designs: [],
          customizations: { styles: globalStyles, pages },
          html_code: null,
        }),
      });
      if (!upsertRes.ok) {
        const err = await upsertRes.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to save project');
      }
      const upsertData = await upsertRes.json();
      const finalProjectId = upsertData.id || projectId;

      // Now call the publish endpoint
      const publishRes = await fetch(`/api/projects/${finalProjectId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
      });
      if (!publishRes.ok) {
        const err = await publishRes.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to publish');
      }
      const publishData = await publishRes.json();
      const publishedUrl = publishData.published_url || websiteData.publishedUrl;

      // Store locally for backup/offline access
      const finalWebsiteData = { ...websiteData, publishedUrl, id: finalProjectId };
      localStorage.setItem(`published_${finalProjectId}`, JSON.stringify(finalWebsiteData));
      localStorage.setItem(`project_${finalProjectId}`, JSON.stringify(finalWebsiteData));
      localStorage.setItem(`published_slug_${finalSlug}`, JSON.stringify(finalWebsiteData));

      // Update savedProjectCard with new info
      setSavedProjectCard({
        name: websiteName.trim(),
        id: finalProjectId,
        publishSlug: finalSlug,
        thumbnail: generateThumbnailDataUrl(globalStyles),
      });

      // Set the publish URL for the success dialog
      setPublishUrl(publishedUrl);
      setPublishModalOpen(false);
      setPublishDialogOpen(true);

      if (setCurrentProject) {
        setCurrentProject({ ...currentProject, ...finalWebsiteData, status: 'published' });
      }

      showSnackbar('Website published successfully!', 'success');
    } catch (error) {
      console.error('Error saving to database:', error);
      showSnackbar(error.message || 'Error publishing website', 'error');
    } finally {
      setIsSavingToDB(false);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publishUrl);
    showSnackbar('Link copied to clipboard!', 'success');
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    showSnackbar('Code copied to clipboard!', 'success');
  };

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
      if (selectedColorTarget.target === 'global') {
        handleStyleChange(selectedColorTarget.property, color.hex);
      } else if (selectedColorTarget.target === 'text' && selectedTextElement) {
        handleTextStyleChange(selectedTextElement.id, selectedColorTarget.property, color.hex);
      }
    }
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

  // Publish Modal Component
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
          {/* Website Name Input */}
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

          {/* Custom URL Slug Input */}
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
              Leave empty to auto-generate from website name. Use only letters, numbers, and
              hyphens.
            </Typography>
          </Box>

          {/* Preview of what will be saved */}
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

          {/* Info about database storage */}
          <Alert
            severity="info"
            sx={{
              bgcolor: alpha(G_START, 0.1),
              color: alpha('#FFFFFF', 0.8),
              '& .MuiAlert-icon': { color: G_START },
            }}
          >
            <Typography variant="caption">
              Your website will be saved to your account database. You can edit and republish
              anytime. The published link will be permanent and shareable.
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

  const renderPreview = () => {
    const previewWidth = {
      mobile: '375px',
      tablet: '768px',
      desktop: '100%',
    }[previewMode];

    const backgroundStyle = {
      backgroundColor: globalStyles.backgroundColor,
      ...(globalStyles.backgroundGradient && { backgroundImage: globalStyles.backgroundGradient }),
      ...(globalStyles.backgroundImage && {
        backgroundImage: `url(${globalStyles.backgroundImage})`,
      }),
      backgroundBlendMode: globalStyles.backgroundBlur > 0 ? 'overlay' : 'normal',
      backdropFilter:
        globalStyles.backgroundBlur > 0 ? `blur(${globalStyles.backgroundBlur}px)` : 'none',
      opacity: globalStyles.backgroundOpacity,
    };

    // Combine all draggable elements
    const allDraggableElements = [...textElements, ...imageElements];

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
          ...backgroundStyle,
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <style>{`
          .preview-container {
            background-color: ${globalStyles.backgroundColor};
            color: ${globalStyles.textColor};
            font-family: ${globalStyles.fontFamily};
          }
          .preview-container h1, .preview-container h2, .preview-container h3,
          .preview-container h4, .preview-container h5, .preview-container h6 {
            color: ${globalStyles.headingColor};
          }
          .preview-container a {
            color: ${globalStyles.primaryColor};
            text-decoration: none;
          }
          .preview-container a:hover {
            text-decoration: underline;
          }
          .preview-container .hero-section {
            background: linear-gradient(135deg, ${globalStyles.primaryColor}, ${globalStyles.secondaryColor});
            border-radius: ${globalStyles.borderRadius};
            padding: ${globalStyles.spacing};
          }
          .preview-container button {
            background: ${globalStyles.primaryColor};
            border-radius: ${globalStyles.buttonStyle === 'rounded' ? '999px' : globalStyles.borderRadius};
            transition: all 0.3s ease;
          }
          .preview-container button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          }
          ${
            globalStyles.animationEnabled &&
            `
            .preview-container [data-animate] {
              animation: fadeInUp 0.6s ease-out;
            }
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `
          }
          .draggable-element {
            cursor: ${dragDropMode ? 'move' : 'pointer'};
            transition: transform 0.2s ease;
          }
          .draggable-element:hover {
            transform: scale(1.02);
          }
          .drag-overlay {
            border: 2px dashed ${G_START};
            background: ${alpha(G_START, 0.1)};
          }
          .image-element {
            transition: all 0.3s ease;
          }
          .image-element:hover {
            transform: scale(1.02);
            box-shadow: 0 8px 24px rgba(0,0,0,0.2);
          }
        `}</style>

        <div
          className={`preview-container ${dragOver ? 'drag-overlay' : ''}`}
          style={{ position: 'relative', minHeight: '100vh' }}
        >
          {/* Draggable Elements (Text and Images) */}
          {allDraggableElements.map((element, index) => (
            <motion.div
              key={element.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="draggable-element image-element"
              style={{
                position: dragDropMode ? 'absolute' : 'relative',
                left: dragDropMode ? `${element.position?.x || 50}px` : 'auto',
                top: dragDropMode ? `${element.position?.y || 100}px` : 'auto',
                cursor: dragDropMode ? 'move' : 'pointer',
                ...element.styles,
              }}
              onClick={() =>
                !dragDropMode &&
                (element.type === 'image'
                  ? setSelectedImageElement(element)
                  : setSelectedTextElement(element))
              }
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
              whileHover={dragDropMode ? { scale: 1.05 } : {}}
            >
              {element.type === 'image' ? (
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
                  }}
                  onClick={() => setSelectedImageElement(element)}
                />
              ) : editingText === element.id ? (
                <TextField
                  autoFocus
                  fullWidth
                  multiline={element.tag === 'p' || element.tag === 'div'}
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
              {selectedTextElement?.id === element.id && !dragDropMode && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -2,
                    left: -2,
                    right: -2,
                    bottom: -2,
                    border: `2px solid ${globalStyles.primaryColor}`,
                    borderRadius: '4px',
                    pointerEvents: 'none',
                    zIndex: 10,
                  }}
                />
              )}
              {selectedImageElement?.id === element.id &&
                !dragDropMode &&
                element.type === 'image' && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -2,
                      left: -2,
                      right: -2,
                      bottom: -2,
                      border: `2px solid ${globalStyles.primaryColor}`,
                      borderRadius: '4px',
                      pointerEvents: 'none',
                      zIndex: 10,
                    }}
                  />
                )}
            </motion.div>
          ))}

          {/* Component Sections */}
          {components.map((component, index) => (
            <motion.div
              key={component.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedComponent(component)}
              style={{
                cursor: 'pointer',
                position: 'relative',
                ...component.styles,
              }}
              whileHover={{ scale: 1.01 }}
            >
              {selectedComponent?.id === component.id && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    border: `2px solid ${globalStyles.primaryColor}`,
                    borderRadius: globalStyles.borderRadius,
                    pointerEvents: 'none',
                    zIndex: 10,
                  }}
                />
              )}
              {renderComponent(component)}
            </motion.div>
          ))}
        </div>
      </Box>
    );
  };

  const renderComponent = (component) => {
    const styles = {
      color: globalStyles.textColor,
      ...component.styles,
    };

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
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.02)' },
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
              onDoubleClick={() => handleUpdateComponentContent(component.id, 'title', '')}
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
              onDoubleClick={() => handleUpdateComponentContent(component.id, 'subtitle', '')}
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
              onDoubleClick={() => handleUpdateComponentContent(component.id, 'buttonText', '')}
            >
              {component.content.buttonText}
            </Button>
          </Box>
        );

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
              onDoubleClick={() => handleUpdateComponentContent(component.id, 'title', '')}
            >
              {component.content.title}
            </Typography>
            <Grid container spacing={4}>
              {component.content.items.map((item, idx) => (
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
                          transition: 'transform 0.3s',
                          '&:hover': { transform: 'scale(1.05)' },
                        }}
                      />
                    )}
                    <Typography
                      variant="h5"
                      sx={{ mb: 2, color: globalStyles.primaryColor }}
                      onDoubleClick={() =>
                        handleUpdateComponentContent(component.id, 'title', item.title, idx)
                      }
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      sx={{ color: alpha(globalStyles.textColor, 0.7) }}
                      onDoubleClick={() =>
                        handleUpdateComponentContent(
                          component.id,
                          'description',
                          item.description,
                          idx
                        )
                      }
                    >
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
              onDoubleClick={() => handleUpdateComponentContent(component.id, 'title', '')}
            >
              {component.content.title}
            </Typography>
            <Grid container spacing={3}>
              {component.content.items.map((item, idx) => (
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
                          transition: 'transform 0.3s',
                          '&:hover': { transform: 'scale(1.05)' },
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
                    <Typography
                      variant="h6"
                      onDoubleClick={() =>
                        handleUpdateComponentContent(component.id, 'title', item.title, idx)
                      }
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: alpha(globalStyles.textColor, 0.7) }}
                      onDoubleClick={() =>
                        handleUpdateComponentContent(
                          component.id,
                          'description',
                          item.description,
                          idx
                        )
                      }
                    >
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
              onDoubleClick={() => handleUpdateComponentContent(component.id, 'title', '')}
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
                  <Typography
                    sx={{ mb: 1, color: alpha(globalStyles.textColor, 0.8) }}
                    onDoubleClick={() => handleUpdateComponentContent(component.id, 'address', '')}
                  >
                    📍 {component.content.address}
                  </Typography>
                  <Typography
                    sx={{ mb: 1, color: alpha(globalStyles.textColor, 0.8) }}
                    onDoubleClick={() => handleUpdateComponentContent(component.id, 'email', '')}
                  >
                    📧 {component.content.email}
                  </Typography>
                  <Typography
                    sx={{ color: alpha(globalStyles.textColor, 0.8) }}
                    onDoubleClick={() => handleUpdateComponentContent(component.id, 'phone', '')}
                  >
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
              onDoubleClick={() => handleUpdateComponentContent(component.id, 'title', '')}
            >
              {component.content.title}
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              {component.content.plans.map((plan, idx) => (
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
                    <Typography
                      variant="h4"
                      sx={{ mb: 2, color: globalStyles.primaryColor }}
                      onDoubleClick={() =>
                        handleUpdateComponentContent(component.id, 'name', plan.name, idx)
                      }
                    >
                      {plan.name}
                    </Typography>
                    <Typography
                      variant="h2"
                      sx={{ mb: 2, fontWeight: 'bold' }}
                      onDoubleClick={() =>
                        handleUpdateComponentContent(component.id, 'price', plan.price, idx)
                      }
                    >
                      {plan.price}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    {plan.features.map((feature, fIdx) => (
                      <Typography
                        key={fIdx}
                        sx={{ mb: 1, color: alpha(globalStyles.textColor, 0.7) }}
                        onDoubleClick={() => {
                          const updatedFeatures = [...plan.features];
                          updatedFeatures[fIdx] = '';
                          handleUpdateComponentContent(
                            component.id,
                            'features',
                            updatedFeatures,
                            idx
                          );
                        }}
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
            {component.content.text}
          </Typography>
        );
    }
  };

  const getComponentIcon = (type) => {
    switch (type) {
      case 'hero':
        return <ImageOutlined />;
      case 'features':
        return <GridOn />;
      case 'gallery':
        return <PhotoLibrary />;
      case 'contact':
        return <ContactMail />;
      case 'pricing':
        return <ShoppingCart />;
      default:
        return <TextFields />;
    }
  };

  const getComponentName = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // ── Page management helpers ───────────────────────────────────────────
  const handleSwitchPage = (pageId) => {
    // Flush current canvas into current page first
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

  // ── Gallery helpers ───────────────────────────────────────────────────
  const handleOpenProjectInEditor = (project) => {
    if (setCurrentProject) setCurrentProject(project);
    setComponents(project.components || []);
    setTextElements(project.textElements || []);
    setImageElements(project.imageElements || []);
    setUploadedImages(project.uploadedImages || []);
    if (project.styles) setGlobalStyles(project.styles);
    if (project.pages) setPages(project.pages);
    setActivePageId(project.pages?.[0]?.id || 'page-1');
    setSavedProjectCard({ name: project.name, id: project.id, publishSlug: project.publishSlug });
    setShowProjectsGallery(false);
    showSnackbar(`Opened "${project.name}"`, 'success');
  };

  const handleDeleteProject = (projectId) => {
    localStorage.removeItem(`project_${projectId}`);
    const indexRaw = localStorage.getItem('projects_index');
    if (indexRaw) {
      const index = JSON.parse(indexRaw).filter((id) => id !== projectId);
      localStorage.setItem('projects_index', JSON.stringify(index));
    }
    setAllProjects((prev) => prev.filter((p) => p.id !== projectId));
    showSnackbar('Project deleted', 'info');
  };

  // ── Mock image helper ─────────────────────────────────────────────────
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

  return (
    <Box
      sx={{ display: 'flex', height: '100vh', bgcolor: '#080C14', position: 'relative', zIndex: 0 }}
    >
      {/* Left Sidebar - Components Library */}
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
              scrollbarsHeight: '2px',
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(e, v) => setActiveTab(v)}
              sx={{ mb: 2, minWidth: 'min-content' }}
              style={{
                width: '100%',
                overflow: 'auto',
                scrollBehavior: 'smooth',
                scrollbarWidth: '2px',
                scollbarHeight: '2px',
              }}
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
                {['hero', 'features', 'gallery', 'contact', 'pricing'].map((type) => (
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
                ))}
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
                  : 'Click on text to edit, drag icon to move. Double-click component text to edit.'}
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

              {/* Image Style Presets */}
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
                        if (uploadedImages.length > 0) {
                          handleAddImageToCanvas(uploadedImages[0], style);
                        } else {
                          showSnackbar('Upload an image first', 'warning');
                        }
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

              {/* Upload Mode Toggle */}
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
                /* ── Mock upload: paste any image URL ── */
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
                /* ── Production upload: file picker, saves to DB ── */
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
                      onChange={async (e) => {
                        const files = Array.from(e.target.files);
                        processImages(files);
                        // Production: also POST to API
                        if (files.length > 0) {
                          try {
                            const formData = new FormData();
                            files.forEach((f) => formData.append('images', f));
                            await axios.post('/api/images/upload', formData, {
                              headers: { 'Content-Type': 'multipart/form-data' },
                            });
                          } catch (err) {
                            console.warn('Image API upload failed (local copy kept):', err.message);
                          }
                        }
                      }}
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

              {/* Image Grid */}
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
              {/* ── Colour Palette Component ── */}
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
                  {/* Live colour role chips */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {[
                      { label: 'Primary', key: 'primaryColor' },
                      { label: 'Secondary', key: 'secondaryColor' },
                      { label: 'Accent', key: 'accentColor' },
                      { label: 'Background', key: 'backgroundColor' },
                      { label: 'Text', key: 'textColor' },
                      { label: 'Heading', key: 'headingColor' },
                    ].map(({ label, key }) => (
                      <Tooltip key={key} title={`${label}: ${globalStyles[key]}`}>
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
                            {label}
                          </Typography>
                        </Box>
                      </Tooltip>
                    ))}
                  </Box>

                  {/* All palettes as swatch grids with assign-on-click */}
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

              {/* Collapsed quick-apply row when closed */}
              {!paletteComponentOpen && (
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                  {colorPalettes.slice(0, 4).map((palette) => (
                    <Tooltip key={palette.name} title={`Apply ${palette.name}`}>
                      <Box
                        onClick={() => applyColorPalette(palette)}
                        sx={{
                          display: 'flex',
                          gap: '2px',
                          cursor: 'pointer',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          border: `1px solid ${alpha('#FFFFFF', 0.1)}`,
                          '&:hover': { opacity: 0.85 },
                        }}
                      >
                        {palette.colors.slice(0, 3).map((c, i) => (
                          <Box key={i} sx={{ width: 16, height: 24, bgcolor: c }} />
                        ))}
                      </Box>
                    </Tooltip>
                  ))}
                </Box>
              )}

              <Divider sx={{ mb: 2, borderColor: alpha('#FFFFFF', 0.1) }} />

              {/* Full palette list (original) */}
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
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Palette />}
                  onClick={(e) => handleColorPickerOpen(e, 'global', 'primaryColor')}
                  sx={{ color: 'white', borderColor: alpha('#FFFFFF', 0.2) }}
                >
                  Primary Color
                  <Box
                    sx={{
                      ml: 1,
                      width: 24,
                      height: 24,
                      bgcolor: globalStyles.primaryColor,
                      borderRadius: '4px',
                    }}
                  />
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Palette />}
                  onClick={(e) => handleColorPickerOpen(e, 'global', 'secondaryColor')}
                  sx={{ color: 'white', borderColor: alpha('#FFFFFF', 0.2) }}
                >
                  Secondary Color
                  <Box
                    sx={{
                      ml: 1,
                      width: 24,
                      height: 24,
                      bgcolor: globalStyles.secondaryColor,
                      borderRadius: '4px',
                    }}
                  />
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Palette />}
                  onClick={(e) => handleColorPickerOpen(e, 'global', 'accentColor')}
                  sx={{ color: 'white', borderColor: alpha('#FFFFFF', 0.2) }}
                >
                  Accent Color
                  <Box
                    sx={{
                      ml: 1,
                      width: 24,
                      height: 24,
                      bgcolor: globalStyles.accentColor,
                      borderRadius: '4px',
                    }}
                  />
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Palette />}
                  onClick={(e) => handleColorPickerOpen(e, 'global', 'backgroundColor')}
                  sx={{ color: 'white', borderColor: alpha('#FFFFFF', 0.2) }}
                >
                  Background Color
                  <Box
                    sx={{
                      ml: 1,
                      width: 24,
                      height: 24,
                      bgcolor: globalStyles.backgroundColor,
                      borderRadius: '4px',
                    }}
                  />
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Palette />}
                  onClick={(e) => handleColorPickerOpen(e, 'global', 'textColor')}
                  sx={{ color: 'white', borderColor: alpha('#FFFFFF', 0.2) }}
                >
                  Text Color
                  <Box
                    sx={{
                      ml: 1,
                      width: 24,
                      height: 24,
                      bgcolor: globalStyles.textColor,
                      borderRadius: '4px',
                    }}
                  />
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Palette />}
                  onClick={(e) => handleColorPickerOpen(e, 'global', 'headingColor')}
                  sx={{ color: 'white', borderColor: alpha('#FFFFFF', 0.2) }}
                >
                  Heading Color
                  <Box
                    sx={{
                      ml: 1,
                      width: 24,
                      height: 24,
                      bgcolor: globalStyles.headingColor,
                      borderRadius: '4px',
                    }}
                  />
                </Button>
              </Stack>
            </>
          )}
          {activeTab === 4 && (
            <>
              <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
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
                      onClick={() => applyColorTheme(theme, setGlobalStyles, showSnackbar)}
                    >
                      {/* Theme Preview */}
                      <Box
                        sx={{
                          height: 100,
                          background: `linear-gradient(135deg, ${theme.styles.primaryColor}, ${theme.styles.secondaryColor})`,
                          borderRadius: '12px 12px 0 0',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        {/* Preview elements */}
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

                        {/* Color swatches */}
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
                            applyColorTheme(theme, setGlobalStyles, showSnackbar);
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

      {/* Main Content - Preview Area */}
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

            {/* Auto-save indicator */}
            {autoSaveStatus !== 'idle' && (
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

            <Button
              variant="outlined"
              startIcon={<PhotoLibrary />}
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

        {/* ── Page Tabs Bar ──────────────────────────────────────── */}
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
              <Box
                sx={{
                  p: 2,
                  maxHeight: 'calc(100vh - 200px)',
                  overflow: 'auto',
                }}
              >
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

      {/* Right Sidebar - Component/Image Properties */}
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
                      startIcon={<ImageOutlined />}
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
                          startIcon={<ImageOutlined />}
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
                      <TextDecrease />
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
                      <TextIncrease />
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
                sx={{
                  width: '100%',
                  borderRadius: globalStyles.borderRadius,
                  mb: 2,
                }}
              />

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

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                  Brightness
                </Typography>
                <Slider
                  value={selectedImageElement.filters?.brightness || 100}
                  onChange={(e, val) =>
                    handleApplyImageFilter(selectedImageElement.id, 'brightness', val)
                  }
                  min={0}
                  max={200}
                  size="small"
                  sx={{ color: G_START }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                  Contrast
                </Typography>
                <Slider
                  value={selectedImageElement.filters?.contrast || 100}
                  onChange={(e, val) =>
                    handleApplyImageFilter(selectedImageElement.id, 'contrast', val)
                  }
                  min={0}
                  max={200}
                  size="small"
                  sx={{ color: G_START }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                  Saturation
                </Typography>
                <Slider
                  value={selectedImageElement.filters?.saturate || 100}
                  onChange={(e, val) =>
                    handleApplyImageFilter(selectedImageElement.id, 'saturate', val)
                  }
                  min={0}
                  max={200}
                  size="small"
                  sx={{ color: G_START }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                  Blur
                </Typography>
                <Slider
                  value={selectedImageElement.filters?.blur || 0}
                  onChange={(e, val) =>
                    handleApplyImageFilter(selectedImageElement.id, 'blur', val)
                  }
                  min={0}
                  max={20}
                  size="small"
                  sx={{ color: G_START }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                  Grayscale
                </Typography>
                <Slider
                  value={selectedImageElement.filters?.grayscale || 0}
                  onChange={(e, val) =>
                    handleApplyImageFilter(selectedImageElement.id, 'grayscale', val)
                  }
                  min={0}
                  max={100}
                  size="small"
                  sx={{ color: G_START }}
                />
              </Box>

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

      {/* Image Upload Dialog for Components */}
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
                    if (selectedComponent) {
                      handleAddImageToComponent(image, selectedComponent.id);
                    }
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

      {/* Color Picker Popover */}
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
              selectedColorTarget?.property === 'primaryColor'
                ? globalStyles.primaryColor
                : selectedColorTarget?.property === 'secondaryColor'
                  ? globalStyles.secondaryColor
                  : selectedColorTarget?.property === 'accentColor'
                    ? globalStyles.accentColor
                    : selectedColorTarget?.property === 'backgroundColor'
                      ? globalStyles.backgroundColor
                      : selectedColorTarget?.property === 'textColor'
                        ? globalStyles.textColor
                        : selectedColorTarget?.property === 'headingColor'
                          ? globalStyles.headingColor
                          : selectedTextElement?.styles?.color || '#FFFFFF'
            }
            onChange={handleColorChange}
          />
        </Box>
      </Popover>

      {/* ── Save Project Modal ──────────────────────────────────── */}
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
        {/* Modal header gradient strip */}
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

          {/* Saved project card — appears after a successful save */}
          {savedProjectCard && (
            <Box
              sx={{
                mt: 3,
                borderRadius: '14px',
                border: `1px solid ${alpha(G_START, 0.2)}`,
                overflow: 'hidden',
                bgcolor: alpha(G_START, 0.05),
              }}
            >
              {/* Thumbnail */}
              {savedProjectCard.thumbnail ? (
                <Box
                  component="img"
                  src={savedProjectCard.thumbnail}
                  alt="Website preview"
                  sx={{ width: '100%', display: 'block', maxHeight: 200, objectFit: 'cover' }}
                />
              ) : (
                <Box
                  sx={{
                    height: 140,
                    background: GRAD,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography sx={{ color: 'white', opacity: 0.6, fontSize: 40 }}>🌐</Typography>
                </Box>
              )}

              {/* Card body */}
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: G_END,
                      boxShadow: `0 0 6px ${G_END}`,
                    }}
                  />
                  <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 700 }}>
                    {savedProjectCard.name}
                  </Typography>
                  <Chip
                    label="Saved"
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.65rem',
                      bgcolor: alpha(G_END, 0.15),
                      color: G_END,
                      border: `1px solid ${alpha(G_END, 0.3)}`,
                    }}
                  />
                </Box>

                <Typography
                  variant="caption"
                  sx={{ color: alpha('#FFFFFF', 0.4), display: 'block', mb: 1 }}
                >
                  Publish link (available after publishing):
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: '8px 12px',
                    bgcolor: alpha(G_START, 0.1),
                    borderRadius: '8px',
                    border: `1px solid ${alpha(G_START, 0.2)}`,
                  }}
                >
                  <LinkIcon sx={{ fontSize: 14, color: G_START, flexShrink: 0 }} />
                  <Typography
                    variant="caption"
                    sx={{
                      color: G_START,
                      wordBreak: 'break-all',
                      fontFamily: 'monospace',
                      fontSize: '0.72rem',
                    }}
                  >
                    {`${window.location.origin}/preview?id=${savedProjectCard.id}&published=true`}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
          <Button
            onClick={() => setSaveModalOpen(false)}
            sx={{ color: alpha('#FFFFFF', 0.6), '&:hover': { color: 'white' } }}
          >
            {savedProjectCard ? 'Close' : 'Cancel'}
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
            {saving ? 'Saving…' : savedProjectCard ? 'Save Again' : 'Save Project'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Publish Modal - New Database Publishing Modal */}
      {renderPublishModal()}

      {/* Publish Success Dialog */}
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
          <CheckCircleRounded sx={{ color: G_END }} />
          Website Published Successfully!
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.7)' }}>
            Your website has been saved to the database and is now live. Share this link with
            others:
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

      {/* ── My Projects Gallery Dialog ────────────────────────────────── */}
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
            maxHeight: '90vh',
          },
        }}
      >
        <Box sx={{ height: 4, background: GRAD }} />
        <DialogTitle
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 3 }}
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
              <PhotoLibrary sx={{ fontSize: 18, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, lineHeight: 1.2 }}>
                My Projects
              </Typography>
              <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.45) }}>
                {allProjects.length} saved project{allProjects.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={() => setShowProjectsGallery(false)}
            sx={{ color: alpha('#FFFFFF', 0.6) }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pb: 3 }}>
          {allProjects.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography sx={{ fontSize: 56, mb: 2 }}>🗂️</Typography>
              <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                No saved projects yet
              </Typography>
              <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                Click Save in the editor and name your project to see it here
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3} sx={{ mt: 0.5 }}>
              {allProjects.map((project) => {
                const thumbnail = generateThumbnailDataUrl(project.styles || {});
                const pageCount = project.pages?.length || 1;
                const lastEdited = project.lastEdited
                  ? new Date(project.lastEdited).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : '—';
                return (
                  <Grid item xs={12} sm={6} md={4} key={project.id}>
                    <Card
                      sx={{
                        bgcolor: alpha('#FFFFFF', 0.04),
                        border: `1px solid ${alpha('#FFFFFF', 0.1)}`,
                        borderRadius: '16px',
                        overflow: 'hidden',
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          borderColor: alpha(G_START, 0.4),
                          boxShadow: `0 12px 32px ${alpha(G_START, 0.15)}`,
                        },
                      }}
                    >
                      {/* Thumbnail */}
                      {thumbnail ? (
                        <Box
                          component="img"
                          src={thumbnail}
                          alt={project.name}
                          sx={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }}
                        />
                      ) : (
                        <Box
                          sx={{
                            height: 140,
                            background: GRAD,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography sx={{ fontSize: 40 }}>🌐</Typography>
                        </Box>
                      )}

                      <CardContent sx={{ pb: 1 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}
                          noWrap
                        >
                          {project.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                          <Chip
                            label={project.status === 'published' ? 'Published' : 'Draft'}
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: '0.62rem',
                              bgcolor:
                                project.status === 'published'
                                  ? alpha(G_END, 0.15)
                                  : alpha('#FFFFFF', 0.08),
                              color: project.status === 'published' ? G_END : alpha('#FFFFFF', 0.5),
                            }}
                          />
                          <Chip
                            label={`${pageCount} page${pageCount !== 1 ? 's' : ''}`}
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: '0.62rem',
                              bgcolor: alpha(G_START, 0.1),
                              color: G_START,
                            }}
                          />
                        </Box>
                        <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.35) }}>
                          Last edited {lastEdited}
                        </Typography>
                      </CardContent>

                      <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Preview />}
                          onClick={() => setGalleryPreviewProject(project)}
                          sx={{
                            color: 'white',
                            borderColor: alpha('#FFFFFF', 0.2),
                            flex: 1,
                            fontSize: '0.75rem',
                          }}
                        >
                          Preview
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<Brush />}
                          onClick={() => handleOpenProjectInEditor(project)}
                          sx={{ background: GRAD, flex: 1, fontSize: '0.75rem' }}
                        >
                          Open
                        </Button>
                        <Tooltip title="Delete project">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteProject(project.id)}
                            sx={{
                              color: '#ff4444',
                              border: `1px solid ${alpha('#ff4444', 0.3)}`,
                              borderRadius: '8px',
                              p: '5px',
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Gallery Preview Dialog ────────────────────────────────────── */}
      <Dialog
        open={Boolean(galleryPreviewProject)}
        onClose={() => setGalleryPreviewProject(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#0A0F1A',
            backgroundImage: 'none',
            borderRadius: '20px',
            border: `1px solid ${alpha(G_START, 0.2)}`,
            color: 'white',
            overflow: 'hidden',
          },
        }}
      >
        {galleryPreviewProject && (
          <>
            <Box sx={{ height: 4, background: GRAD }} />
            <DialogTitle
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                Preview — {galleryPreviewProject.name}
              </Typography>
              <IconButton
                onClick={() => setGalleryPreviewProject(null)}
                sx={{ color: alpha('#FFFFFF', 0.6) }}
              >
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              {/* Colour preview strip */}
              {galleryPreviewProject.styles && (
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  {['primaryColor', 'secondaryColor', 'accentColor', 'backgroundColor'].map(
                    (key) =>
                      galleryPreviewProject.styles[key] && (
                        <Tooltip
                          key={key}
                          title={`${key.replace('Color', '')}: ${galleryPreviewProject.styles[key]}`}
                        >
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: galleryPreviewProject.styles[key],
                              borderRadius: '8px',
                              border: `1px solid ${alpha('#FFFFFF', 0.2)}`,
                            }}
                          />
                        </Tooltip>
                      )
                  )}
                  <Typography
                    variant="caption"
                    sx={{ color: alpha('#FFFFFF', 0.4), alignSelf: 'center', ml: 1 }}
                  >
                    {galleryPreviewProject.styles.fontFamily?.split(',')[0] || 'Default font'}
                  </Typography>
                </Box>
              )}

              {/* Thumbnail */}
              {(() => {
                const thumb = generateThumbnailDataUrl(galleryPreviewProject.styles || {});
                return thumb ? (
                  <Box
                    component="img"
                    src={thumb}
                    alt="preview"
                    sx={{
                      width: '100%',
                      borderRadius: '12px',
                      display: 'block',
                      mb: 2,
                      border: `1px solid ${alpha('#FFFFFF', 0.1)}`,
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 200,
                      borderRadius: '12px',
                      background: GRAD,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    <Typography sx={{ fontSize: 48 }}>🌐</Typography>
                  </Box>
                );
              })()}

              {/* Stats */}
              <Grid container spacing={2}>
                {[
                  { label: 'Components', value: galleryPreviewProject.components?.length || 0 },
                  {
                    label: 'Text Elements',
                    value: galleryPreviewProject.textElements?.length || 0,
                  },
                  { label: 'Images', value: galleryPreviewProject.uploadedImages?.length || 0 },
                  { label: 'Pages', value: galleryPreviewProject.pages?.length || 1 },
                ].map(({ label, value }) => (
                  <Grid item xs={6} sm={3} key={label}>
                    <Box
                      sx={{
                        textAlign: 'center',
                        p: 2,
                        bgcolor: alpha('#FFFFFF', 0.04),
                        borderRadius: '12px',
                        border: `1px solid ${alpha('#FFFFFF', 0.08)}`,
                      }}
                    >
                      <Typography variant="h5" sx={{ color: G_START, fontWeight: 700 }}>
                        {value}
                      </Typography>
                      <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                        {label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
              <Button
                onClick={() => setGalleryPreviewProject(null)}
                sx={{ color: alpha('#FFFFFF', 0.6) }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                startIcon={<Brush />}
                onClick={() => {
                  handleOpenProjectInEditor(galleryPreviewProject);
                  setGalleryPreviewProject(null);
                }}
                sx={{ background: GRAD, borderRadius: '10px', fontWeight: 700, px: 3 }}
              >
                Open in Editor
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ── Add Page Dialog ───────────────────────────────────────────── */}
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
