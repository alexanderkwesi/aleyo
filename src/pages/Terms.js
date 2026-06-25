// TermsOfService.js
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  alpha,
  Link,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Grid,
} from '@mui/material';
import {
  ExpandMore,
  Gavel,
  Payment,
  Security,
  Build,
  Block,
  Copyright,
  Warning as WarningIcon,
  CheckCircle,
  Description,
  People,
  CloudQueue,
  Speed,
  Storefront,
  Code,
  HeartBroken,
  DesignServices,
  IntegrationInstructions,
  Storage,
  Api,
  Analytics,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const G_START = '#4F6EF7';
const G_MID = '#2DBCB6';
const G_END = '#3ED67C';
const GRAD = `linear-gradient(135deg, ${G_START} 0%, ${G_MID} 50%, ${G_END} 100%)`;

const TermsOfService = () => {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState(null);
  const [lastUpdated] = useState('January 15, 2025');

  const handleSectionChange = (section) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? section : null);
  };

  const sections = [
    {
      id: 'acceptance',
      title: '📜 Acceptance of Terms',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            By accessing or using Aleyo's website builder platform, you agree to be bound by these
            Terms of Service and our Privacy Policy. If you do not agree to these terms, please do
            not use our services.
          </Typography>
          <Alert severity="info" sx={{ bgcolor: alpha(G_START, 0.1) }}>
            These terms apply to all users, including free trial users, paid subscribers, and
            enterprise customers.
          </Alert>
        </Box>
      ),
    },
    {
      id: 'services',
      title: '🛠️ Description of Services',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Aleyo provides a drag-and-drop website builder platform that includes:
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {[
              {
                icon: <DesignServices sx={{ fontSize: 24 }} />,
                name: 'Website Builder',
                desc: 'Create and customize websites visually',
              },
              {
                icon: <span style={{ fontSize: 24 }}>🤖</span>,
                name: 'AI Voice Assistant',
                desc: 'Voice-controlled design generation',
              },
              {
                icon: <IntegrationInstructions sx={{ fontSize: 24 }} />,
                name: 'Integrations',
                desc: 'Connect third-party services',
              },
              {
                icon: <Storage sx={{ fontSize: 24 }} />,
                name: 'Cloud Hosting',
                desc: 'Secure website hosting and publishing',
              },
              {
                icon: <Api sx={{ fontSize: 24 }} />,
                name: 'API Access',
                desc: 'Programmatic control of your designs',
              },
              {
                icon: <Analytics sx={{ fontSize: 24 }} />,
                name: 'Analytics',
                desc: 'Privacy-first website analytics',
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
                      {item.name}
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
      id: 'no-ads',
      title: '🚫 No Third-Party Ads Commitment',
      content: (
        <Box>
          <Alert severity="success" sx={{ bgcolor: alpha(G_END, 0.1), mb: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <HeartBroken sx={{ color: G_END }} /> Aleyo is proudly ad-free
            </Typography>
          </Alert>
          <Typography variant="body1" paragraph>
            Unlike many platforms, Aleyo does not display third-party advertisements. Our business
            model is based on subscriptions, not selling your attention or data to advertisers.
          </Typography>
          <ul style={{ color: alpha('#FFFFFF', 0.7) }}>
            <li>No display ads on your published websites</li>
            <li>No pop-ups or banner advertisements</li>
            <li>No third-party ad networks (Google Ads, etc.)</li>
            <li>No tracking pixels for ad retargeting</li>
            <li>Your websites remain ad-free by default</li>
          </ul>
          <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.5), mt: 2 }}>
            Enterprise customers may choose to display their own advertisements, but Aleyo never
            injects third-party ads.
          </Typography>
        </Box>
      ),
    },
    {
      id: 'accounts',
      title: '👤 User Accounts',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            To use our services, you must create an account. You agree to:
          </Typography>
          <ul style={{ color: alpha('#FFFFFF', 0.7) }}>
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Notify us immediately of any unauthorized access</li>
          </ul>
          <Alert severity="warning" sx={{ mt: 2, bgcolor: alpha('#FFA726', 0.1) }}>
            You are responsible for maintaining the confidentiality of your password. Aleyo cannot
            and will not be liable for any loss or damage from your failure to comply with this
            security obligation.
          </Alert>
        </Box>
      ),
    },
    {
      id: 'acceptable-use',
      title: '✅ Acceptable Use Policy',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            You agree not to use Aleyo's services for:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: alpha('#FF4444', 0.05),
                  border: `1px solid ${alpha('#FF4444', 0.2)}`,
                  borderRadius: 2,
                }}
              >
                <Typography variant="subtitle2" sx={{ color: '#FF4444', fontWeight: 600, mb: 1 }}>
                  Prohibited Content
                </Typography>
                <ul style={{ color: alpha('#FFFFFF', 0.7), margin: 0, paddingLeft: 20 }}>
                  <li>Illegal activities or content</li>
                  <li>Hate speech or harassment</li>
                  <li>Malware or harmful code</li>
                  <li>Copyright-infringing material</li>
                  <li>Phishing or fraud schemes</li>
                </ul>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: alpha('#FF4444', 0.05),
                  border: `1px solid ${alpha('#FF4444', 0.2)}`,
                  borderRadius: 2,
                }}
              >
                <Typography variant="subtitle2" sx={{ color: '#FF4444', fontWeight: 600, mb: 1 }}>
                  Prohibited Actions
                </Typography>
                <ul style={{ color: alpha('#FFFFFF', 0.7), margin: 0, paddingLeft: 20 }}>
                  <li>Reverse engineering our platform</li>
                  <li>Attempting to bypass security measures</li>
                  <li>Overloading our infrastructure</li>
                  <li>Scraping or data mining</li>
                  <li>Reselling access without permission</li>
                </ul>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      ),
    },
    {
      id: 'intellectual-property',
      title: '©️ Intellectual Property',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            <strong>Our IP:</strong> Aleyo's platform, including its code, design, templates, and
            trademarks, is our exclusive property.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Your IP:</strong> You retain ownership of all content you create using Aleyo. By
            using our platform, you grant us a license to host and display your content as necessary
            to provide our services.
          </Typography>
          <Alert severity="success" sx={{ bgcolor: alpha(G_END, 0.1) }}>
            ✓ You own your designs. We will never claim ownership of your websites or content.
          </Alert>
        </Box>
      ),
    },
    {
      id: 'payments',
      title: '💳 Payments & Subscriptions',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Our services are offered on a subscription basis. By purchasing a subscription, you
            agree to:
          </Typography>
          <ul style={{ color: alpha('#FFFFFF', 0.7) }}>
            <li>Pay all applicable fees as described at the time of purchase</li>
            <li>Provide accurate billing information</li>
            <li>Authorize recurring charges for your subscription period</li>
          </ul>

          <TableContainer component={Paper} sx={{ bgcolor: alpha('#FFFFFF', 0.03), my: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Plan</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Monthly Price</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Yearly Price</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>AI Credits</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Starter</TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>$29</TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>$290</TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>500</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Pro</TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>$79</TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>$790</TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>2000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Enterprise</TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>$199</TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>$1990</TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>10000</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Refund Policy
          </Typography>
          <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.7) }}>
            All plans include a 14-day money-back guarantee. If you're not satisfied within 14 days
            of your first payment, contact support for a full refund. After 14 days, subscription
            fees are non-refundable.
          </Typography>
        </Box>
      ),
    },
    {
      id: 'credits',
      title: '🎫 AI Credits',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            AI credits are used to power AI features including voice commands, template generation,
            and smart suggestions.
          </Typography>
          <ul style={{ color: alpha('#FFFFFF', 0.7) }}>
            <li>Credits are added to your account monthly based on your plan</li>
            <li>Unused credits expire at the end of each month</li>
            <li>Additional credits can be purchased from your dashboard</li>
            <li>Credits are non-transferable and non-refundable</li>
          </ul>
          <Chip
            label="~100 credits = 1 full website"
            size="small"
            sx={{ bgcolor: alpha(G_START, 0.2), color: G_START }}
          />
        </Box>
      ),
    },
    {
      id: 'cancellation',
      title: '⏸️ Cancellation & Termination',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            <strong>By You:</strong> You may cancel your subscription at any time from your
            Dashboard. Cancellation will take effect at the end of your current billing period.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>By Us:</strong> We may suspend or terminate your account for:
          </Typography>
          <ul style={{ color: alpha('#FFFFFF', 0.7) }}>
            <li>Violation of these Terms of Service</li>
            <li>Non-payment of fees</li>
            <li>Extended periods of inactivity</li>
            <li>Legal or regulatory requirements</li>
          </ul>
          <Alert severity="info" sx={{ bgcolor: alpha(G_START, 0.1) }}>
            Upon termination, you will have 30 days to export your data before it is permanently
            deleted.
          </Alert>
        </Box>
      ),
    },
    {
      id: 'limitations',
      title: '⚠️ Disclaimer & Limitations',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            <strong>Disclaimer:</strong> Our services are provided "as is" without warranties of any
            kind. We do not guarantee that the platform will be uninterrupted or error-free.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Limitation of Liability:</strong> To the maximum extent permitted by law, Aleyo
            shall not be liable for any indirect, incidental, or consequential damages arising from
            your use of our services.
          </Typography>
          <Paper sx={{ p: 2, bgcolor: alpha('#FFA726', 0.05), borderRadius: 2 }}>
            <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.7) }}>
              Our total liability to you shall not exceed the amount you paid us in the 12 months
              preceding the claim.
            </Typography>
          </Paper>
        </Box>
      ),
    },
    {
      id: 'governing-law',
      title: '⚖️ Governing Law',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            These Terms shall be governed by and construed in accordance with the laws of England
            and Wales, without regard to its conflict of law provisions.
          </Typography>
          <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.5) }}>
            Any disputes arising from these Terms shall be resolved exclusively in the courts of
            London, United Kingdom.
          </Typography>
        </Box>
      ),
    },
    {
      id: 'changes',
      title: '📝 Changes to Terms',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            We reserve the right to modify these Terms at any time. We will notify users of material
            changes via:
          </Typography>
          <ul style={{ color: alpha('#FFFFFF', 0.7) }}>
            <li>Email notification to registered users</li>
            <li>Notice in your dashboard</li>
            <li>Updated "Last Updated" date on this page</li>
          </ul>
          <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.5) }}>
            Your continued use of the platform after changes constitutes acceptance of the modified
            Terms.
          </Typography>
        </Box>
      ),
    },
    {
      id: 'contact',
      title: '📞 Contact Information',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Questions about these Terms of Service? Contact us:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2 }}>
                <span style={{ fontSize: 20 }}>📧</span>
                <Typography variant="subtitle2" sx={{ color: 'white' }}>
                  Email
                </Typography>
                <Link href="mailto:legal@aleyo.com" sx={{ color: G_START }}>
                  legal@aleyo.com
                </Link>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2 }}>
                <Gavel sx={{ color: G_START, mb: 1 }} />
                <Typography variant="subtitle2" sx={{ color: 'white' }}>
                  Legal Department
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.6) }}>
                  Aleyo Legal
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
      {/* Back Button */}
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
              sx={{ fontWeight: 800, textAlign: 'center', color: 'white', mb: 2 }}
            >
              Terms of Service
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
        {/* Introduction */}
        <Paper sx={{ p: 4, bgcolor: alpha('#FFFFFF', 0.02), borderRadius: 3, mb: 4 }}>
          <Typography variant="body1" sx={{ color: alpha('#FFFFFF', 0.8), lineHeight: 1.8 }}>
            These Terms of Service constitute a legally binding agreement between you and Aleyo
            regarding your use of our website builder platform. By accessing or using our services,
            you acknowledge that you have read, understood, and agree to be bound by these terms.
          </Typography>
        </Paper>

        {/* Accordion Sections */}
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

        {/* Footer */}
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

export default TermsOfService;
