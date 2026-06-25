// SettingsPage.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Avatar,
  IconButton,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  InputAdornment,
  Tooltip,
  Chip,
  alpha,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  LinearProgress,
  Stack,
  Radio,
  RadioGroup,
  FormLabel,
  Link,
} from '@mui/material';
import {
  Person,
  Security,
  Notifications,
  Payment,
  Palette,
  Language,
  Save,
  Close,
  Edit,
  Visibility,
  VisibilityOff,
  Delete,
  Add,
  CheckCircle,
  WarningAmber,
  SmartToy,
  CloudUpload,
  Backup,
  Logout,
  DarkMode,
  LightMode,
  AutoAwesome,
  Fingerprint,
  Email,
  Phone,
  LocationOn,
  VpnKey,
  History,
  Devices,
  Webhook,
  Api,
  Storage,
  Sync,
  VerifiedUser,
  CreditCard,
  Receipt,
  HelpOutline,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChromePicker } from 'react-color';

// Missing Popover import
import { Popover } from '@mui/material';

const G_START = '#4F6EF7';
const G_MID = '#2DBCB6';
const G_END = '#3ED67C';
const GRAD = `linear-gradient(135deg, ${G_START} 0%, ${G_MID} 50%, ${G_END} 100%)`;

const SettingsPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [colorPickerAnchor, setColorPickerAnchor] = useState(null);
  const [selectedColorTarget, setSelectedColorTarget] = useState(null);

  // Profile Settings
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: '',
    company: '',
    website: '',
    location: '',
    phone: '',
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Password Settings
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    projectUpdates: true,
    marketingEmails: false,
    securityAlerts: true,
    creditAlerts: true,
    integrationAlerts: true,
    weeklyDigest: false,
  });

  // Appearance Settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'dark',
    compactMode: false,
    animationsEnabled: true,
    fontSize: 'medium',
    sidebarCollapsed: false,
    highContrast: false,
  });

  // Color Theme (from DesignStudio)
  const [colorTheme, setColorTheme] = useState({
    primaryColor: G_START,
    secondaryColor: G_MID,
    accentColor: G_END,
    backgroundColor: '#080C14',
    textColor: '#FFFFFF',
    headingColor: '#FFFFFF',
  });

  // API Keys
  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: 'Production API Key', key: 'pk_live_••••••••••••••', createdAt: '2024-01-15', lastUsed: '2024-01-20' },
    { id: 2, name: 'Development API Key', key: 'pk_test_••••••••••••••', createdAt: '2024-01-10', lastUsed: '2024-01-18' },
  ]);
  const [newApiKeyName, setNewApiKeyName] = useState('');

  // Billing Info
  const [billingInfo, setBillingInfo] = useState({
    plan: 'Pro',
    credits: 2000,
    creditsUsed: 425,
    nextBillingDate: '2024-02-15',
    amount: '$79',
    paymentMethod: 'Visa •••• 4242',
    invoices: [
      { id: 'INV-001', date: '2024-01-15', amount: '$79', status: 'paid' },
      { id: 'INV-002', date: '2023-12-15', amount: '$79', status: 'paid' },
      { id: 'INV-003', date: '2023-11-15', amount: '$79', status: 'paid' },
    ],
  });

  // Connected Accounts
  const [connectedAccounts, setConnectedAccounts] = useState([
    { name: 'Google', connected: true, email: 'user@gmail.com', icon: 'G' },
    { name: 'GitHub', connected: false, email: '', icon: 'GH' },
    { name: 'Slack', connected: false, email: '', icon: 'S' },
    { name: 'Discord', connected: true, email: 'user#1234', icon: 'D' },
  ]);

  // Export/Import Data
  const [exporting, setExporting] = useState(false);

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleProfileSave = async () => {
    setLoading(true);
    setTimeout(() => {
      if (updateUser) updateUser(profileForm);
      setIsEditingProfile(false);
      setLoading(false);
      showSnackbar('Profile updated successfully!', 'success');
    }, 1000);
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showSnackbar('Passwords do not match', 'error');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      showSnackbar('Password must be at least 8 characters', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setPasswordDialogOpen(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setLoading(false);
      showSnackbar('Password changed successfully!', 'success');
    }, 1000);
  };

  const handleCreateApiKey = () => {
    if (!newApiKeyName.trim()) {
      showSnackbar('Please enter an API key name', 'warning');
      return;
    }
    const newKey = {
      id: apiKeys.length + 1,
      name: newApiKeyName,
      key: `sk_${Math.random().toString(36).substr(2, 24)}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
    };
    setApiKeys([...apiKeys, newKey]);
    setNewApiKeyName('');
    setApiKeyDialogOpen(false);
    showSnackbar(`API key "${newApiKeyName}" created successfully!`, 'success');
  };

  const handleDeleteApiKey = (id) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
    showSnackbar('API key deleted', 'info');
  };

  const handleDeleteAccount = () => {
    setLoading(true);
    setTimeout(() => {
      setDeleteDialogOpen(false);
      localStorage.clear();
      if (logout) logout();
      navigate('/');
      showSnackbar('Account deleted successfully', 'info');
    }, 1500);
  };

  const handleExportData = async () => {
    setExporting(true);
    setTimeout(() => {
      const exportData = {
        user: profileForm,
        settings: appearanceSettings,
        notifications: notificationSettings,
        projects: JSON.parse(localStorage.getItem('projects_index') || '[]').map(id => 
          JSON.parse(localStorage.getItem(`project_${id}`) || '{}')
        ),
        exportedAt: new Date().toISOString(),
      };
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', `aleyo_export_${new Date().toISOString().split('T')[0]}.json`);
      linkElement.click();
      setExporting(false);
      setExportDialogOpen(false);
      showSnackbar('Data exported successfully!', 'success');
    }, 1500);
  };

  const handleColorPickerOpen = (event, target) => {
    setColorPickerAnchor(event.currentTarget);
    setSelectedColorTarget(target);
  };

  const handleColorPickerClose = () => {
    setColorPickerAnchor(null);
    setSelectedColorTarget(null);
  };

  const handleColorChange = (color) => {
    if (selectedColorTarget) {
      setColorTheme(prev => ({ ...prev, [selectedColorTarget]: color.hex }));
      localStorage.setItem('userColorTheme', JSON.stringify({ ...colorTheme, [selectedColorTarget]: color.hex }));
    }
  };

  const tabs = [
    { label: 'Profile', icon: <Person /> },
    { label: 'Security', icon: <Security /> },
    { label: 'Notifications', icon: <Notifications /> },
    { label: 'Appearance', icon: <Palette /> },
    { label: 'API Keys', icon: <Api /> },
    { label: 'Billing', icon: <Payment /> },
    { label: 'Connected', icon: <Devices /> },
    { label: 'Data', icon: <Storage /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>Profile Information</Typography>
            <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.6), mb: 3 }}>
              Update your personal information and how others see you on the platform.
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} display="flex" justifyContent="center">
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      background: GRAD,
                      fontSize: 48,
                      fontWeight: 'bold',
                      mb: 2,
                    }}
                  >
                    {profileForm.name?.charAt(0) || 'U'}
                  </Avatar>
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 10,
                      right: 0,
                      bgcolor: G_START,
                      '&:hover': { bgcolor: G_MID },
                    }}
                    size="small"
                  >
                    <Edit sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  disabled={!isEditingProfile}
                  sx={{ '& .MuiInputBase-input': { color: 'white' }, '& .MuiInputLabel-root': { color: alpha('#FFFFFF', 0.6) } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  disabled={!isEditingProfile}
                  sx={{ '& .MuiInputBase-input': { color: 'white' }, '& .MuiInputLabel-root': { color: alpha('#FFFFFF', 0.6) } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company"
                  value={profileForm.company}
                  onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                  disabled={!isEditingProfile}
                  sx={{ '& .MuiInputBase-input': { color: 'white' }, '& .MuiInputLabel-root': { color: alpha('#FFFFFF', 0.6) } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  disabled={!isEditingProfile}
                  sx={{ '& .MuiInputBase-input': { color: 'white' }, '& .MuiInputLabel-root': { color: alpha('#FFFFFF', 0.6) } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Website"
                  value={profileForm.website}
                  onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                  disabled={!isEditingProfile}
                  sx={{ '& .MuiInputBase-input': { color: 'white' }, '& .MuiInputLabel-root': { color: alpha('#FFFFFF', 0.6) } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  multiline
                  rows={3}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  disabled={!isEditingProfile}
                  sx={{ '& .MuiInputBase-input': { color: 'white' }, '& .MuiInputLabel-root': { color: alpha('#FFFFFF', 0.6) } }}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              {isEditingProfile ? (
                <>
                  <Button onClick={() => setIsEditingProfile(false)} sx={{ color: alpha('#FFFFFF', 0.6) }}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleProfileSave}
                    disabled={loading}
                    sx={{ background: GRAD, borderRadius: '10px' }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                  </Button>
                </>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => setIsEditingProfile(true)}
                  sx={{ borderColor: alpha('#FFFFFF', 0.2), color: 'white' }}
                >
                  Edit Profile
                </Button>
              )}
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>Security Settings</Typography>
            <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.6), mb: 3 }}>
              Manage your password and security preferences.
            </Typography>

            <Card sx={{ bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2, mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                      Password
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                      Last changed 30 days ago
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<VpnKey />}
                    onClick={() => setPasswordDialogOpen(true)}
                    sx={{ borderColor: alpha('#FFFFFF', 0.2), color: 'white' }}
                  >
                    Change Password
                  </Button>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2, mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                      Two-Factor Authentication
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                      Add an extra layer of security to your account
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<Fingerprint />}
                    sx={{ borderColor: alpha('#FFFFFF', 0.2), color: 'white' }}
                  >
                    Enable 2FA
                  </Button>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                      Session Management
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                      Active sessions: 3 (Current device, Mobile app, Web)
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<Devices />}
                    sx={{ borderColor: alpha('#FFFFFF', 0.2), color: 'white' }}
                  >
                    Manage Sessions
                  </Button>
                </Box>
              </CardContent>
            </Card>

            <Alert severity="warning" sx={{ mt: 3, bgcolor: alpha('#FFA726', 0.1), border: `1px solid ${alpha('#FFA726', 0.3)}` }}>
              <Typography variant="body2">
                ⚠️ For security reasons, we recommend changing your password every 90 days and enabling 2FA.
              </Typography>
            </Alert>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>Notification Preferences</Typography>
            <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.6), mb: 3 }}>
              Choose what notifications you want to receive and how.
            </Typography>

            <Card sx={{ bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2, mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                  📧 Email Notifications
                </Typography>
                <List>
                  {[
                    { key: 'emailNotifications', label: 'Receive email notifications', description: 'Get updates via email' },
                    { key: 'projectUpdates', label: 'Project updates', description: 'When projects are saved or published' },
                    { key: 'securityAlerts', label: 'Security alerts', description: 'Login alerts and security events' },
                    { key: 'creditAlerts', label: 'Credit alerts', description: 'When credits are low or added' },
                    { key: 'marketingEmails', label: 'Marketing emails', description: 'Product updates and promotions' },
                    { key: 'weeklyDigest', label: 'Weekly digest', description: 'Summary of your activity' },
                  ].map((item) => (
                    <ListItem key={item.key} sx={{ px: 0 }}>
                      <ListItemText
                        primary={item.label}
                        secondary={item.description}
                        primaryTypographyProps={{ sx: { color: 'white' } }}
                        secondaryTypographyProps={{ sx: { color: alpha('#FFFFFF', 0.5) } }}
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={notificationSettings[item.key]}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, [item.key]: e.target.checked })}
                          sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G_START } }}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                  📱 Push Notifications
                </Typography>
                <List>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Browser notifications"
                      secondary="Receive notifications in your browser"
                      primaryTypographyProps={{ sx: { color: 'white' } }}
                      secondaryTypographyProps={{ sx: { color: alpha('#FFFFFF', 0.5) } }}
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={notificationSettings.pushNotifications}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, pushNotifications: e.target.checked })}
                        sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G_START } }}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>Appearance</Typography>
            <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.6), mb: 3 }}>
              Customize how the application looks and feels.
            </Typography>

            <Card sx={{ bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2, mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                  🎨 Theme
                </Typography>
                <RadioGroup
                  value={appearanceSettings.theme}
                  onChange={(e) => setAppearanceSettings({ ...appearanceSettings, theme: e.target.value })}
                  sx={{ display: 'flex', flexDirection: 'row', gap: 3, mb: 2 }}
                >
                  <FormControlLabel value="dark" control={<Radio />} label="Dark Mode" sx={{ color: 'white' }} />
                  <FormControlLabel value="light" control={<Radio />} label="Light Mode" sx={{ color: 'white' }} />
                  <FormControlLabel value="system" control={<Radio />} label="System Default" sx={{ color: 'white' }} />
                </RadioGroup>
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2, mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                  🎨 Custom Color Theme
                </Typography>
                <Grid container spacing={2}>
                  {[
                    { label: 'Primary Color', key: 'primaryColor', color: colorTheme.primaryColor },
                    { label: 'Secondary Color', key: 'secondaryColor', color: colorTheme.secondaryColor },
                    { label: 'Accent Color', key: 'accentColor', color: colorTheme.accentColor },
                    { label: 'Background', key: 'backgroundColor', color: colorTheme.backgroundColor },
                  ].map((item) => (
                    <Grid item xs={12} sm={6} key={item.key}>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={(e) => handleColorPickerOpen(e, item.key)}
                        sx={{
                          justifyContent: 'space-between',
                          borderColor: alpha('#FFFFFF', 0.2),
                          color: 'white',
                          py: 1.5,
                        }}
                      >
                        {item.label}
                        <Box sx={{ width: 32, height: 32, bgcolor: item.color, borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }} />
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                  ⚙️ Interface Settings
                </Typography>
                <List>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText primary="Compact Mode" secondary="Reduce spacing for more content" />
                    <Switch
                      checked={appearanceSettings.compactMode}
                      onChange={(e) => setAppearanceSettings({ ...appearanceSettings, compactMode: e.target.checked })}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText primary="Animations" secondary="Enable UI animations and transitions" />
                    <Switch
                      checked={appearanceSettings.animationsEnabled}
                      onChange={(e) => setAppearanceSettings({ ...appearanceSettings, animationsEnabled: e.target.checked })}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText primary="High Contrast" secondary="Increase contrast for better accessibility" />
                    <Switch
                      checked={appearanceSettings.highContrast}
                      onChange={(e) => setAppearanceSettings({ ...appearanceSettings, highContrast: e.target.checked })}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Box>
        );

      case 4:
        return (
          <Box>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>API Keys</Typography>
            <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.6), mb: 3 }}>
              Manage API keys for programmatic access to Aleyo services.
            </Typography>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setApiKeyDialogOpen(true)}
              sx={{ background: GRAD, borderRadius: '10px', mb: 3 }}
            >
              Create API Key
            </Button>

            <Card sx={{ bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2 }}>
              <CardContent>
                {apiKeys.map((key, idx) => (
                  <Box key={key.id}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                          {key.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.5), fontFamily: 'monospace' }}>
                          {key.key}
                        </Typography>
                        <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.3), display: 'block' }}>
                          Created: {key.createdAt} • Last used: {key.lastUsed}
                        </Typography>
                      </Box>
                      <IconButton onClick={() => handleDeleteApiKey(key.id)} sx={{ color: '#ff4444' }}>
                        <Delete />
                      </IconButton>
                    </Box>
                    {idx < apiKeys.length - 1 && <Divider sx={{ borderColor: alpha('#FFFFFF', 0.1) }} />}
                  </Box>
                ))}
                {apiKeys.length === 0 && (
                  <Typography sx={{ color: alpha('#FFFFFF', 0.5), textAlign: 'center', py: 4 }}>
                    No API keys yet. Create your first key to get started.
                  </Typography>
                )}
              </CardContent>
            </Card>

            <Alert severity="info" sx={{ mt: 3, bgcolor: alpha(G_START, 0.1) }}>
              <Typography variant="body2">
                🔐 Keep your API keys secure. Never share them publicly or commit them to version control.
              </Typography>
            </Alert>
          </Box>
        );

      case 5:
        return (
          <Box>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>Billing & Subscription</Typography>
            <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.6), mb: 3 }}>
              Manage your plan, payment methods, and billing history.
            </Typography>

            <Card sx={{ bgcolor: alpha(G_START, 0.1), border: `1px solid ${alpha(G_START, 0.3)}`, borderRadius: 2, mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Box>
                    <Typography variant="h4" sx={{ color: G_START, fontWeight: 700 }}>{billingInfo.plan}</Typography>
                    <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.6) }}>
                      {billingInfo.credits} credits per month • ${billingInfo.amount}/month
                    </Typography>
                  </Box>
                  <Button variant="outlined" sx={{ borderColor: G_START, color: G_START }}>
                    Upgrade Plan
                  </Button>
                </Box>
              </CardContent>
            </Card>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                      💳 Payment Method
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CreditCard sx={{ color: G_START }} />
                        <Typography sx={{ color: 'white' }}>{billingInfo.paymentMethod}</Typography>
                      </Box>
                      <Button size="small" sx={{ color: G_START }}>Update</Button>
                    </Box>
                    <Divider sx={{ borderColor: alpha('#FFFFFF', 0.1), my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                          Next billing date
                        </Typography>
                        <Typography sx={{ color: 'white', fontWeight: 600 }}>{billingInfo.nextBillingDate}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                          Amount
                        </Typography>
                        <Typography sx={{ color: 'white', fontWeight: 600 }}>{billingInfo.amount}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                      🎫 Credit Usage
                    </Typography>
                    <Box sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>Used this month</Typography>
                        <Typography variant="caption" sx={{ color: 'white' }}>{billingInfo.creditsUsed} / {billingInfo.credits}</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(billingInfo.creditsUsed / billingInfo.credits) * 100}
                        sx={{ height: 8, borderRadius: 4, bgcolor: alpha('#FFFFFF', 0.1), '& .MuiLinearProgress-bar': { background: GRAD } }}
                      />
                    </Box>
                    <Button fullWidth variant="outlined" startIcon={<Add />} sx={{ mt: 2, borderColor: alpha('#FFFFFF', 0.2), color: 'white' }}>
                      Add Credits
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Card sx={{ bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2, mt: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                  📄 Invoice History
                </Typography>
                {billingInfo.invoices.map((invoice) => (
                  <Box key={invoice.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5 }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'white' }}>{invoice.id}</Typography>
                      <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>{invoice.date}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2" sx={{ color: 'white' }}>{invoice.amount}</Typography>
                      <Chip label={invoice.status} size="small" sx={{ bgcolor: alpha(G_END, 0.15), color: G_END }} />
                      <Button size="small" sx={{ color: G_START }}>Download</Button>
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Box>
        );

      case 6:
        return (
          <Box>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>Connected Accounts</Typography>
            <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.6), mb: 3 }}>
              Link your third-party accounts for seamless integration.
            </Typography>

            <Card sx={{ bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2 }}>
              <CardContent>
                {connectedAccounts.map((account) => (
                  <Box key={account.name}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: alpha(G_START, 0.1), color: G_START }}>{account.icon}</Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                            {account.name}
                          </Typography>
                          {account.connected && (
                            <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                              Connected as {account.email}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      <Button
                        variant={account.connected ? 'outlined' : 'contained'}
                        size="small"
                        sx={account.connected ? { borderColor: '#ff4444', color: '#ff4444' } : { background: GRAD }}
                      >
                        {account.connected ? 'Disconnect' : 'Connect'}
                      </Button>
                    </Box>
                    <Divider sx={{ borderColor: alpha('#FFFFFF', 0.1) }} />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Box>
        );

      case 7:
        return (
          <Box>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>Data Management</Typography>
            <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.6), mb: 3 }}>
              Export, backup, or delete your data.
            </Typography>

            <Card sx={{ bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2, mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                      📤 Export All Data
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                      Download a copy of all your projects and settings
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<Backup />}
                    onClick={() => setExportDialogOpen(true)}
                    sx={{ borderColor: alpha('#FFFFFF', 0.2), color: 'white' }}
                  >
                    Export Data
                  </Button>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2, mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                      🔄 Sync Settings
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                      Automatically sync your settings across devices
                    </Typography>
                  </Box>
                  <Switch sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G_START } }} />
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: alpha('#FF4444', 0.05), border: `1px solid ${alpha('#FF4444', 0.3)}`, borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ color: '#FF4444', fontWeight: 600 }}>
                      🗑️ Delete Account
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                      Permanently delete your account and all associated data
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<Delete />}
                    onClick={() => setDeleteDialogOpen(true)}
                    sx={{ bgcolor: '#FF4444', '&:hover': { bgcolor: '#CC0000' } }}
                  >
                    Delete Account
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        );

      default:
        return null;
    }
  };

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
      <Box sx={{ background: GRAD, py: 4, mb: 4 }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                textAlign: 'center',
                color: 'white',
                mb: 1,
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
              }}
            >
              Settings
            </Typography>
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                color: 'rgba(255,255,255,0.8)',
                maxWidth: 500,
                mx: 'auto',
              }}
            >
              Manage your account preferences and customization
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 6 }}>
        <Grid container spacing={3}>
          {/* Sidebar Tabs */}
          <Grid item xs={12} md={3}>
            <Paper
              sx={{
                bgcolor: alpha('#FFFFFF', 0.03),
                borderRadius: 3,
                overflow: 'hidden',
                position: 'sticky',
                top: 24,
              }}
            >
              {tabs.map((tab, idx) => (
                <Box
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    px: 3,
                    py: 2,
                    cursor: 'pointer',
                    bgcolor: activeTab === idx ? alpha(G_START, 0.15) : 'transparent',
                    borderLeft: activeTab === idx ? `3px solid ${G_START}` : '3px solid transparent',
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: alpha(G_START, 0.08) },
                  }}
                >
                  <Box sx={{ color: activeTab === idx ? G_START : alpha('#FFFFFF', 0.5) }}>
                    {tab.icon}
                  </Box>
                  <Typography sx={{ color: activeTab === idx ? G_START : alpha('#FFFFFF', 0.7), fontWeight: activeTab === idx ? 600 : 400 }}>
                    {tab.label}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={9}>
            <Paper sx={{ bgcolor: alpha('#FFFFFF', 0.02), borderRadius: 3, p: 3 }}>
              {renderTabContent()}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Color Picker Popover */}
      <Popover
        open={Boolean(colorPickerAnchor)}
        anchorEl={colorPickerAnchor}
        onClose={handleColorPickerClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Box sx={{ p: 2, bgcolor: '#1A1F2E' }}>
          <ChromePicker
            color={colorTheme[selectedColorTarget] || G_START}
            onChange={handleColorChange}
          />
        </Box>
      </Popover>

      {/* Change Password Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { bgcolor: '#0A0F1A', borderRadius: 3, border: `1px solid ${alpha(G_START, 0.3)}`, color: 'white' } }}
      >
        <Box sx={{ height: 4, background: GRAD }} />
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label="Current Password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            sx={{ mt: 1, mb: 2, '& .MuiInputBase-input': { color: 'white' } }}
          />
          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label="New Password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            sx={{ mb: 2, '& .MuiInputBase-input': { color: 'white' } }}
          />
          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label="Confirm New Password"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            sx={{ '& .MuiInputBase-input': { color: 'white' } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)} sx={{ color: alpha('#FFFFFF', 0.6) }}>Cancel</Button>
          <Button onClick={handlePasswordChange} variant="contained" sx={{ background: GRAD }}>Change Password</Button>
        </DialogActions>
      </Dialog>

      {/* Create API Key Dialog */}
      <Dialog
        open={apiKeyDialogOpen}
        onClose={() => setApiKeyDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { bgcolor: '#0A0F1A', borderRadius: 3, border: `1px solid ${alpha(G_START, 0.3)}`, color: 'white' } }}
      >
        <Box sx={{ height: 4, background: GRAD }} />
        <DialogTitle>Create API Key</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Key Name"
            placeholder="e.g., Production Server"
            value={newApiKeyName}
            onChange={(e) => setNewApiKeyName(e.target.value)}
            sx={{ mt: 1, '& .MuiInputBase-input': { color: 'white' } }}
          />
          <Alert severity="info" sx={{ mt: 2, bgcolor: alpha(G_START, 0.1) }}>
            This key will have full access to your account. Store it securely.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApiKeyDialogOpen(false)} sx={{ color: alpha('#FFFFFF', 0.6) }}>Cancel</Button>
          <Button onClick={handleCreateApiKey} variant="contained" sx={{ background: GRAD }}>Create Key</Button>
        </DialogActions>
      </Dialog>

      {/* Export Data Dialog */}
      <Dialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { bgcolor: '#0A0F1A', borderRadius: 3, border: `1px solid ${alpha(G_START, 0.3)}`, color: 'white' } }}
      >
        <Box sx={{ height: 4, background: GRAD }} />
        <DialogTitle>Export Your Data</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.7), mb: 2 }}>
            This export will include:
          </Typography>
          <List dense>
            <ListItem><ListItemIcon><CheckCircle sx={{ color: G_END }} /></ListItemIcon><ListItemText primary="All your projects and designs" /></ListItem>
            <ListItem><ListItemIcon><CheckCircle sx={{ color: G_END }} /></ListItemIcon><ListItemText primary="Uploaded images and assets" /></ListItem>
            <ListItem><ListItemIcon><CheckCircle sx={{ color: G_END }} /></ListItemIcon><ListItemText primary="Account settings and preferences" /></ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)} sx={{ color: alpha('#FFFFFF', 0.6) }}>Cancel</Button>
          <Button onClick={handleExportData} variant="contained" disabled={exporting} sx={{ background: GRAD }}>
            {exporting ? <CircularProgress size={24} /> : 'Export Data'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { bgcolor: '#0A0F1A', borderRadius: 3, border: `1px solid ${alpha('#FF4444', 0.3)}`, color: 'white' } }}
      >
        <Box sx={{ height: 4, background: '#FF4444' }} />
        <DialogTitle sx={{ color: '#FF4444' }}>Delete Account</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.7), mb: 2 }}>
            ⚠️ This action is permanent and cannot be undone. You will lose:
          </Typography>
          <List dense>
            <ListItem><ListItemIcon><WarningAmber sx={{ color: '#FF4444' }} /></ListItemIcon><ListItemText primary="All your projects and designs" /></ListItem>
            <ListItem><ListItemIcon><WarningAmber sx={{ color: '#FF4444' }} /></ListItemIcon><ListItemText primary="All uploaded images and assets" /></ListItem>
            <ListItem><ListItemIcon><WarningAmber sx={{ color: '#FF4444' }} /></ListItemIcon><ListItemText primary="Your subscription and credits" /></ListItem>
          </List>
          <TextField
            fullWidth
            label="Type 'DELETE' to confirm"
            sx={{ mt: 2, '& .MuiInputBase-input': { color: 'white' } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: alpha('#FFFFFF', 0.6) }}>Cancel</Button>
          <Button onClick={handleDeleteAccount} variant="contained" sx={{ bgcolor: '#FF4444', '&:hover': { bgcolor: '#CC0000' } }}>
            Delete Account
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
};

export default SettingsPage;