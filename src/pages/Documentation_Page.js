// DocumentationPage.js
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  alpha,
  useTheme,
  Stack,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  ExpandMore,
  DesignServices,
  IntegrationInstructions,
  Dashboard,
  ColorLens,
  Code,
  Storage,
  Publish,
  Preview,
  Save,
  Undo,
  Redo,
  SmartToy,
  Payment,
  Security,
  CloudUpload,
  WhatsApp,
  Instagram,
  Facebook,
  Twitter,
  MenuBook,
  AutoAwesome,
  Brush,
  GridOn,
  TextFields,
  PhotoLibrary,
  ShoppingCart,
  ContactMail,
  Analytics,
  Close,
  HelpOutline,
  CheckCircle,
  Warning,
  Info,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const G_START = '#4F6EF7';
const G_MID = '#2DBCB6';
const G_END = '#3ED67C';
const GRAD = `linear-gradient(135deg, ${G_START} 0%, ${G_MID} 50%, ${G_END} 100%)`;

const DocumentationPage = () => {
  const theme = useTheme();
  const [expandedSection, setExpandedSection] = useState('getting-started');
  const [codeDialogOpen, setCodeDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleSectionChange = (section) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? section : false);
  };

  const sections = [
    {
      id: 'getting-started',
      title: '🚀 Getting Started',
      icon: <AutoAwesome />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            The Design Studio is a powerful drag-and-drop website builder that lets you create
            professional websites without writing code. Here's how to get started:
          </Typography>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: alpha(G_START, 0.05), borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  📋 Prerequisites
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CheckCircle sx={{ color: G_END }} /></ListItemIcon>
                    <ListItemText primary="Create an account or log in" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle sx={{ color: G_END }} /></ListItemIcon>
                    <ListItemText primary="Navigate to Design Studio from the dashboard" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle sx={{ color: G_END }} /></ListItemIcon>
                    <ListItemText primary="Choose a template or start from scratch" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: alpha(G_START, 0.05), borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  🎯 First Steps
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><span>1️⃣</span></ListItemIcon>
                    <ListItemText primary="Click 'New Project' to create a website" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><span>2️⃣</span></ListItemIcon>
                    <ListItemText primary="Drag text styles or components to canvas" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><span>3️⃣</span></ListItemIcon>
                    <ListItemText primary="Customize colors, fonts, and layout" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><span>4️⃣</span></ListItemIcon>
                    <ListItemText primary="Save your project and publish when ready" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mt: 3, bgcolor: alpha(G_START, 0.1) }}>
            <Typography variant="body2">
              💡 <strong>Pro Tip:</strong> Use the voice assistant (click the mic icon) to give
              commands like "Create a business website" or "Add a hero section" — no typing needed!
            </Typography>
          </Alert>
        </Box>
      ),
    },
    {
      id: 'components',
      title: '🧩 Components Library',
      icon: <DesignServices />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Components are pre-built sections you can add to your website. Each component is fully
            customizable.
          </Typography>

          <TableContainer component={Paper} sx={{ bgcolor: alpha('#FFFFFF', 0.03), mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Component</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Customizable</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { name: 'Hero', icon: '🎯', desc: 'Main banner with title, subtitle, and CTA button', custom: 'Title, subtitle, button text, background image' },
                  { name: 'Features', icon: '✨', desc: 'Grid layout showcasing your services/features', custom: 'Number of features, icons, descriptions, images' },
                  { name: 'Gallery', icon: '🖼️', desc: 'Image grid for portfolios or product showcases', custom: 'Images, titles, descriptions, layout style' },
                  { name: 'Contact', icon: '📧', desc: 'Contact form with address and contact info', custom: 'Form fields, address, email, phone number' },
                  { name: 'Pricing', icon: '💰', desc: 'Pricing tables for subscription plans', custom: 'Plan names, prices, features, number of plans' },
                ].map((comp) => (
                  <TableRow key={comp.name}>
                    <TableCell sx={{ color: 'white' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{comp.icon}</span> {comp.name}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>{comp.desc}</TableCell>
                    <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>{comp.custom}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="subtitle1" gutterBottom>
            📍 How to add components:
          </Typography>
          <ol style={{ color: alpha('#FFFFFF', 0.7), marginBottom: 16 }}>
            <li>Open the left sidebar (Components tab)</li>
            <li>Click on any component type (Hero, Features, Gallery, etc.)</li>
            <li>The component appears on your canvas</li>
            <li>Click the component to edit its properties in the right sidebar</li>
            <li>Double-click text inside components to edit directly</li>
          </ol>

          <Alert severity="success" sx={{ bgcolor: alpha(G_END, 0.1) }}>
            <Typography variant="body2">
              🎨 <strong>Tip:</strong> You can rearrange components by dragging them (enable Drag & Drop mode
              in the Text Styles tab).
            </Typography>
          </Alert>
        </Box>
      ),
    },
    {
      id: 'text-styles',
      title: '✍️ Text Styles & Editing',
      icon: <TextFields />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Add and customize text elements anywhere on your canvas. Choose from heading styles,
            paragraphs, links, and more.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  📝 Available Text Styles
                </Typography>
                <List dense>
                  {['Heading 1-6', 'Paragraph', 'Inline Text', 'Div Block', 'Link'].map((style) => (
                    <ListItem key={style}>
                      <ListItemIcon><TextFields sx={{ color: G_START }} /></ListItemIcon>
                      <ListItemText primary={style} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  🎨 Text Customization
                </Typography>
                <List dense>
                  <ListItem><ListItemIcon><span>🔤</span></ListItemIcon><ListItemText primary="Font size & family" /></ListItem>
                  <ListItem><ListItemIcon><span>💪</span></ListItemIcon><ListItemText primary="Bold / Italic / Underline" /></ListItem>
                  <ListItem><ListItemIcon><span>🎨</span></ListItemIcon><ListItemText primary="Text & background color" /></ListItem>
                  <ListItem><ListItemIcon><span>📐</span></ListItemIcon><ListItemText primary="Alignment (left/center/right)" /></ListItem>
                  <ListItem><ListItemIcon><span>🔗</span></ListItemIcon><ListItemText primary="Link URLs (for anchor tags)" /></ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            📍 How to add text:
          </Typography>
          <ol style={{ color: alpha('#FFFFFF', 0.7), marginBottom: 16 }}>
            <li>Go to the Text Styles tab in left sidebar</li>
            <li>Click on any text style (H1, Paragraph, etc.)</li>
            <li>The text appears on your canvas</li>
            <li>Double-click the text to edit content</li>
            <li>Click the text to open properties in right sidebar for advanced styling</li>
          </ol>

          <Alert severity="info" sx={{ bgcolor: alpha(G_START, 0.1) }}>
            <Typography variant="body2">
              🔄 <strong>Drag & Drop Mode:</strong> Toggle the drag handle icon to move text elements
              anywhere on the canvas by clicking and dragging.
            </Typography>
          </Alert>
        </Box>
      ),
    },
    {
      id: 'images',
      title: '🖼️ Image Management',
      icon: <PhotoLibrary />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Upload, manage, and customize images for your website. Two upload modes are available:
          </Typography>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: alpha(G_START, 0.05), borderRadius: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  📎 Mock Mode (Development)
                </Typography>
                <Typography variant="body2" paragraph>
                  Paste any image URL to quickly add placeholder images without uploading files.
                  Perfect for rapid prototyping.
                </Typography>
                <Chip label="Example: https://picsum.photos/800/600" size="small" sx={{ bgcolor: alpha('#FFFFFF', 0.1) }} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: alpha(G_END, 0.05), borderRadius: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  💾 Production Mode (Database)
                </Typography>
                <Typography variant="body2">
                  Upload actual image files that are saved to your database. Supports JPG, PNG, GIF,
                  SVG, and WebP formats with no file limits.
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Typography variant="subtitle1" gutterBottom>
            🖌️ Image Editing Features:
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { icon: <AspectRatioIcon />, name: 'Resize', desc: 'Adjust width & height' },
              { icon: <RotateIcon />, name: 'Rotate', desc: '90° rotations' },
              { icon: <FlipIcon />, name: 'Flip', desc: 'Horizontal & vertical' },
              { icon: <FilterIcon />, name: 'Filters', desc: 'Brightness, contrast, blur, grayscale' },
              { icon: <CropIcon />, name: 'Presets', desc: 'Square, circle, hero, thumbnail' },
            ].map((feature) => (
              <Grid item xs={6} sm={4} key={feature.name}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 1 }}>
                  {feature.icon}
                  <Box>
                    <Typography variant="body2" fontWeight="bold">{feature.name}</Typography>
                    <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>{feature.desc}</Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Alert severity="warning" sx={{ bgcolor: alpha('#FFA726', 0.1) }}>
            <Typography variant="body2">
              ⚠️ <strong>Note:</strong> Images added to components (Hero, Features, Gallery) are linked, not
              embedded. To add standalone images, drag from the image library to canvas.
            </Typography>
          </Alert>
        </Box>
      ),
    },
    {
      id: 'themes-colors',
      title: '🎨 Themes & Colors',
      icon: <ColorLens />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Transform your website's look instantly with pre-designed themes or create your own
            custom color scheme.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  🌈 Pre-built Themes (20+)
                </Typography>
                <List dense>
                  {['Dark Magic', 'Ocean Deep', 'Forest Mist', 'Sunset Blaze', 'Cyber Neon', 'Midnight Sapphire'].map((theme) => (
                    <ListItem key={theme} dense>
                      <ListItemIcon><ColorLens sx={{ color: G_START }} /></ListItemIcon>
                      <ListItemText primary={theme} />
                    </ListItem>
                  ))}
                </List>
                <Button size="small" sx={{ color: G_START }}>View all 20+ themes →</Button>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  🎨 Custom Color Roles
                </Typography>
                <List dense>
                  <ListItem><ListItemIcon><Box sx={{ width: 16, height: 16, bgcolor: G_START, borderRadius: 1 }} /></ListItemIcon><ListItemText primary="Primary Color (buttons, links, accents)" /></ListItem>
                  <ListItem><ListItemIcon><Box sx={{ width: 16, height: 16, bgcolor: G_MID, borderRadius: 1 }} /></ListItemIcon><ListItemText primary="Secondary Color (gradients, hover states)" /></ListItem>
                  <ListItem><ListItemIcon><Box sx={{ width: 16, height: 16, bgcolor: G_END, borderRadius: 1 }} /></ListItemIcon><ListItemText primary="Accent Color (highlights, special elements)" /></ListItem>
                  <ListItem><ListItemIcon><Box sx={{ width: 16, height: 16, bgcolor: '#080C14', borderRadius: 1, border: '1px solid white' }} /></ListItemIcon><ListItemText primary="Background Color" /></ListItem>
                  <ListItem><ListItemIcon><Box sx={{ width: 16, height: 16, bgcolor: '#FFFFFF', borderRadius: 1 }} /></ListItemIcon><ListItemText primary="Text & Heading Colors" /></ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            📍 How to apply themes:
          </Typography>
          <ol style={{ color: alpha('#FFFFFF', 0.7) }}>
            <li>Open the Themes tab in left sidebar</li>
            <li>Browse through available themes (each shows a preview)</li>
            <li>Click "Apply Theme" on any theme card</li>
            <li>The entire website transforms instantly</li>
            <li>For custom colors, use the Colors tab with color picker or palette swatches</li>
          </ol>
        </Box>
      ),
    },
    {
      id: 'integrations',
      title: '🔌 Integrations',
      icon: <IntegrationInstructions />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Connect your website with popular third-party services for payments, email marketing,
            analytics, and more.
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { cat: 'Payments', services: 'Stripe, PayPal, Square', icon: <Payment /> },
              { cat: 'Marketing', services: 'Mailchimp, SendGrid, ConvertKit', icon: <MailIcon /> },
              { cat: 'Social', services: 'Instagram, WhatsApp, Discord, Facebook', icon: <Instagram /> },
              { cat: 'Analytics', services: 'Google Analytics, Facebook Pixel', icon: <Analytics /> },
              { cat: 'Storage', services: 'AWS S3, Google Drive', icon: <CloudUpload /> },
              { cat: 'AI', services: 'OpenAI API', icon: <SmartToy /> },
            ].map((item) => (
              <Grid item xs={6} sm={4} key={item.cat}>
                <Paper sx={{ p: 1.5, bgcolor: alpha('#FFFFFF', 0.03), textAlign: 'center' }}>
                  {item.icon}
                  <Typography variant="body2" fontWeight="bold">{item.cat}</Typography>
                  <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>{item.services}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Typography variant="subtitle1" gutterBottom>
            📍 How to add integrations:
          </Typography>
          <ol style={{ color: alpha('#FFFFFF', 0.7), marginBottom: 16 }}>
            <li>Go to the Integrations tab in left sidebar</li>
            <li>Click on any service card (Forms, Payment, Email, etc.)</li>
            <li>Select a provider from the dropdown</li>
            <li>Enter your API key or access token</li>
            <li>Click "Add Integration" to activate</li>
          </ol>

          <Alert severity="info" sx={{ bgcolor: alpha(G_START, 0.1) }}>
            <Typography variant="body2">
              🔐 <strong>Security:</strong> API keys are stored locally in your browser. For production,
              we recommend using environment variables and backend proxy endpoints.
            </Typography>
          </Alert>
        </Box>
      ),
    },
    {
      id: 'voice-assistant',
      title: '🎤 Voice Assistant',
      icon: <SmartToy />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Nova AI is your voice-powered design assistant. Speak commands to build websites
            without touching your keyboard.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <Paper sx={{ p: 2, bgcolor: alpha(G_START, 0.05), borderRadius: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  🎙️ Voice Commands Examples
                </Typography>
                <List dense>
                  <ListItem><ListItemIcon><CheckCircle sx={{ color: G_END }} /></ListItemIcon><ListItemText primary="Create a business website" /></ListItem>
                  <ListItem><ListItemIcon><CheckCircle sx={{ color: G_END }} /></ListItemIcon><ListItemText primary="Add a hero section" /></ListItem>
                  <ListItem><ListItemIcon><CheckCircle sx={{ color: G_END }} /></ListItemIcon><ListItemText primary="Change theme to dark" /></ListItem>
                  <ListItem><ListItemIcon><CheckCircle sx={{ color: G_END }} /></ListItemIcon><ListItemText primary="Make it responsive" /></ListItem>
                  <ListItem><ListItemIcon><CheckCircle sx={{ color: G_END }} /></ListItemIcon><ListItemText primary="Add animations everywhere" /></ListItem>
                  <ListItem><ListItemIcon><CheckCircle sx={{ color: G_END }} /></ListItemIcon><ListItemText primary="Improve design" /></ListItem>
                  <ListItem><ListItemIcon><CheckCircle sx={{ color: G_END }} /></ListItemIcon><ListItemText primary="Preview" /></ListItem>
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={7}>
              <Paper sx={{ p: 2, bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  ✨ AI Smart Suggestions
                </Typography>
                <Typography variant="body2" paragraph>
                  Nova analyzes your current design and suggests improvements:
                </Typography>
                <List dense>
                  <ListItem><ListItemIcon><AutoAwesome sx={{ color: G_START }} /></ListItemIcon><ListItemText primary="Add more sections when page is sparse" /></ListItem>
                  <ListItem><ListItemIcon><AutoAwesome sx={{ color: G_START }} /></ListItemIcon><ListItemText primary="Try different color schemes" /></ListItem>
                  <ListItem><ListItemIcon><AutoAwesome sx={{ color: G_START }} /></ListItemIcon><ListItemText primary="Add call-to-action buttons" /></ListItem>
                </List>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2">
                  💡 <strong>Two voice engines:</strong> Web (built-in browser) or Azure (more accurate,
                  requires API key).
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Alert severity="success" sx={{ mt: 3, bgcolor: alpha(G_END, 0.1) }}>
            <Typography variant="body2">
              🚀 <strong>Pro Tip:</strong> Use the typing mode if you're in a noisy environment or
              prefer typing. All voice commands work as typed commands too!
            </Typography>
          </Alert>
        </Box>
      ),
    },
    {
      id: 'projects',
      title: '💾 Projects & Saving',
      icon: <Storage />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Save, manage, and publish your websites. All projects are stored locally in your browser
            and can be exported as JSON backups.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  💾 Saving & Auto-Save
                </Typography>
                <List dense>
                  <ListItem><ListItemIcon><Save sx={{ color: G_START }} /></ListItemIcon><ListItemText primary="Manual Save: Click Save button, name your project" /></ListItem>
                  <ListItem><ListItemIcon><Undo sx={{ color: G_MID }} /></ListItemIcon><ListItemText primary="Auto-Save: Content saves every 1.5 seconds automatically" /></ListItem>
                  <ListItem><ListItemIcon><HistoryIcon /></ListItemIcon><ListItemText primary="Undo/Redo: Use buttons or Ctrl+Z / Ctrl+Y" /></ListItem>
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  📁 Project Management
                </Typography>
                <List dense>
                  <ListItem><ListItemIcon><span>📋</span></ListItemIcon><ListItemText primary="My Projects gallery shows all saved projects" /></ListItem>
                  <ListItem><ListItemIcon><span>📤</span></ListItemIcon><ListItemText primary="Export as JSON for backup" /></ListItem>
                  <ListItem><ListItemIcon><span>📥</span></ListItemIcon><ListItemText primary="Import from JSON to restore" /></ListItem>
                  <ListItem><ListItemIcon><span>🗑️</span></ListItemIcon><ListItemText primary="Delete projects you no longer need" /></ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            📍 How to save and manage projects:
          </Typography>
          <ol style={{ color: alpha('#FFFFFF', 0.7) }}>
            <li>Click the "Save" button in top toolbar</li>
            <li>Enter a project name and confirm</li>
            <li>Project appears in "My Projects" gallery</li>
            <li>Click "My Projects" button to view all saved projects</li>
            <li>Use preview, edit, duplicate, or delete from the gallery</li>
          </ol>
        </Box>
      ),
    },
    {
      id: 'publishing',
      title: '🌐 Publishing',
      icon: <Publish />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Publish your website to make it live on the web with a permanent, shareable URL.
          </Typography>

          <Paper sx={{ p: 3, bgcolor: alpha(G_START, 0.05), borderRadius: 2, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              📝 Publishing Steps
            </Typography>
            <ol style={{ color: alpha('#FFFFFF', 0.7) }}>
              <li>Click the "Publish" button in the top toolbar</li>
              <li>Enter a website name (required)</li>
              <li>Optional: Custom URL slug (e.g., "my-awesome-site")</li>
              <li>Review the publish summary (components, images, etc.)</li>
              <li>Click "Publish Website"</li>
              <li>Copy the generated link to share with others</li>
            </ol>
          </Paper>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Alert severity="success" sx={{ bgcolor: alpha(G_END, 0.1) }}>
                <Typography variant="body2">
                  🔗 <strong>Published URLs:</strong> Your website gets a permanent link at
                  <code style={{ background: alpha('#FFFFFF', 0.1), padding: '2px 6px', borderRadius: 4, marginLeft: 8 }}>
                    /p/your-slug
                  </code>
                </Typography>
              </Alert>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Alert severity="info" sx={{ bgcolor: alpha(G_START, 0.1) }}>
                <Typography variant="body2">
                  🔄 <strong>Updates:</strong> You can edit and republish anytime. The published URL
                  stays the same.
                </Typography>
              </Alert>
            </Grid>
          </Grid>

          <Alert severity="warning" sx={{ mt: 3, bgcolor: alpha('#FFA726', 0.1) }}>
            <Typography variant="body2">
              ⚠️ <strong>Note:</strong> Currently, published websites are stored in your browser's
              localStorage. For permanent hosting, we recommend exporting your site code and deploying
              to a hosting provider.
            </Typography>
          </Alert>
        </Box>
      ),
    },
    {
      id: 'shortcuts',
      title: '⌨️ Keyboard Shortcuts',
      icon: <MenuBook />,
      content: (
        <Box>
          <TableContainer component={Paper} sx={{ bgcolor: alpha('#FFFFFF', 0.03) }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Shortcut</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { action: 'Undo', shortcut: 'Ctrl + Z (Cmd + Z on Mac)' },
                  { action: 'Redo', shortcut: 'Ctrl + Y / Ctrl + Shift + Z' },
                  { action: 'Save Project', shortcut: 'Ctrl + S' },
                  { action: 'Preview', shortcut: 'Ctrl + P' },
                  { action: 'Toggle Code View', shortcut: 'Ctrl + K' },
                  { action: 'Edit selected text', shortcut: 'Double-click or Enter' },
                  { action: 'Delete selected element', shortcut: 'Delete / Backspace' },
                ].map((item) => (
                  <TableRow key={item.action}>
                    <TableCell sx={{ color: 'white' }}>{item.action}</TableCell>
                    <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}><Chip label={item.shortcut} size="small" sx={{ bgcolor: alpha('#FFFFFF', 0.1) }} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ),
    },
    {
      id: 'faq',
      title: '❓ FAQ & Troubleshooting',
      icon: <HelpOutline />,
      content: (
    <>    
        <Box>
          <Accordion sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
            <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'white' }} />}>
              <Typography sx={{ color: 'white' }}>How do I add custom CSS/JavaScript?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ color: alpha('#FFFFFF', 0.7) }}>
                Use the Code View button (<></> icon) in the toolbar to see the generated HTML/CSS.
                You can copy this code and add your custom scripts in a separate editor.
                For advanced users, you can also inject code via integrations.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
            <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'white' }} />}>
              <Typography sx={{ color: 'white' }}>Why aren't my images saving?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ color: alpha('#FFFFFF', 0.7) }}>
                Make sure you're using Production Mode for file uploads. Mock Mode URLs are
                saved as references. Also check that your browser's localStorage isn't full
                (clear some old projects if needed).
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
            <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'white' }} />}>
              <Typography sx={{ color: 'white' }}>How do I create multiple pages?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ color: alpha('#FFFFFF', 0.7) }}>
                Click the "+" icon next to the page tabs above the canvas. Enter a page name and
                click "Add Page". Each page has its own set of components, text, and images.
                Use the page tabs to switch between pages.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
            <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'white' }} />}>
              <Typography sx={{ color: 'white' }}>Can I collaborate with team members?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ color: alpha('#FFFFFF', 0.7) }}>
                Currently, collaboration is single-user. However, you can export your project as JSON
                and share it with team members. They can import it into their own Design Studio.
                Enterprise plan includes team collaboration features.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
            <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'white' }} />}>
              <Typography sx={{ color: 'white' }}>Voice assistant not working?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ color: alpha('#FFFFFF', 0.7) }}>
                Check your microphone permissions in browser settings. Try switching to typing mode
                if voice continues to fail. Also ensure you're using a supported browser (Chrome,
                Edge, or Safari).
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
    </>
      ),
    },
  ];

  const tabLabels = ['Overview', 'Components', 'Voice AI', 'Integrations', 'Shortcuts'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <Box>
            <Typography variant="body1" paragraph>
              The Aleyo Design Studio is a complete website builder with drag-and-drop functionality,
              AI voice assistance, and powerful customization tools. This documentation covers all
              features to help you create stunning websites.
            </Typography>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              {sections.slice(0, 4).map((section) => (
                <Grid item xs={12} sm={6} key={section.id}>
                  <Card sx={{ bgcolor: alpha('#FFFFFF', 0.03), cursor: 'pointer', '&:hover': { bgcolor: alpha(G_START, 0.1) } }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        {section.icon}
                        <Typography variant="h6" sx={{ color: 'white' }}>{section.title}</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.6) }}>
                        {section.content.props.children[0]?.props?.children || 'Learn more about this feature'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="body1" paragraph>
              Components are pre-designed sections you can add to your website. Each component is
              fully customizable through the properties panel.
            </Typography>
            <TableContainer component={Paper} sx={{ bgcolor: alpha('#FFFFFF', 0.03), mb: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'white' }}>Component</TableCell>
                    <TableCell sx={{ color: 'white' }}>Best For</TableCell>
                    <TableCell sx={{ color: 'white' }}>Key Properties</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow><TableCell sx={{ color: 'white' }}>Hero</TableCell><TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>Homepage main banner</TableCell><TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>Title, subtitle, CTA, image</TableCell></TableRow>
                  <TableRow><TableCell sx={{ color: 'white' }}>Features</TableCell><TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>Showcasing services</TableCell><TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>3+ features with icons/images</TableCell></TableRow>
                  <TableRow><TableCell sx={{ color: 'white' }}>Gallery</TableCell><TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>Portfolios, products</TableCell><TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>Images, titles, descriptions</TableCell></TableRow>
                  <TableRow><TableCell sx={{ color: 'white' }}>Contact</TableCell><TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>Lead generation</TableCell><TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>Form fields, address, contact info</TableCell></TableRow>
                  <TableRow><TableCell sx={{ color: 'white' }}>Pricing</TableCell><TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>Subscription plans</TableCell><TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>Plan names, prices, features</TableCell></TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="body1" paragraph>
              Nova AI is your voice-powered assistant. Speak naturally to create and modify your website.
            </Typography>
            <Paper sx={{ p: 3, bgcolor: alpha(G_START, 0.05), borderRadius: 2, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>🎤 Example Voice Commands</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {['Create a business website', 'Add a hero section', 'Make it dark mode', 'Add pricing tables', 'Improve design', 'Make responsive', 'Add animations'].map(cmd => (
                  <Chip key={cmd} label={cmd} sx={{ bgcolor: alpha('#FFFFFF', 0.1), color: 'white' }} />
                ))}
              </Box>
            </Paper>
            <Alert severity="info">
              Click the microphone button to start speaking, or switch to typing mode for text commands.
            </Alert>
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography variant="body1" paragraph>
              Connect your website with popular services for payments, marketing, analytics, and more.
            </Typography>
            <Grid container spacing={2}>
              {[
                { name: 'Stripe', icon: <Payment />, category: 'Payments' },
                { name: 'Mailchimp', icon: <MailIcon />, category: 'Marketing' },
                { name: 'Google Analytics', icon: <Analytics />, category: 'Analytics' },
                { name: 'WhatsApp', icon: <WhatsApp />, category: 'Social' },
                { name: 'Instagram', icon: <Instagram />, category: 'Social' },
                { name: 'OpenAI', icon: <SmartToy />, category: 'AI' },
              ].map(integration => (
                <Grid item xs={6} sm={4} md={3} key={integration.name}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: alpha('#FFFFFF', 0.03) }}>
                    {integration.icon}
                    <Typography variant="body2">{integration.name}</Typography>
                    <Chip label={integration.category} size="small" sx={{ mt: 1, fontSize: '0.7rem' }} />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      case 4:
        return (
          <Box>
            <TableContainer component={Paper} sx={{ bgcolor: alpha('#FFFFFF', 0.03) }}>
              <Table>
                <TableHead>
                  <TableRow><TableCell sx={{ color: 'white' }}>Action</TableCell><TableCell sx={{ color: 'white' }}>Shortcut</TableCell></TableRow>
                </TableHead>
                <TableBody>
                  <TableRow><TableCell sx={{ color: 'white' }}>Undo</TableCell><TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>Ctrl+Z</TableCell></TableRow>
                  <TableRow><TableCell sx={{ color: 'white' }}>Redo</TableCell><TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>Ctrl+Y</TableCell></TableRow>
                  <TableRow><TableCell sx={{ color: 'white' }}>Save</TableCell><TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>Ctrl+S</TableCell></TableRow>
                  <TableRow><TableCell sx={{ color: 'white' }}>Preview</TableCell><TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>Ctrl+P</TableCell></TableRow>
                  <TableRow><TableCell sx={{ color: 'white' }}>Code View</TableCell><TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>Ctrl+K</TableCell></TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      default: return null;
    }
  };

  return (
    <Box sx={{ bgcolor: '#080C14', minHeight: '100vh', pt: 2 }}>
        <Box
        onClick={() => window.open('/dashboard')}
        sx={{
            display: 'inline-flex',
            alignItems: 'center',
            cursor: 'pointer',
            mb: 2, mx: 2,
            '&:hover': { opacity: 0.7 },
        }}
        >
        <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'white', }}>
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
              Design Studio
              <br />
              <span style={{ fontSize: '0.6em' }}>Documentation</span>
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                color: 'rgba(255,255,255,0.9)',
                maxWidth: 800,
                mx: 'auto',
              }}
            >
              Complete guide to building websites with drag-and-drop, AI voice assistant, and
              powerful customization tools
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 6 }}>
        {/* Quick Stats */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            { label: 'Components', value: '5+', icon: <DesignServices /> },
            { label: 'Text Styles', value: '10+', icon: <TextFields /> },
            { label: 'Themes', value: '20+', icon: <ColorLens /> },
            { label: 'Integrations', value: '15+', icon: <IntegrationInstructions /> },
          ].map((stat) => (
            <Grid item xs={6} sm={3} key={stat.label}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  {stat.icon}
                  <Typography variant="h4" sx={{ color: G_START, fontWeight: 700 }}>{stat.value}</Typography>
                </Box>
                <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.6) }}>{stat.label}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Tabs Navigation */}
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
            {tabLabels.map(label => <Tab key={label} label={label} />)}
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <Paper sx={{ p: 3, bgcolor: alpha('#FFFFFF', 0.02), borderRadius: 2, mb: 4 }}>
          {renderTabContent()}
        </Paper>

        {/* Full Documentation Accordions */}
        <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 700 }}>
          📚 Full Documentation
        </Typography>

        {sections.map((section) => (
          <Accordion
            key={section.id}
            expanded={expandedSection === section.id}
            onChange={handleSectionChange(section.id)}
            sx={{
              bgcolor: alpha('#FFFFFF', 0.02),
              mb: 2,
              borderRadius: '12px !important',
              '&:before': { display: 'none' },
              border: `1px solid ${alpha('#FFFFFF', 0.08)}`,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore sx={{ color: 'white' }} />}
              sx={{
                '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 1 },
              }}
            >
              {section.icon}
              <Typography variant="h6" sx={{ color: 'white' }}>
                {section.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ borderTop: `1px solid ${alpha('#FFFFFF', 0.08)}`, pt: 2 }}>
              {section.content}
            </AccordionDetails>
          </Accordion>
        ))}

        {/* Support Footer */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Divider sx={{ borderColor: alpha('#FFFFFF', 0.1), mb: 3 }} />
          <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.5) }}>
            Need additional help? Contact support at{' '}
            <span style={{ color: G_START }}>support@aleyo.com</span>
          </Typography>
          <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.3), display: 'block', mt: 1 }}>
            Version 1.0.0 | Last updated: January 2025
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

// Helper Icons (since some might not be imported)
const AspectRatioIcon = () => <span style={{ fontSize: 20 }}>📐</span>;
const RotateIcon = () => <span style={{ fontSize: 20 }}>🔄</span>;
const FlipIcon = () => <span style={{ fontSize: 20 }}>🪞</span>;
const FilterIcon = () => <span style={{ fontSize: 20 }}>🎨</span>;
const CropIcon = () => <span style={{ fontSize: 20 }}>✂️</span>;
const HistoryIcon = () => <span style={{ fontSize: 20 }}>⏪</span>;
const MailIcon = () => <span style={{ fontSize: 20 }}>📧</span>;

export default DocumentationPage;