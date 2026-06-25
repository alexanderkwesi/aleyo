// CookiesPolicy.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Divider,
  Switch,
  Button,
  Chip,
  alpha,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Cookie,
  ExpandMore,
  Settings,
  CheckCircle,
  Cancel,
  Delete,
  Info,
  Security,
  Analytics as AnalyticsIcon,
  HeartBroken,
  Check,
  Close,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const G_START = '#4F6EF7';
const G_MID = '#2DBCB6';
const G_END = '#3ED67C';
const GRAD = `linear-gradient(135deg, ${G_START} 0%, ${G_MID} 50%, ${G_END} 100%)`;

const CookiesPolicy = () => {
  const navigate = useNavigate();
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    preferences: true,
    analytics: false,
  });
  const [showBanner, setShowBanner] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [lastUpdated] = useState('January 15, 2025');

  useEffect(() => {
    const savedPrefs = localStorage.getItem('cookiePreferences');
    if (savedPrefs) {
      setCookiePreferences(JSON.parse(savedPrefs));
      setShowBanner(false);
    }
  }, []);

  const savePreferences = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
    setShowBanner(false);
    setSnackbar({ open: true, message: 'Cookie preferences saved!' });
  };

  const acceptAll = () => {
    setCookiePreferences({
      necessary: true,
      preferences: true,
      analytics: true,
    });
    localStorage.setItem(
      'cookiePreferences',
      JSON.stringify({
        necessary: true,
        preferences: true,
        analytics: true,
      })
    );
    setShowBanner(false);
    setSnackbar({ open: true, message: 'Cookie preferences saved!' });
  };

  const rejectNonEssential = () => {
    setCookiePreferences({
      necessary: true,
      preferences: false,
      analytics: false,
    });
    localStorage.setItem(
      'cookiePreferences',
      JSON.stringify({
        necessary: true,
        preferences: false,
        analytics: false,
      })
    );
    setShowBanner(false);
    setSnackbar({ open: true, message: 'Non-essential cookies disabled.' });
  };

  const cookieTypes = [
    {
      name: 'Necessary Cookies',
      icon: <Security />,
      description: 'Essential for the website to function properly. These cannot be disabled.',
      examples: ['Authentication', 'Session management', 'Security tokens', 'CSRF protection'],
      duration: 'Session / Persistent',
      required: true,
    },
    {
      name: 'Preference Cookies',
      icon: <Settings />,
      description: 'Remember your preferences and settings for a personalized experience.',
      examples: ['Theme preference', 'Language selection', 'Layout settings', 'Saved projects'],
      duration: '1 year',
      required: false,
    },
    {
      name: 'Analytics Cookies',
      icon: <AnalyticsIcon />,
      description: 'Privacy-first analytics to understand platform usage (no personal data).',
      examples: ['Page view counts', 'Feature usage (aggregated)', 'Performance metrics'],
      duration: '90 days',
      required: false,
      note: 'We use self-hosted, privacy-focused analytics. No Google Analytics.',
    },
  ];

  const handleToggle = (type) => {
    if (type === 'necessary') return;
    setCookiePreferences((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  // Helper Grid components
  const GridContainer = ({ children, spacing, sx }) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: spacing * 8, ...sx }}>{children}</Box>
  );
  const GridItem = ({ children, xs, md }) => (
    <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 45%' } }}>{children}</Box>
  );

  return (
    <Box sx={{ bgcolor: '#080C14', minHeight: '100vh' }}>
      <Box
        onClick={() => navigate(-1)}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          cursor: 'pointer',
          mb: 2,
          mx: 2,
          mt: 2,
        }}
      >
        <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'white' }}>
          ← Back
        </Typography>
      </Box>

      <Box sx={{ background: GRAD, py: 6, mb: 4 }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Cookie sx={{ fontSize: 64, color: 'white', display: 'block', mx: 'auto', mb: 2 }} />
            <Typography
              variant="h2"
              sx={{ fontWeight: 800, textAlign: 'center', color: 'white', mb: 2 }}
            >
              Cookies Policy
            </Typography>
            <Typography
              variant="body1"
              sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.8)' }}
            >
              Last Updated: {lastUpdated}
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 6 }}>
        <Paper sx={{ p: 4, bgcolor: alpha('#FFFFFF', 0.02), borderRadius: 3, mb: 4 }}>
          <Typography variant="body1" sx={{ color: alpha('#FFFFFF', 0.8), lineHeight: 1.8 }}>
            This Cookies Policy explains what cookies are, how we use them, and your choices
            regarding their use. By using Aleyo's platform, you consent to the use of cookies in
            accordance with this policy.
          </Typography>
        </Paper>

        <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 700 }}>
          🍪 What Are Cookies?
        </Typography>
        <Paper sx={{ p: 3, bgcolor: alpha('#FFFFFF', 0.02), borderRadius: 3, mb: 4 }}>
          <Typography variant="body1" sx={{ color: alpha('#FFFFFF', 0.7), lineHeight: 1.8 }}>
            Cookies are small text files that websites place on your device to store information
            about your preferences, login status, and browsing behavior. They help us provide you
            with a better experience by remembering your settings and understanding how you use our
            platform.
          </Typography>
        </Paper>

        <Alert severity="success" sx={{ bgcolor: alpha(G_END, 0.1), mb: 4 }}>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HeartBroken /> <strong>Privacy-first approach:</strong> We do not use Google Analytics,
            Facebook Pixel, or any third-party advertising cookies. Our analytics are self-hosted
            and privacy-focused.
          </Typography>
        </Alert>

        <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 700 }}>
          📋 Types of Cookies We Use
        </Typography>
        <TableContainer
          component={Paper}
          sx={{ bgcolor: alpha('#FFFFFF', 0.03), mb: 4, overflowX: 'auto' }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cookie Type</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Duration</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Required</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cookieTypes.map((cookie) => (
                <TableRow key={cookie.name}>
                  <TableCell sx={{ color: 'white' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {cookie.icon}
                      {cookie.name}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>
                    <Typography variant="body2">{cookie.description}</Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: alpha('#FFFFFF', 0.4), display: 'block', mt: 0.5 }}
                    >
                      Examples: {cookie.examples.join(', ')}
                    </Typography>
                    {cookie.note && (
                      <Typography
                        variant="caption"
                        sx={{ color: G_START, display: 'block', mt: 0.5 }}
                      >
                        {cookie.note}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>{cookie.duration}</TableCell>
                  <TableCell>
                    {cookie.required ? (
                      <Chip
                        label="Always Active"
                        size="small"
                        sx={{ bgcolor: alpha(G_END, 0.2), color: G_END }}
                      />
                    ) : (
                      <Switch
                        checked={cookiePreferences[cookie.name.toLowerCase().replace(' ', '')]}
                        onChange={() => handleToggle(cookie.name.toLowerCase().replace(' ', ''))}
                        sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G_START } }}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 700 }}>
          ⚙️ Manage Your Preferences
        </Typography>
        <Paper sx={{ p: 3, bgcolor: alpha('#FFFFFF', 0.02), borderRadius: 3, mb: 4 }}>
          <Typography variant="body1" sx={{ color: alpha('#FFFFFF', 0.7), mb: 3 }}>
            You can control and manage cookies in several ways. Please note that disabling certain
            cookies may affect the functionality of our platform.
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: 1, minWidth: 250 }}>
              <Paper sx={{ p: 2, bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ color: G_START, fontWeight: 600, mb: 1 }}>
                  Browser Settings
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.6) }}>
                  Most browsers allow you to block or delete cookies through their settings.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                  <Chip label="Chrome" size="small" sx={{ bgcolor: alpha('#FFFFFF', 0.1) }} />
                  <Chip label="Firefox" size="small" sx={{ bgcolor: alpha('#FFFFFF', 0.1) }} />
                  <Chip label="Safari" size="small" sx={{ bgcolor: alpha('#FFFFFF', 0.1) }} />
                  <Chip label="Edge" size="small" sx={{ bgcolor: alpha('#FFFFFF', 0.1) }} />
                </Box>
              </Paper>
            </Box>
            <Box sx={{ flex: 1, minWidth: 250 }}>
              <Paper sx={{ p: 2, bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ color: G_START, fontWeight: 600, mb: 1 }}>
                  Our Cookie Settings
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.6) }}>
                  Use the toggles above to enable or disable non-essential cookies.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                  <Button
                    size="small"
                    onClick={acceptAll}
                    sx={{ background: GRAD, color: 'white', borderRadius: '20px' }}
                  >
                    Accept All
                  </Button>
                  <Button
                    size="small"
                    onClick={rejectNonEssential}
                    variant="outlined"
                    sx={{
                      borderColor: alpha('#FFFFFF', 0.2),
                      color: 'white',
                      borderRadius: '20px',
                    }}
                  >
                    Reject Non-Essential
                  </Button>
                  <Button
                    size="small"
                    onClick={savePreferences}
                    variant="outlined"
                    sx={{ borderColor: G_START, color: G_START, borderRadius: '20px' }}
                  >
                    Save Preferences
                  </Button>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Paper>

        <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 700 }}>
          📊 Third-Party Cookies
        </Typography>
        <Paper sx={{ p: 3, bgcolor: alpha('#FFFFFF', 0.02), borderRadius: 3, mb: 4 }}>
          <Typography variant="body1" sx={{ color: alpha('#FFFFFF', 0.7), lineHeight: 1.8 }}>
            We use third-party services that may set cookies on your device. These include:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
            {[
              {
                name: 'Stripe',
                purpose: 'Payment processing',
                policy: 'https://stripe.com/privacy',
              },
              {
                name: 'GoCardless',
                purpose: 'Direct Debit payments',
                policy: 'https://gocardless.com/privacy',
              },
            ].map((service, idx) => (
              <Box key={idx} sx={{ flex: '1 1 200px' }}>
                <Paper sx={{ p: 2, bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
                    {service.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: alpha('#FFFFFF', 0.5), display: 'block' }}
                  >
                    {service.purpose}
                  </Typography>
                  <Link
                    href={service.policy}
                    target="_blank"
                    sx={{ color: G_START, fontSize: '0.7rem', mt: 0.5, display: 'inline-block' }}
                  >
                    Privacy Policy →
                  </Link>
                </Paper>
              </Box>
            ))}
          </Box>
          <Alert severity="info" sx={{ mt: 2, bgcolor: alpha(G_START, 0.1) }}>
            <Typography variant="body2">
              Note: Aleyo does NOT use advertising cookies (Google Ads, Facebook Pixel, etc.). The
              only third-party cookies are for payment processing, which are strictly necessary for
              transactions.
            </Typography>
          </Alert>
        </Paper>

        <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 700 }}>
          🔄 Updates to This Policy
        </Typography>
        <Paper sx={{ p: 3, bgcolor: alpha('#FFFFFF', 0.02), borderRadius: 3, mb: 4 }}>
          <Typography variant="body1" sx={{ color: alpha('#FFFFFF', 0.7), lineHeight: 1.8 }}>
            We may update this Cookies Policy from time to time to reflect changes in technology,
            regulation, or our business practices. We will notify you of any material changes via
            email or a notice on our platform.
          </Typography>
        </Paper>

        <Box sx={{ textAlign: 'center' }}>
          <Divider sx={{ borderColor: alpha('#FFFFFF', 0.1), mb: 3 }} />
          <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.3) }}>
            © 2025 Aleyo — All rights reserved
          </Typography>
        </Box>
      </Container>

      {/* Cookie Consent Banner */}
      {showBanner && (
        <Paper
          sx={{
            position: 'fixed',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: 800,
            p: 3,
            bgcolor: '#0A0F1A',
            border: `1px solid ${alpha(G_START, 0.3)}`,
            borderRadius: 3,
            zIndex: 9999,
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <Box sx={{ flex: 2, minWidth: 200 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Cookie sx={{ color: G_START }} />
                <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                  We value your privacy
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.6) }}>
                We use only essential and preference cookies. No third-party advertising cookies.
                <Link href="/cookies-policy" sx={{ color: G_START, ml: 0.5 }}>
                  Learn more
                </Link>
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                onClick={rejectNonEssential}
                sx={{ borderColor: alpha('#FFFFFF', 0.2), color: 'white', borderRadius: '40px' }}
              >
                Reject Non-Essential
              </Button>
              <Button
                variant="contained"
                onClick={acceptAll}
                sx={{ background: GRAD, borderRadius: '40px' }}
              >
                Accept All
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ bgcolor: '#1A1F2E', color: 'white' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CookiesPolicy;
