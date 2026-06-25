import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Switch,
  FormControlLabel,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import {
  Description,
  Payment,
  Email,
  CalendarToday,
  Campaign,
  Delete,
  Code,
} from '@mui/icons-material';

const G_START = '#4F6EF7';
const G_MID = '#2DBCB6';
const G_END = '#3ED67C';
const GRAD = `linear-gradient(135deg, ${G_START} 0%, ${G_MID} 50%, ${G_END} 100%)`;

const IntegrationManager = ({ projectId }) => {
  const [integrations, setIntegrations] = useState([]);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [configDialog, setConfigDialog] = useState(false);
  const [configData, setConfigData] = useState({
    type: '',
    provider: '',
    api_key: '',
    settings: {},
  });

  const integrationTypes = [
    {
      type: 'forms',
      label: 'Form Builder',
      icon: Description,
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
      icon: Email,
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

  const handleConfigure = async () => {
    setIntegrations([
      ...integrations,
      { ...configData, integration_code: '<!-- Integration code would appear here -->' },
    ]);
    setConfigDialog(false);
    setConfigData({ type: '', provider: '', api_key: '', settings: {} });
  };

  const handleRemoveIntegration = (index) =>
    setIntegrations(integrations.filter((_, i) => i !== index));

  return (
    <Box sx={{ p: 3, bgcolor: '#080C14', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'white', fontWeight: 700 }}>
        Third-Party Integrations
      </Typography>
      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 4 }}>
        Connect your website with popular services for forms, payments, email marketing, and more
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {integrationTypes.map((integration) => {
          const Icon = integration.icon;
          return (
            <Grid item xs={12} sm={6} md={4} key={integration.type}>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px',
                  '&:hover': { transform: 'translateY(-4px)', borderColor: G_START },
                }}
                onClick={() => {
                  setSelectedIntegration(integration);
                  setConfigDialog(true);
                  setConfigData({ ...configData, type: integration.type });
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Icon sx={{ fontSize: 48, color: G_START, mb: 2 }} />
                  <Typography variant="h6" sx={{ color: 'white' }}>
                    {integration.label}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    Available providers: {integration.providers.join(', ')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
        Active Integrations
      </Typography>
      {integrations.length === 0 ? (
        <Alert
          severity="info"
          sx={{
            background: 'rgba(79,110,247,0.1)',
            border: `1px solid ${G_START}44`,
            color: '#A5B4FC',
            borderRadius: '12px',
          }}
        >
          No integrations configured yet. Click on any service above to add an integration.
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {integrations.map((integration, index) => {
            const integrationType = integrationTypes.find((t) => t.type === integration.type);
            const Icon = integrationType?.icon;
            return (
              <Grid item xs={12} key={index}>
                <Card
                  sx={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {Icon && <Icon sx={{ color: G_START }} />}
                        <Box>
                          <Typography variant="subtitle1" sx={{ color: 'white' }}>
                            {integrationType?.label} - {integration.provider}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                            Configured with {integration.api_key ? 'API key' : 'settings'}
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton onClick={() => handleRemoveIntegration(index)} color="error">
                        <Delete />
                      </IconButton>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Button
                        size="small"
                        startIcon={<Code />}
                        onClick={() =>
                          alert(`Integration code:\n\n${integration.integration_code}`)
                        }
                        sx={{ color: G_START }}
                      >
                        View Code
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

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
        <DialogTitle sx={{ color: 'white' }}>Configure {selectedIntegration?.label}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
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
                  control={<Switch />}
                  label="Enable this integration on all pages"
                  sx={{ mt: 1, color: 'rgba(255,255,255,0.7)' }}
                />
              </>
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
            disabled={!configData.provider || !configData.api_key}
            sx={{ background: GRAD, borderRadius: '999px', textTransform: 'none' }}
          >
            Add Integration
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IntegrationManager;
