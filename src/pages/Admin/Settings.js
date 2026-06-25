// src/pages/Admin/Settings.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Snackbar,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  alpha,
} from '@mui/material';
import { adminService } from '../../services/admin';

const G_START = '#4F6EF7';
const G_MID = '#2DBCB6';
const G_END = '#3ED67C';
const GRAD = `linear-gradient(135deg, ${G_START} 0%, ${G_MID} 50%, ${G_END} 100%)`;

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'Aleyo',
    siteDescription: 'AI-Powered Website Builder',
    contactEmail: 'support@aleyo.com',
    enableMaintenance: false,

    // User Settings
    defaultCredits: 50,
    enableEmailVerification: true,
    enableTwoFactor: false,

    // Subscription Settings
    defaultPlan: 'free',
    trialPeriod: 14,
    enableYearlyDiscount: true,
    yearlyDiscountPercent: 20,

    // AI Settings
    aiCreditsCost: 1,
    aiModel: 'gpt-4',
    enableVoiceCommands: true,

    // Security Settings
    sessionTimeout: 24,
    maxLoginAttempts: 5,
    passwordMinLength: 8,

    // Integration Settings
    enableStripe: true,
    enableGoCardless: true,
    enableMailchimp: false,
  });

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await adminService.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      await adminService.updateSettings(settings);
      showNotification('Settings saved successfully');
    } catch (error) {
      showNotification('Failed to save settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSettings = async () => {
    if (window.confirm('Reset all settings to default?')) {
      setLoading(true);
      try {
        const defaults = await adminService.resetSettings();
        setSettings(defaults);
        showNotification('Settings reset to defaults');
      } catch (error) {
        showNotification('Failed to reset settings', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const showNotification = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const SettingSection = ({ title, children }) => (
    <Card
      sx={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        mb: 3,
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
          {title}
        </Typography>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 3 }} />
        <Grid container spacing={3}>
          {children}
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
          System Settings
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleResetSettings}
            sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}
          >
            Reset to Defaults
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveSettings}
            disabled={loading}
            sx={{ background: GRAD }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>

      <SettingSection title="General Settings">
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Site Name"
            value={settings.siteName}
            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            sx={{ '& input': { color: 'white' } }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Contact Email"
            value={settings.contactEmail}
            onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
            sx={{ '& input': { color: 'white' } }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Site Description"
            multiline
            rows={2}
            value={settings.siteDescription}
            onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
            sx={{ '& textarea': { color: 'white' } }}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.enableMaintenance}
                onChange={(e) => setSettings({ ...settings, enableMaintenance: e.target.checked })}
                sx={{ '&.Mui-checked': { color: G_END } }}
              />
            }
            label="Enable Maintenance Mode"
          />
          {settings.enableMaintenance && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Maintenance mode is enabled. Users will see a maintenance page.
            </Alert>
          )}
        </Grid>
      </SettingSection>

      <SettingSection title="User Settings">
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Default Credits"
            type="number"
            value={settings.defaultCredits}
            onChange={(e) => setSettings({ ...settings, defaultCredits: parseInt(e.target.value) })}
            sx={{ '& input': { color: 'white' } }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Trial Period (days)"
            type="number"
            value={settings.trialPeriod}
            onChange={(e) => setSettings({ ...settings, trialPeriod: parseInt(e.target.value) })}
            sx={{ '& input': { color: 'white' } }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: 'rgba(255,255,255,0.6)' }}>Default Plan</InputLabel>
            <Select
              value={settings.defaultPlan}
              onChange={(e) => setSettings({ ...settings, defaultPlan: e.target.value })}
              label="Default Plan"
              sx={{ color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }}
            >
              <MenuItem value="free">Free</MenuItem>
              <MenuItem value="starter">Starter</MenuItem>
              <MenuItem value="pro">Pro</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.enableEmailVerification}
                onChange={(e) =>
                  setSettings({ ...settings, enableEmailVerification: e.target.checked })
                }
              />
            }
            label="Require Email Verification"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.enableTwoFactor}
                onChange={(e) => setSettings({ ...settings, enableTwoFactor: e.target.checked })}
              />
            }
            label="Enable Two-Factor Authentication"
          />
        </Grid>
      </SettingSection>

      <SettingSection title="Subscription Settings">
        <Grid item xs={12} md={4}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.enableYearlyDiscount}
                onChange={(e) =>
                  setSettings({ ...settings, enableYearlyDiscount: e.target.checked })
                }
              />
            }
            label="Enable Yearly Discount"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Yearly Discount (%)"
            type="number"
            value={settings.yearlyDiscountPercent}
            onChange={(e) =>
              setSettings({ ...settings, yearlyDiscountPercent: parseInt(e.target.value) })
            }
            disabled={!settings.enableYearlyDiscount}
            sx={{ '& input': { color: 'white' } }}
          />
        </Grid>
      </SettingSection>

      <SettingSection title="AI Settings">
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="AI Credits Cost ($)"
            type="number"
            value={settings.aiCreditsCost}
            onChange={(e) =>
              setSettings({ ...settings, aiCreditsCost: parseFloat(e.target.value) })
            }
            sx={{ '& input': { color: 'white' } }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: 'rgba(255,255,255,0.6)' }}>AI Model</InputLabel>
            <Select
              value={settings.aiModel}
              onChange={(e) => setSettings({ ...settings, aiModel: e.target.value })}
              label="AI Model"
              sx={{ color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }}
            >
              <MenuItem value="gpt-3.5">GPT-3.5 Turbo</MenuItem>
              <MenuItem value="gpt-4">GPT-4</MenuItem>
              <MenuItem value="claude">Claude</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.enableVoiceCommands}
                onChange={(e) =>
                  setSettings({ ...settings, enableVoiceCommands: e.target.checked })
                }
              />
            }
            label="Enable Voice Commands"
          />
        </Grid>
      </SettingSection>

      <SettingSection title="Security Settings">
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Session Timeout (hours)"
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
            sx={{ '& input': { color: 'white' } }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Max Login Attempts"
            type="number"
            value={settings.maxLoginAttempts}
            onChange={(e) =>
              setSettings({ ...settings, maxLoginAttempts: parseInt(e.target.value) })
            }
            sx={{ '& input': { color: 'white' } }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Minimum Password Length"
            type="number"
            value={settings.passwordMinLength}
            onChange={(e) =>
              setSettings({ ...settings, passwordMinLength: parseInt(e.target.value) })
            }
            sx={{ '& input': { color: 'white' } }}
          />
        </Grid>
      </SettingSection>

      <SettingSection title="Integration Settings">
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item>
              <Chip
                label="Stripe"
                color={settings.enableStripe ? 'success' : 'default'}
                onClick={() => setSettings({ ...settings, enableStripe: !settings.enableStripe })}
                sx={{ cursor: 'pointer' }}
              />
            </Grid>
            <Grid item>
              <Chip
                label="GoCardless"
                color={settings.enableGoCardless ? 'success' : 'default'}
                onClick={() =>
                  setSettings({ ...settings, enableGoCardless: !settings.enableGoCardless })
                }
                sx={{ cursor: 'pointer' }}
              />
            </Grid>
            <Grid item>
              <Chip
                label="Mailchimp"
                color={settings.enableMailchimp ? 'success' : 'default'}
                onClick={() =>
                  setSettings({ ...settings, enableMailchimp: !settings.enableMailchimp })
                }
                sx={{ cursor: 'pointer' }}
              />
            </Grid>
          </Grid>
        </Grid>
      </SettingSection>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ bgcolor: '#0D1220', color: 'white' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminSettings;
