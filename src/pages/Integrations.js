// Integrations.js - Complete Fixed Version
import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  MenuItem,
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
  Close,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const G_START = '#4F6EF7';
const G_MID = '#2DBCB6';
const G_END = '#3ED67C';
const GRAD = `linear-gradient(135deg, ${G_START} 0%, ${G_MID} 50%, ${G_END} 100%)`;

// Base URL for API - use the same port as your backend
const API_BASE = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

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
  const { user, token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [availableIntegrations, setAvailableIntegrations] = useState([]);
  const [connectedIntegrations, setConnectedIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [configDialog, setConfigDialog] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [configData, setConfigData] = useState({
    project_id: '',
    api_key: '',
    settings: {},
    is_active: true,
  });
  const [projects, setProjects] = useState([]);

  // Fetch available integrations and user's connected integrations
  useEffect(() => {
    if (token) {
      fetchIntegrations();
      fetchProjects();
    }
  }, [token]);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);

      if (!token) {
        console.warn('No token available');
        setAvailableIntegrations([]);
        setConnectedIntegrations([]);
        return;
      }

      console.log('Fetching integrations from:', `${API_BASE}/api/integrations/available`);

      const [availableRes, connectedRes] = await Promise.all([
        axios.get(`${API_BASE}/api/integrations/available`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE}/api/integrations`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      console.log('Available integrations response:', availableRes.data);
      console.log('Connected integrations response:', connectedRes.data);

      // Safe extraction of available integrations
      const availableData = availableRes.data || {};
      setAvailableIntegrations(availableData.integrations || []);

      // Safe extraction of connected integrations
      const connectedData = connectedRes.data || [];
      setConnectedIntegrations(Array.isArray(connectedData) ? connectedData : []);
    } catch (error) {
      console.error('Error fetching integrations:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);

      const errorMessage =
        error.response?.data?.detail || error.message || 'Failed to load integrations';
      showSnackbar(errorMessage, 'error');

      setAvailableIntegrations([]);
      setConnectedIntegrations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleConnect = (integration) => {
    setSelectedIntegration(integration);
    setConfigData({
      project_id: projects.length > 0 ? projects[0].id : '',
      api_key: '',
      settings: {},
      is_active: true,
    });
    setConfigDialog(true);
  };

  const handleConfigure = async () => {
    if (!selectedIntegration) return;

    try {
      console.log('Connecting integration:', selectedIntegration.id);
      console.log('Config data:', configData);

      const response = await axios.post(
        `${API_BASE}/api/integrations/${selectedIntegration.id}/connect`,
        {
          project_id: configData.project_id,
          config_data: {
            type: selectedIntegration.category,
            api_key: configData.api_key,
            settings: configData.settings,
            is_active: configData.is_active,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('Connection response:', response.data);

      showSnackbar(`${selectedIntegration.name} connected successfully!`, 'success');
      setConfigDialog(false);
      fetchIntegrations(); // Refresh the list
    } catch (error) {
      console.error('Error connecting integration:', error);
      console.error('Error response:', error.response?.data);
      showSnackbar(error.response?.data?.detail || 'Failed to connect integration', 'error');
    }
  };

  const handleDisconnect = async (integrationId, integrationName) => {
    try {
      await axios.delete(`${API_BASE}/api/integrations/${integrationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showSnackbar(`${integrationName} disconnected successfully`, 'info');
      fetchIntegrations(); // Refresh the list
    } catch (error) {
      console.error('Error disconnecting integration:', error);
      showSnackbar('Failed to disconnect integration', 'error');
    }
  };

  const isConnected = (integrationId) => {
    return connectedIntegrations.some((conn) => conn.provider === integrationId);
  };

  const getConnectedIntegrationId = (integrationId) => {
    const integration = connectedIntegrations.find((conn) => conn.provider === integrationId);
    return integration?.id;
  };

  const filteredIntegrations = availableIntegrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const connectedCount = connectedIntegrations.length;
  const totalCount = availableIntegrations.length;

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
                    border: `1px solid ${
                      selectedCategory === cat.value ? G_START : 'rgba(255,255,255,0.1)'
                    }`,
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
                  value={totalCount > 0 ? (connectedCount / totalCount) * 100 : 0}
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

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <LinearProgress sx={{ width: 200 }} />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredIntegrations.map((integration, index) => {
              const connected = isConnected(integration.id);
              return (
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
                            {/* Map icon names to components */}
                            {integration.icon === 'Payment' && <Payment />}
                            {integration.icon === 'Mail' && <Mail />}
                            {integration.icon === 'WhatsApp' && <WhatsApp />}
                            {integration.icon === 'Instagram' && <Instagram />}
                            {integration.icon === 'Facebook' && <Facebook />}
                            {integration.icon === 'Analytics' && <Analytics />}
                            {integration.icon === 'Storage' && <Storage />}
                            {integration.icon === 'Security' && <Security />}
                            {integration.icon === 'Api' && <Api />}
                            {integration.icon === 'MusicNote' && <MusicNote />}
                            {integration.icon === 'Chat' && <Chat />}
                            {integration.icon === 'CloudUpload' && <CloudUpload />}
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
                          {connected && (
                            <Chip
                              label="Connected"
                              size="small"
                              sx={{
                                bgcolor: alpha(G_MID, 0.2),
                                color: G_MID,
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
                      </CardContent>
                      <CardActions sx={{ p: 2, pt: 0 }}>
                        {connected ? (
                          <Button
                            fullWidth
                            variant="outlined"
                            color="error"
                            onClick={() =>
                              handleDisconnect(
                                getConnectedIntegrationId(integration.id),
                                integration.name
                              )
                            }
                            sx={{
                              borderColor: 'rgba(255,0,0,0.3)',
                              color: '#ff4444',
                              '&:hover': {
                                borderColor: '#ff4444',
                                bgcolor: alpha('#ff4444', 0.1),
                              },
                            }}
                          >
                            Disconnect
                          </Button>
                        ) : (
                          <Button
                            fullWidth
                            variant="contained"
                            onClick={() => handleConnect(integration)}
                            sx={{
                              background: GRAD,
                              color: 'white',
                              '&:hover': {
                                opacity: 0.9,
                              },
                            }}
                          >
                            Connect
                          </Button>
                        )}
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>
        )}

        {filteredIntegrations.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>
              No integrations found. Try adjusting your search.
            </Typography>
          </Box>
        )}

        {/* Configuration Dialog */}
        <Dialog
          open={configDialog}
          onClose={() => setConfigDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: '#0D1220',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px',
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
            Connect {selectedIntegration?.name}
            <IconButton
              onClick={() => setConfigDialog(false)}
              sx={{ color: 'rgba(255,255,255,0.5)' }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              {projects.length > 0 ? (
                <>
                  <TextField
                    select
                    fullWidth
                    label="Select Project"
                    value={configData.project_id}
                    onChange={(e) => setConfigData({ ...configData, project_id: e.target.value })}
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                    }}
                  >
                    {projects.map((project) => (
                      <MenuItem key={project.id} value={project.id}>
                        {project.name}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    fullWidth
                    label="API Key / Access Token"
                    value={configData.api_key}
                    onChange={(e) => setConfigData({ ...configData, api_key: e.target.value })}
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                    }}
                  />

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                    <Switch
                      checked={configData.is_active}
                      onChange={(e) =>
                        setConfigData({ ...configData, is_active: e.target.checked })
                      }
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: G_START,
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: G_START,
                        },
                      }}
                    />
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Enable this integration
                    </Typography>
                  </Box>
                </>
              ) : (
                <Alert severity="warning" sx={{ bgcolor: alpha('#ff9800', 0.1), color: '#ff9800' }}>
                  You need to create a project first before connecting integrations.
                </Alert>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfigDialog(false)} sx={{ color: 'rgba(255,255,255,0.6)' }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleConfigure}
              disabled={!configData.project_id || !configData.api_key}
              sx={{
                background: GRAD,
                borderRadius: '999px',
                textTransform: 'none',
                '&:hover': { opacity: 0.9 },
              }}
            >
              Connect Integration
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{
              width: '100%',
              bgcolor: '#1A1F2A',
              color: 'white',
              '& .MuiAlert-icon': {
                color:
                  snackbar.severity === 'success'
                    ? G_MID
                    : snackbar.severity === 'error'
                      ? '#ff4444'
                      : G_START,
              },
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Integrations;
