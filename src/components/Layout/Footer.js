// src/components/Layout/Footer.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  TextField,
  Button,
  Divider,
  Stack,
  Chip,
  Collapse,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  GitHub,
  YouTube,
  Email,
  Phone,
  LocationOn,
  Copyright,
  ExpandLess,
  ExpandMore,
  Verified,
  Security,
  Payment,
  ArrowUpward,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const G_START = '#4F6EF7';
const G_MID = '#2DBCB6';
const G_END = '#3ED67C';
const GRAD = `linear-gradient(135deg, ${G_START} 0%, ${G_MID} 50%, ${G_END} 100%)`;

const Footer = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [openSections, setOpenSections] = useState({
    product: false,
    resources: false,
    company: false,
    legal: false,
  });
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Handle newsletter subscription
      setNewsletterSuccess(true);
      setTimeout(() => setNewsletterSuccess(false), 3000);
      setEmail('');
    }
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const footerSections = {
    product: {
      title: 'Product',
      links: [
        { label: 'Features', path: '/features' },
        { label: 'Templates', path: '/designs' },
        { label: 'Integrations', path: '/integrations' },
        { label: 'Pricing', path: '/pricing' },
        { label: 'Changelog', path: '/changelog' },
        { label: 'Roadmap', path: '/roadmap' },
      ],
    },
    resources: {
      title: 'Resources',
      links: [
        { label: 'Documentation', path: '/docs' },
        { label: 'Tutorials', path: '/tutorials' },
        { label: 'API Reference', path: '/api' },
        { label: 'Blog', path: '/blog' },
        { label: 'Community', path: '/community' },
        { label: 'Support', path: '/support' },
      ],
    },
    company: {
      title: 'Company',
      links: [
        { label: 'About Us', path: '/about' },
        { label: 'Careers', path: '/careers', badge: "We're hiring!" },
        { label: 'Press Kit', path: '/press' },
        { label: 'Contact', path: '/contact' },
        { label: 'Partners', path: '/partners' },
        { label: 'Affiliates', path: '/affiliates' },
      ],
    },
    legal: {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', path: '/privacy' },
        { label: 'Terms of Service', path: '/terms' },
        { label: 'Cookie Policy', path: '/cookies' },
        { label: 'GDPR', path: '/gdpr' },
        { label: 'Security', path: '/security' },
        { label: 'Acceptable Use', path: '/acceptable-use' },
      ],
    },
  };

  const socialLinks = [
    { icon: <Facebook />, url: 'https://facebook.com/aleyo', color: '#1877F2' },
    { icon: <Twitter />, url: 'https://twitter.com/aleyo', color: '#1DA1F2' },
    { icon: <Instagram />, url: 'https://instagram.com/aleyo', color: '#E4405F' },
    { icon: <LinkedIn />, url: 'https://linkedin.com/company/aleyo', color: '#0A66C2' },
    { icon: <GitHub />, url: 'https://github.com/aleyo', color: '#333' },
    { icon: <YouTube />, url: 'https://youtube.com/aleyo', color: '#FF0000' },
  ];

  const trustBadges = [
    { icon: <Verified />, label: 'SSL Secure', color: G_END },
    { icon: <Security />, label: '256-bit Encryption', color: G_START },
    { icon: <Payment />, label: 'PCI Compliant', color: G_MID },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#05080F',
        borderTop: `1px solid ${alpha('#FFFFFF', 0.08)}`,
        position: 'relative',
        mt: 'auto',
      }}
    >
      {/* Main Footer Content */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Brand Column */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h5"
                  sx={{
                    background: GRAD,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    fontWeight: 700,
                    mb: 2,
                  }}
                >
                  Aleyo
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2 }}>
                  Build stunning websites with AI-powered design tools. No coding required. Launch
                  your website in minutes with our intuitive platform.
                </Typography>
              </Box>

              {/* Contact Info */}
              <Stack spacing={1} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email sx={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }} />
                  <Link
                    href="mailto:support@aleyo.com"
                    sx={{
                      color: 'rgba(255,255,255,0.6)',
                      textDecoration: 'none',
                      '&:hover': { color: G_START },
                    }}
                  >
                    support@aleyo.com
                  </Link>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone sx={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }} />
                  <Link
                    href="tel:+1234567890"
                    sx={{
                      color: 'rgba(255,255,255,0.6)',
                      textDecoration: 'none',
                      '&:hover': { color: G_START },
                    }}
                  >
                    +1 (234) 567-890
                  </Link>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn sx={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    123 Tech Street, Silicon Valley, CA 94025
                  </Typography>
                </Box>
              </Stack>

              {/* Social Links */}
              <Stack direction="row" spacing={1}>
                {socialLinks.map((social, index) => (
                  <IconButton
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'rgba(255,255,255,0.6)',
                      '&:hover': { color: social.color, transform: 'translateY(-2px)' },
                      transition: 'all 0.3s',
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Stack>
            </motion.div>
          </Grid>

          {/* Desktop Links */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={4} sx={{ display: { xs: 'none', md: 'flex' } }}>
              {Object.entries(footerSections).map(([key, section]) => (
                <Grid item xs={12} sm={6} md={3} key={key}>
                  <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                    {section.title}
                  </Typography>
                  <Stack spacing={1}>
                    {section.links.map((link) => (
                      <Link
                        key={link.label}
                        component={RouterLink}
                        to={link.path}
                        sx={{
                          color: 'rgba(255,255,255,0.6)',
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                          '&:hover': { color: G_START, transform: 'translateX(4px)' },
                          transition: 'all 0.2s',
                          display: 'inline-block',
                        }}
                      >
                        {link.label}
                        {link.badge && (
                          <Chip
                            label={link.badge}
                            size="small"
                            sx={{
                              ml: 1,
                              height: 18,
                              fontSize: '0.6rem',
                              bgcolor: alpha(G_END, 0.2),
                              color: G_END,
                            }}
                          />
                        )}
                      </Link>
                    ))}
                  </Stack>
                </Grid>
              ))}
            </Grid>

            {/* Mobile Accordion */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              {Object.entries(footerSections).map(([key, section]) => (
                <Box key={key} sx={{ mb: 1 }}>
                  <Box
                    onClick={() => toggleSection(key)}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1.5,
                      cursor: 'pointer',
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                      {section.title}
                    </Typography>
                    {openSections[key] ? (
                      <ExpandLess sx={{ color: 'white' }} />
                    ) : (
                      <ExpandMore sx={{ color: 'white' }} />
                    )}
                  </Box>
                  <Collapse in={openSections[key]}>
                    <Stack spacing={1} sx={{ pb: 2 }}>
                      {section.links.map((link) => (
                        <Link
                          key={link.label}
                          component={RouterLink}
                          to={link.path}
                          sx={{
                            color: 'rgba(255,255,255,0.6)',
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            '&:hover': { color: G_START },
                            display: 'block',
                            py: 0.5,
                          }}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </Stack>
                  </Collapse>
                  <Divider sx={{ borderColor: alpha('#FFFFFF', 0.08) }} />
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Newsletter Section */}
        <Box
          sx={{
            mt: 6,
            mb: 4,
            p: 4,
            background: `linear-gradient(135deg, ${alpha(G_START, 0.1)} 0%, ${alpha(G_MID, 0.05)} 100%)`,
            borderRadius: '24px',
            border: `1px solid ${alpha(G_START, 0.2)}`,
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                Subscribe to our newsletter
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                Get the latest updates on new features, templates, and exclusive offers.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <form onSubmit={handleNewsletterSubmit}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <TextField
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    size="small"
                    sx={{
                      flex: 1,
                      minWidth: 200,
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(255,255,255,0.05)',
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                        '&:hover fieldset': { borderColor: G_START },
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      background: GRAD,
                      '&:hover': { opacity: 0.9 },
                      px: 3,
                    }}
                  >
                    Subscribe
                  </Button>
                </Box>
                {newsletterSuccess && (
                  <Typography variant="caption" sx={{ color: G_END, mt: 1, display: 'block' }}>
                    ✓ Thanks for subscribing! Check your inbox.
                  </Typography>
                )}
              </form>
            </Grid>
          </Grid>
        </Box>

        {/* Trust Badges */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap', mb: 4 }}>
          {trustBadges.map((badge, index) => (
            <Chip
              key={index}
              icon={badge.icon}
              label={badge.label}
              sx={{
                bgcolor: alpha(badge.color, 0.1),
                color: badge.color,
                '& .MuiChip-icon': { color: badge.color },
              }}
            />
          ))}
        </Box>

        {/* Bottom Bar */}
        <Divider sx={{ borderColor: alpha('#FFFFFF', 0.08), mb: 3 }} />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Copyright sx={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }} />
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
              2024 Aleyo. All rights reserved.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link
              component={RouterLink}
              to="/privacy"
              variant="caption"
              sx={{
                color: 'rgba(255,255,255,0.4)',
                textDecoration: 'none',
                '&:hover': { color: G_START },
              }}
            >
              Privacy
            </Link>
            <Link
              component={RouterLink}
              to="/terms"
              variant="caption"
              sx={{
                color: 'rgba(255,255,255,0.4)',
                textDecoration: 'none',
                '&:hover': { color: G_START },
              }}
            >
              Terms
            </Link>
            <Link
              component={RouterLink}
              to="/cookies"
              variant="caption"
              sx={{
                color: 'rgba(255,255,255,0.4)',
                textDecoration: 'none',
                '&:hover': { color: G_START },
              }}
            >
              Cookies
            </Link>
            <Link
              component={RouterLink}
              to="/sitemap"
              variant="caption"
              sx={{
                color: 'rgba(255,255,255,0.4)',
                textDecoration: 'none',
                '&:hover': { color: G_START },
              }}
            >
              Sitemap
            </Link>
          </Box>
        </Box>
      </Container>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }}
          >
            <IconButton
              onClick={scrollToTop}
              sx={{
                bgcolor: GRAD,
                color: 'white',
                width: 48,
                height: 48,
                '&:hover': { transform: 'translateY(-4px)' },
                transition: 'all 0.3s',
              }}
            >
              <ArrowUpward />
            </IconButton>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default Footer;
