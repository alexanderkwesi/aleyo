// Integrations.js
import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Switch,
  Chip,
  TextField,
  InputAdornment,
  Avatar,
  LinearProgress,
  Alert,
  Snackbar,
  alpha,
  useTheme,
  Divider,
} from '@mui/material';
import {
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
  CheckCircle,
  Link as LinkIcon,
  Language,
  MusicNote,
  Chat,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const G_START = '#4F6EF7';
const G_MID = '#2DBCB6';
const G_END = '#3ED67C';
const GRAD = `linear-gradient(135deg, ${G_START} 0%, ${G_MID} 50%, ${G_END} 100%)`;

const integrationsList = [
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

const categories = [
  { value: 'all', label: 'All' },
  { value: 'payments', label: 'Payments' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'social', label: 'Social' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'storage', label: 'Storage' },
  { value: 'security', label: 'Security' },
  { value: 'ai', label: 'AI' },
];

const Integrations = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [integrations, setIntegrations] = useState(integrationsList);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleToggle = (id) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id ? { ...integration, connected: !integration.connected } : integration
      )
    );
    const integration = integrations.find((i) => i.id === id);
    const newStatus = !integration.connected;
    setSnackbar({
      open: true,
      message: `${integration.name} ${newStatus ? 'connected' : 'disconnected'} successfully!`,
      severity: newStatus ? 'success' : 'info',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const connectedCount = integrations.filter((i) => i.connected).length;
  const totalCount = integrations.length;

  return (
    <Box sx={{ bgcolor: '#080C14', minHeight: '100vh', pt: 2 }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
            Integrations
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>
            Connect your favorite tools and services to enhance your website
          </Typography>
        </motion.div>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search integrations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'rgba(255,255,255,0.5)' }} />
                  </InputAdornment>
                ),
                sx: {
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.2)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: G_START,
                  },
                },
              }}
              sx={{ '& input': { color: 'white' } }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {categories.map((cat) => (
                <Chip
                  key={cat.value}
                  label={cat.label}
                  onClick={() => setSelectedCategory(cat.value)}
                  sx={{
                    bgcolor:
                      selectedCategory === cat.value
                        ? alpha(G_START, 0.2)
                        : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${selectedCategory === cat.value ? G_START : 'rgba(255,255,255,0.1)'}`,
                    color: selectedCategory === cat.value ? G_START : 'rgba(255,255,255,0.7)',
                    '&:hover': {
                      bgcolor: alpha(G_START, 0.1),
                    },
                  }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>

        <Card
          sx={{
            mb: 4,
            background: `linear-gradient(135deg, ${alpha(G_START, 0.1)} 0%, ${alpha(G_MID, 0.1)} 100%)`,
            border: `1px solid ${alpha(G_START, 0.2)}`,
            borderRadius: '16px',
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ color: 'white' }}>
                  Integration Status
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  {connectedCount} of {totalCount} integrations connected
                </Typography>
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 300 } }}>
                <LinearProgress
                  variant="determinate"
                  value={(connectedCount / totalCount) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '& .MuiLinearProgress-bar': { background: GRAD },
                  }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {filteredIntegrations.map((integration, index) => (
            <Grid item xs={12} sm={6} md={4} key={integration.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  sx={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${alpha(integration.color, 0.2)}`,
                    borderRadius: '16px',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      borderColor: alpha(integration.color, 0.5),
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 2,
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: alpha(integration.color, 0.2),
                          width: 48,
                          height: 48,
                          color: integration.color,
                        }}
                      >
                        {integration.icon}
                      </Avatar>
                      {integration.popular && (
                        <Chip
                          label="Popular"
                          size="small"
                          sx={{
                            bgcolor: alpha(G_START, 0.2),
                            color: G_START,
                            fontSize: '0.7rem',
                          }}
                        />
                      )}
                    </Box>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: 'white', mb: 0.5 }}>
                      {integration.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2 }}>
                      {integration.description}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                        {integration.connected ? 'Connected' : 'Not connected'}
                      </Typography>
                      <Switch
                        checked={integration.connected}
                        onChange={() => handleToggle(integration.id)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: G_START,
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: G_START,
                          },
                        }}
                      />
                    </Box>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={integration.connected ? <LinkIcon /> : <Api />}
                      onClick={() => handleToggle(integration.id)}
                      sx={{
                        borderColor: 'rgba(255,255,255,0.2)',
                        color: integration.connected ? G_MID : 'white',
                        '&:hover': {
                          borderColor: integration.color,
                          bgcolor: alpha(integration.color, 0.1),
                        },
                      }}
                    >
                      {integration.connected ? 'Configure' : 'Connect'}
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {filteredIntegrations.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>
              No integrations found. Try adjusting your search.
            </Typography>
          </Box>
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%', bgcolor: '#1A1F2A', color: 'white' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Integrations;
