// src/components/Layout/Navbar.js
import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Tooltip,
  alpha,
  useScrollTrigger,
  Slide,
  InputBase,
  Chip,
  Collapse,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  DesignServices,
  Code,
  Extension,
  School,
  AccountCircle,
  Logout,
  Settings,
  Help,
  DarkMode,
  LightMode,
  Notifications,
  Search,
  Close,
  KeyboardArrowDown,
  Home,
  Storefront,
  Payment,
  AdminPanelSettings,
  Rocket,
  Star,
} from '@mui/icons-material';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../logo.png';


const G_START = '#4F6EF7';
const G_MID = '#2DBCB6';
const G_END = '#3ED67C';
const GRAD = `linear-gradient(135deg, ${G_START} 0%, ${G_MID} 50%, ${G_END} 100%)`;

// Hide on scroll component
function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Mock notifications
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Your project was published!', read: false, time: '5 min ago', type: 'success' },
    {
      id: 2,
      text: 'New AI design templates available',
      read: false,
      time: '1 hour ago',
      type: 'info',
    },
    {
      id: 3,
      text: '50 free credits added to your account',
      read: true,
      time: '1 day ago',
      type: 'success',
    },
  ]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
    // Mark as read when opened
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
    setActiveDropdown(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Navigation items
  const navItems = [
    { label: 'Home', path: '/', icon: <Home />, auth: 'public' },
    { label: 'Dashboard', path: '/dashboard', icon: <Dashboard />, auth: 'private' },
    { label: 'Designs', path: '/designs', icon: <DesignServices />, auth: 'public' },
    { label: 'Integrations', path: '/integrations', icon: <Extension />, auth: 'public' },
    { label: 'Tutorials', path: '/tutorials', icon: <School />, auth: 'public' },
    { label: 'Pricing', path: '/pricing', icon: <Payment />, auth: 'public' },
  ];

  const dropdownItems = [
    {
      label: 'Products',
      icon: <Rocket />,
      items: [
        { label: 'Website Builder', path: '/designs', description: 'Create stunning websites' },
        { label: 'AI Assistant', path: '/voice-assistant', description: 'Voice-powered design' },
        { label: 'Saved Projects', path: '/saved-projects', description: 'Professional designs' },
      ],
    },
    {
      label: 'Resources',
      icon: <School />,
      items: [
        { label: 'Documentation', path: '/docs', description: 'Learn how to use' },
        { label: 'API Reference', path: '/api-reference', description: 'Developer resources' },
        { label: 'Support', path: '/support', description: 'Get help' },
      ],
    },
  ];

  const filteredNavItems = navItems.filter((item) => {
    if (item.auth === 'private') return isAuthenticated;
    if (item.auth === 'public') return true;
    return true;
  });

  const isActive = (path) => {
    if (path === '/') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <HideOnScroll>
        <AppBar
          position="fixed"
          elevation={scrolled ? 8 : 0}
          sx={{
            background: scrolled ? 'rgba(8, 12, 20, 0.95)' : 'rgba(8, 12, 20, 0.8)',
            backdropFilter: 'blur(12px)',
            borderBottom: `1px solid ${alpha('#FFFFFF', 0.08)}`,
            transition: 'all 0.3s ease',
          }}
        >
          <Container maxWidth="xl">
            <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <img src={Logo} alt="Aleyo" style={{ height: 90, width: 140 }} />
                  <Typography
                    variant="h6"
                    sx={{
                      background: GRAD,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      fontWeight: 700,
                      display: { xs: 'none', sm: 'block' },
                    }}
                  >
                    
                  </Typography>
                </Box>
              </motion.div>

              {/* Desktop Navigation */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                {filteredNavItems.map((item) => (
                  <Button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      color: isActive(item.path) ? G_START : 'rgba(255,255,255,0.7)',
                      fontWeight: isActive(item.path) ? 600 : 400,
                      '&:hover': {
                        background: alpha(G_START, 0.1),
                        color: G_START,
                      },
                      borderRadius: '8px',
                      px: 2,
                      py: 1,
                    }}
                  >
                    {item.label}
                  </Button>
                ))}

                {/* Dropdown Menus */}
                {dropdownItems.map((dropdown) => (
                  <Box
                    key={dropdown.label}
                    onMouseEnter={() => setActiveDropdown(dropdown.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                    sx={{ position: 'relative' }}
                  >
                    <Button
                      sx={{
                        color:
                          activeDropdown === dropdown.label ? G_START : 'rgba(255,255,255,0.7)',
                        '&:hover': {
                          background: alpha(G_START, 0.1),
                          color: G_START,
                        },
                        borderRadius: '8px',
                        px: 2,
                        py: 1,
                      }}
                      endIcon={<KeyboardArrowDown sx={{ fontSize: 16 }} />}
                    >
                      {dropdown.label}
                    </Button>
                    <Collapse in={activeDropdown === dropdown.label} timeout="auto" unmountOnExit>
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          mt: 1,
                          minWidth: 260,
                          background: '#0D1220',
                          border: `1px solid ${alpha('#FFFFFF', 0.1)}`,
                          borderRadius: '12px',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                          overflow: 'hidden',
                          zIndex: 1000,
                        }}
                      >
                        {dropdown.items.map((item) => (
                          <MenuItem
                            key={item.path}
                            onClick={() => handleNavigation(item.path)}
                            sx={{
                              py: 1.5,
                              px: 2,
                              '&:hover': { background: alpha(G_START, 0.1) },
                            }}
                          >
                            <Box>
                              <Typography
                                variant="subtitle2"
                                sx={{ color: 'white', fontWeight: 600 }}
                              >
                                {item.label}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                {item.description}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Box>
                    </Collapse>
                  </Box>
                ))}
              </Box>

              {/* Right Section */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* Search Button */}
                <Tooltip title="Search">
                  <IconButton
                    onClick={() => setSearchOpen(true)}
                    sx={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    <Search />
                  </IconButton>
                </Tooltip>

                {/* Notifications */}
                {isAuthenticated && (
                  <Tooltip title="Notifications">
                    <IconButton
                      onClick={handleNotificationsOpen}
                      sx={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                      <Badge badgeContent={unreadCount} color="error">
                        <Notifications />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                )}

                {/* User Menu */}
                {isAuthenticated ? (
                  <>
                    <Tooltip title="Account">
                      <IconButton
                        onClick={handleMenuOpen}
                        sx={{
                          p: 0.5,
                          border: `2px solid ${alpha(G_START, 0.5)}`,
                          '&:hover': { borderColor: G_START },
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            background: GRAD,
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        >
                          {user?.name?.charAt(0) || 'U'}
                        </Avatar>
                      </IconButton>
                    </Tooltip>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      PaperProps={{
                        sx: {
                          mt: 1.5,
                          minWidth: 200,
                          background: '#0D1220',
                          border: `1px solid ${alpha('#FFFFFF', 0.1)}`,
                          borderRadius: '12px',
                        },
                      }}
                    >
                      <Box
                        sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${alpha('#FFFFFF', 0.1)}` }}
                      >
                        <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
                          {user?.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                          {user?.email}
                        </Typography>
                        <Chip
                          label={`${user?.credits || 0} Credits`}
                          size="small"
                          sx={{
                            mt: 1,
                            background: alpha(G_START, 0.2),
                            color: G_START,
                            fontSize: '0.7rem',
                          }}
                        />
                      </Box>
                      <MenuItem
                        onClick={() => {
                          handleMenuClose();
                          navigate('/dashboard');
                        }}
                      >
                        <ListItemIcon>
                          <Dashboard fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Dashboard</ListItemText>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleMenuClose();
                          navigate('/settings');
                        }}
                      >
                        <ListItemIcon>
                          <Settings fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Settings</ListItemText>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleMenuClose();
                          navigate('/support');
                        }}
                      >
                        <ListItemIcon>
                          <Help fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Help & Support</ListItemText>
                      </MenuItem>
                      {user?.role === 'admin' && (
                        <MenuItem
                          onClick={() => {
                            handleMenuClose();
                            navigate('/admin');
                          }}
                        >
                          <ListItemIcon>
                            <AdminPanelSettings fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>Admin Panel</ListItemText>
                        </MenuItem>
                      )}
                      <Divider sx={{ borderColor: alpha('#FFFFFF', 0.1) }} />
                      <MenuItem onClick={handleLogout} sx={{ color: '#EF4444' }}>
                        <ListItemIcon>
                          <Logout fontSize="small" sx={{ color: '#EF4444' }} />
                        </ListItemIcon>
                        <ListItemText>Logout</ListItemText>
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="text"
                      onClick={() => navigate('/login')}
                      sx={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                      Login
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => navigate('/signup')}
                      sx={{
                        background: GRAD,
                        '&:hover': { opacity: 0.9 },
                        borderRadius: '8px',
                      }}
                    >
                      Sign Up
                    </Button>
                  </Box>
                )}

                {/* Mobile Menu Button */}
                <IconButton
                  onClick={() => setMobileOpen(true)}
                  sx={{ display: { xs: 'flex', md: 'none' }, color: 'white' }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            background: '#0D1220',
            borderLeft: `1px solid ${alpha('#FFFFFF', 0.1)}`,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <img src={Logo} alt="Aleyo" style={{ height: 32 }} />
          <IconButton onClick={() => setMobileOpen(false)} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: alpha('#FFFFFF', 0.1) }} />
        <List sx={{ flex: 1 }}>
          {navItems.map((item) => (
            <ListItem
              button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&:hover': { background: alpha(G_START, 0.1) },
                borderLeft: isActive(item.path) ? `3px solid ${G_START}` : '3px solid transparent',
              }}
            >
              <ListItemIcon sx={{ color: isActive(item.path) ? G_START : 'rgba(255,255,255,0.5)' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  sx: {
                    color: isActive(item.path) ? G_START : 'white',
                    fontWeight: isActive(item.path) ? 600 : 400,
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
        {!isAuthenticated && (
          <Box sx={{ p: 2, borderTop: `1px solid ${alpha('#FFFFFF', 0.1)}` }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleNavigation('/login')}
              sx={{ mb: 1, borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            >
              Login
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={() => handleNavigation('/signup')}
              sx={{ background: GRAD }}
            >
              Sign Up
            </Button>
          </Box>
        )}
      </Drawer>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={handleNotificationsClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: 320,
            maxHeight: 400,
            background: '#0D1220',
            border: `1px solid ${alpha('#FFFFFF', 0.1)}`,
            borderRadius: '12px',
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: `1px solid ${alpha('#FFFFFF', 0.1)}` }}>
          <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
            Notifications
          </Typography>
        </Box>
        {notifications.map((notification) => (
          <MenuItem
            key={notification.id}
            sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 1.5 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              {notification.type === 'success' && <Star sx={{ fontSize: 16, color: G_END }} />}
              <Typography
                variant="body2"
                sx={{ color: notification.read ? 'rgba(255,255,255,0.5)' : 'white' }}
              >
                {notification.text}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>
              {notification.time}
            </Typography>
          </MenuItem>
        ))}
        <Box sx={{ p: 1, borderTop: `1px solid ${alpha('#FFFFFF', 0.1)}` }}>
          <Button size="small" fullWidth sx={{ color: G_START }} onClick={() => window.open('/notifications', '_blank')}>
            View All
          </Button>
        </Box>
      </Menu>

      {/* Search Dialog */}
      <AnimatePresence>
        {searchOpen && (
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0,0,0,0.9)',
              zIndex: 2000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => setSearchOpen(false)}
          >
            <Box
              component={motion.form}
              initial={{ scale: 0.9, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: -20 }}
              sx={{
                width: '90%',
                maxWidth: 600,
                bgcolor: '#0D1220',
                borderRadius: '16px',
                p: 2,
                border: `1px solid ${alpha(G_START, 0.3)}`,
              }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSearch}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Search sx={{ color: 'rgba(255,255,255,0.5)' }} />
                <InputBase
                  autoFocus
                  fullWidth
                  placeholder="Search for designs, tutorials, integrations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ color: 'white', fontSize: '1.1rem' }}
                />
                <IconButton
                  onClick={() => setSearchOpen(false)}
                  sx={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  <Close />
                </IconButton>
              </Box>
            </Box>
          </Box>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
