// PrivacyPolicy.js
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Divider,
  Chip,
  alpha,
  Link,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from '@mui/material';
import {
  ExpandMore,
  Security,
  PrivacyTip,
  DataUsage,
  Cookie,
  GppGood,
  VerifiedUser,
  LocationOn,
  Email,
  Phone,
  CreditCard,
  Visibility,
  Delete,
  Download,
  Settings,
  CheckCircle,
  Warning,
  Info,
  Lock,
  CloudQueue,
  Share,
  Analytics,
  Storage,
  Webhook,
  HeartBroken,
  VolunteerActivism,
  Payment,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const G_START = '#4F6EF7';
const G_MID = '#2DBCB6';
const G_END = '#3ED67C';
const GRAD = `linear-gradient(135deg, ${G_START} 0%, ${G_MID} 50%, ${G_END} 100%)`;

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState(null);
  const [lastUpdated] = useState('January 15, 2025');

  const handleSectionChange = (section) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? section : null);
  };

  const sections = [
    {
      id: 'information',
      title: '📋 Information We Collect',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            We collect information that you provide directly to us, information we obtain
            automatically when you use our services, and information from third-party sources.
          </Typography>

          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ color: G_START, fontWeight: 600, mt: 2 }}
          >
            Personal Information You Provide
          </Typography>
          <TableContainer component={Paper} sx={{ bgcolor: alpha('#FFFFFF', 0.03), mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Category</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Examples</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Account Information</TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>
                    Name, email address, password, profile picture
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Billing Information</TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>
                    Payment method, billing address, transaction history
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Project Data</TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>
                    Website designs, uploaded images, text content, components
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Communication Data</TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>
                    Support tickets, feedback, survey responses
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ color: G_START, fontWeight: 600, mt: 2 }}
          >
            Automatically Collected Information
          </Typography>
          <TableContainer component={Paper} sx={{ bgcolor: alpha('#FFFFFF', 0.03) }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Usage Data</TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>
                    Pages visited, features used, time spent, click patterns
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Device Information</TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>
                    IP address, browser type, operating system, device model
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Location Data</TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>
                    Approximate location based on IP address
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Cookies & Tracking</TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>
                    Session cookies, preference cookies, analytics cookies
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ),
    },
    {
      id: 'usage',
      title: '⚙️ How We Use Your Information',
      content: (
        <Box>
          <Grid container spacing={2}>
            {[
              {
                icon: <DesignServices />,
                title: 'Provide Services',
                desc: 'Build, host, and maintain your websites and projects',
              },
              {
                icon: <VolunteerActivism />,
                title: 'Improve Platform',
                desc: 'Analyze usage patterns to enhance features and performance',
              },
              {
                icon: <Email />,
                title: 'Communicate',
                desc: 'Send updates, security alerts, and support responses',
              },
              {
                icon: <Payment />,
                title: 'Process Payments',
                desc: 'Handle subscriptions, credits, and transactions',
              },
              {
                icon: <Security />,
                title: 'Security & Fraud',
                desc: 'Detect and prevent unauthorized access or abuse',
              },
              {
                icon: <Storage />,
                title: 'Data Backup',
                desc: 'Ensure your projects are safely stored and recoverable',
              },
            ].map((item, idx) => (
              <Grid item xs={12} sm={6} key={idx}>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: alpha('#FFFFFF', 0.03),
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Box sx={{ color: G_START }}>{item.icon}</Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                      {item.desc}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      ),
    },
    {
      id: 'sharing',
      title: '🤝 Information Sharing',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            We do not sell your personal information. We may share your information in the following
            circumstances:
          </Typography>

          <TableContainer component={Paper} sx={{ bgcolor: alpha('#FFFFFF', 0.03), mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Recipient Type</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Purpose</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Data Shared</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Service Providers</TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>
                    Hosting, payment processing, analytics
                  </TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>
                    Limited to service provision
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Integration Partners</TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>
                    Stripe, Mailchimp, GoCardless
                  </TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>
                    With your consent only
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Legal Requirements</TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>
                    Court orders, legal processes
                  </TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>As required by law</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Alert severity="info" sx={{ bgcolor: alpha(G_START, 0.1) }}>
            <Typography variant="body2">
              🔒 Your projects and designs remain private by default. Only you can access them
              unless you choose to share.
            </Typography>
          </Alert>
        </Box>
      ),
    },
    {
      id: 'ads',
      title: '📢 Our No-Tracking Commitment',
      icon: <HeartBroken />,
      content: (
        <Box>
          <Alert severity="success" sx={{ bgcolor: alpha(G_END, 0.1), mb: 3 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
              🚫 We Do Not Use Third-Party Ad Trackers
            </Typography>
            <Typography variant="body2">
              Aleyo is committed to your privacy. Unlike most platforms, we do NOT use Google
              Analytics, Facebook Pixel, or any third-party advertising trackers. Your browsing
              behavior is not shared with ad networks.
            </Typography>
          </Alert>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ color: G_END, fontWeight: 600, mb: 1 }}>
                  ✅ What We Don't Do
                </Typography>
                <ul style={{ color: alpha('#FFFFFF', 0.7), margin: 0, paddingLeft: 20 }}>
                  <li>No Google Analytics</li>
                  <li>No Facebook/Meta Pixel</li>
                  <li>No remarketing tags</li>
                  <li>No cross-site tracking</li>
                  <li>No behavioral profiling for ads</li>
                  <li>No selling data to advertisers</li>
                </ul>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ color: G_END, fontWeight: 600, mb: 1 }}>
                  ✅ What We Use Instead
                </Typography>
                <ul style={{ color: alpha('#FFFFFF', 0.7), margin: 0, paddingLeft: 20 }}>
                  <li>Privacy-first self-hosted analytics</li>
                  <li>Anonymous usage metrics only</li>
                  <li>Essential session cookies only</li>
                  <li>Aggregated data (no personal identification)</li>
                  <li>User opt-out at any time</li>
                </ul>
              </Paper>
            </Grid>
          </Grid>

          <Typography
            variant="body2"
            sx={{ color: alpha('#FFFFFF', 0.5), mt: 3, textAlign: 'center' }}
          >
            We believe your data belongs to you. Our business model is based on subscriptions, not
            advertising.
          </Typography>
        </Box>
      ),
    },
    {
      id: 'security',
      title: '🔒 Data Security',
      content: (
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper
                sx={{ p: 3, bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2, textAlign: 'center' }}
              >
                <Lock sx={{ fontSize: 48, color: G_END, mb: 2 }} />
                <Typography variant="h6" sx={{ color: 'white' }}>
                  Encryption
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.6) }}>
                  All data encrypted at rest and in transit using AES-256 and TLS 1.3
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                sx={{ p: 3, bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2, textAlign: 'center' }}
              >
                <VerifiedUser sx={{ fontSize: 48, color: G_END, mb: 2 }} />
                <Typography variant="h6" sx={{ color: 'white' }}>
                  Compliance
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.6) }}>
                  GDPR, CCPA, and other privacy regulations compliant
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Alert severity="warning" sx={{ mt: 3, bgcolor: alpha('#FFA726', 0.1) }}>
            <Typography variant="body2">
              ⚠️ While we implement robust security measures, no method of transmission over the
              internet is 100% secure. We recommend using strong passwords and enabling two-factor
              authentication.
            </Typography>
          </Alert>
        </Box>
      ),
    },
    {
      id: 'rights',
      title: '👤 Your Rights',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Depending on your location, you may have the following rights regarding your personal
            data:
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              {
                icon: <Visibility />,
                right: 'Right to Access',
                desc: 'Request a copy of your data',
              },
              {
                icon: <EditIcon />,
                right: 'Right to Rectify',
                desc: 'Correct inaccurate information',
              },
              {
                icon: <Delete />,
                right: 'Right to Erasure',
                desc: 'Request deletion of your data',
              },
              {
                icon: <Download />,
                right: 'Right to Portability',
                desc: 'Receive data in machine-readable format',
              },
              {
                icon: <Settings />,
                right: 'Right to Object',
                desc: 'Opt-out of certain processing',
              },
              {
                icon: <CancelIcon />,
                right: 'Right to Restrict',
                desc: 'Limit how we use your data',
              },
            ].map((item, idx) => (
              <Grid item xs={12} sm={6} key={idx}>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: alpha('#FFFFFF', 0.03),
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Box sx={{ color: G_START }}>{item.icon}</Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
                      {item.right}
                    </Typography>
                    <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                      {item.desc}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<EmailIcon />}
              onClick={() => (window.location.href = 'mailto:privacy@aleyo.com')}
              sx={{ borderColor: G_START, color: G_START, mr: 2 }}
            >
              Contact Data Protection Officer
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download />}
              sx={{ borderColor: G_MID, color: G_MID }}
            >
              Request My Data
            </Button>
          </Box>
        </Box>
      ),
    },
    {
      id: 'retention',
      title: '⏱️ Data Retention',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            We retain your personal information for as long as necessary to provide our services and
            fulfill the purposes outlined in this policy.
          </Typography>

          <TableContainer component={Paper} sx={{ bgcolor: alpha('#FFFFFF', 0.03) }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Data Type</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                    Retention Period
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Account Information</TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>
                    Until account deletion + 30 days
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Project Data</TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>
                    Until account deletion or manual deletion
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Payment Information</TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>
                    7 years (for tax/legal compliance)
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Usage Analytics</TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>
                    90 days (fully anonymized)
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ),
    },
    {
      id: 'children',
      title: "👶 Children's Privacy",
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Our services are not directed to individuals under 16 years of age. We do not knowingly
            collect personal information from children under 16. If you become aware that a child
            has provided us with personal information, please contact us.
          </Typography>
        </Box>
      ),
    },
    {
      id: 'international',
      title: '🌍 International Data Transfers',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Your information may be transferred to and processed in countries other than your
            country of residence. We ensure appropriate safeguards are in place, including Standard
            Contractual Clauses (SCCs) where required.
          </Typography>
          <Chip label="GDPR Compliant" sx={{ bgcolor: alpha(G_END, 0.2), color: G_END, mr: 1 }} />
          <Chip label="CCPA Compliant" sx={{ bgcolor: alpha(G_START, 0.2), color: G_START }} />
          <Chip label="PECR Compliant" sx={{ bgcolor: alpha(G_MID, 0.2), color: G_MID }} />
        </Box>
      ),
    },
    {
      id: 'changes',
      title: '📝 Changes to This Policy',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            We may update this Privacy Policy from time to time. We will notify you of any material
            changes by:
          </Typography>
          <ul style={{ color: alpha('#FFFFFF', 0.7) }}>
            <li>Posting the new policy on this page</li>
            <li>Sending an email notification to registered users</li>
            <li>Displaying a notice in the dashboard</li>
          </ul>
          <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.5), mt: 2 }}>
            The "Last Updated" date at the top of this page indicates when changes were last made.
          </Typography>
        </Box>
      ),
    },
    {
      id: 'contact',
      title: '📞 Contact Us',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            If you have questions about this Privacy Policy or our data practices, please contact
            us:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2 }}>
                <EmailIcon sx={{ color: G_START, mb: 1 }} />
                <Typography variant="subtitle2" sx={{ color: 'white' }}>
                  Email
                </Typography>
                <Link href="mailto:privacy@aleyo.com" sx={{ color: G_START }}>
                  privacy@aleyo.com
                </Link>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2 }}>
                <LocationOn sx={{ color: G_START, mb: 1 }} />
                <Typography variant="subtitle2" sx={{ color: 'white' }}>
                  Mail
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.6) }}>
                  Aleyo Privacy Team
                  <br />
                  123 Design Street
                  <br />
                  London, UK, EC1A 1BB
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      ),
    },
  ];

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
          '&:hover': { opacity: 0.7 },
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
            <Typography
              variant="h2"
              sx={{ fontWeight: 800, textAlign: 'center', color: 'white', mb: 2 }}
            >
              Privacy Policy
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
            At Aleyo, we take your privacy seriously. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you use our website builder platform.
            Please read this policy carefully. By using our services, you consent to the data
            practices described in this policy.
          </Typography>
        </Paper>

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
            <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'white' }} />}>
              <Typography variant="h6" sx={{ color: 'white' }}>
                {section.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ borderTop: `1px solid ${alpha('#FFFFFF', 0.08)}`, pt: 2 }}>
              {section.content}
            </AccordionDetails>
          </Accordion>
        ))}

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Divider sx={{ borderColor: alpha('#FFFFFF', 0.1), mb: 3 }} />
          <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.3) }}>
            © 2025 Aleyo — All rights reserved
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

// Helper icons
const DesignServices = () => <span style={{ fontSize: 20 }}>🎨</span>;
const EditIcon = () => <span style={{ fontSize: 20 }}>✏️</span>;
const CancelIcon = () => <span style={{ fontSize: 20 }}>⛔</span>;
const EmailIcon = () => <span style={{ fontSize: 20 }}>📧</span>;

export default PrivacyPolicy;
