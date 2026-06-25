import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Button,
  Chip,
  Snackbar,
  Alert,
  Tooltip,
  Badge,
  alpha,
  useTheme,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  CheckCircle,
  Warning,
  Info,
  Error as ErrorIcon,
  Rocket,
  Payment,
  DesignServices,
  IntegrationInstructions,
  Storefront,
  School,
  TrendingUp,
  DoneAll,
  DeleteSweep,
  Settings,
  Markunread,
  MoreVert,
  Refresh,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Gradient colors (matching Dashboard)
const G_START = '#4F6EF7';
const G_MID = '#2DBCB6';
const G_END = '#3ED67C';
const GRAD = `linear-gradient(135deg, ${G_START} 0%, ${G_MID} 50%, ${G_END} 100%)`;

const Notifications = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // State for notifications
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState(0); // 0: All, 1: Unread
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  // Load notifications (mock data)
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    setNotifications([
      {
        id: 1,
        type: 'success',
        title: 'Website Published!',
        message: 'Your business website "My Business Website" is now live at your domain.',
        time: '2 hours ago',
        read: false,
        icon: <Rocket />,
        actionLink: '/dashboard',
        actionText: 'View Site',
      },
      {
        id: 2,
        type: 'info',
        title: 'Stripe Integration Added',
        message: 'Payment processing is now active for your E-commerce Store.',
        time: '5 hours ago',
        read: false,
        icon: <Payment />,
        actionLink: '/studio',
        actionText: 'Configure',
      },
      {
        id: 3,
        type: 'warning',
        title: 'Low Credits Alert',
        message:
          'You have only 75 credits remaining. Consider purchasing more to continue building.',
        time: '1 day ago',
        read: false,
        icon: <Warning />,
        actionLink: '/pricing',
        actionText: 'Buy Credits',
      },
      {
        id: 4,
        type: 'success',
        title: 'Design Merged Successfully',
        message: 'Your "Creative Agency" design has been merged with your Portfolio Site.',
        time: '1 day ago',
        read: true,
        icon: <DesignServices />,
      },
      {
        id: 5,
        type: 'info',
        title: 'New Templates Available',
        message: 'Check out 5 new AI-generated website templates just added to the library.',
        time: '2 days ago',
        read: true,
        icon: <Storefront />,
        actionLink: '/designs',
        actionText: 'Browse',
      },
      {
        id: 6,
        type: 'error',
        title: 'API Integration Failed',
        message: 'Unable to connect to Mailchimp. Please check your API key and try again.',
        time: '3 days ago',
        read: true,
        icon: <IntegrationInstructions />,
        actionLink: '/api-integration',
        actionText: 'Fix Now',
      },
      {
        id: 7,
        type: 'success',
        title: 'Credit Purchase Confirmed',
        message: '500 credits have been added to your account. Thank you for your purchase!',
        time: '5 days ago',
        read: true,
        icon: <TrendingUp />,
      },
      {
        id: 8,
        type: 'info',
        title: 'Tutorial: Advanced Customization',
        message: 'Learn how to add custom CSS and JavaScript to your websites.',
        time: '1 week ago',
        read: true,
        icon: <School />,
        actionLink: '/tutorials',
        actionText: 'Watch Now',
      },
    ]);
  };

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((notif) =>
    activeTab === 0 ? true : !notif.read
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Mark a single notification as read
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
    setSnackbar({ open: true, message: 'Marked as read', severity: 'success' });
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    setSnackbar({ open: true, message: 'All notifications marked as read', severity: 'success' });
  };

  // Delete a single notification
  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    setSnackbar({ open: true, message: 'Notification deleted', severity: 'success' });
  };

  // Delete selected notifications
  const deleteSelected = () => {
    setNotifications((prev) => prev.filter((notif) => !selectedNotifications.includes(notif.id)));
    setSelectedNotifications([]);
    setSnackbar({
      open: true,
      message: `${selectedNotifications.length} notification(s) deleted`,
      severity: 'success',
    });
    handleMenuClose();
  };

  // Select/Deselect notification
  const toggleSelect = (id) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Select all visible notifications
  const selectAll = () => {
    const allIds = filteredNotifications.map((n) => n.id);
    setSelectedNotifications(allIds);
  };

  // Clear all selections
  const clearSelection = () => {
    setSelectedNotifications([]);
  };

  // Handle menu open
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Get icon based on notification type
  const getTypeIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle sx={{ color: G_END }} />;
      case 'warning':
        return <Warning sx={{ color: '#FFB74D' }} />;
      case 'error':
        return <ErrorIcon sx={{ color: '#FF6B6B' }} />;
      default:
        return <Info sx={{ color: G_START }} />;
    }
  };

  // Get background color for notification item
  const getNotificationBg = (read, isSelected) => {
    if (isSelected) return alpha(G_START, 0.15);
    if (!read) return alpha(G_START, 0.05);
    return 'transparent';
  };

  const handleAction = (actionLink) => {
    if (actionLink) {
      navigate(actionLink);
    }
  };

  return (
    <Box sx={{ bgcolor: '#080C14', minHeight: '100vh', pt: 2 }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              mb: 4,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Badge
                badgeContent={unreadCount}
                color="error"
                sx={{ '& .MuiBadge-badge': { bgcolor: G_END } }}
              >
                <NotificationsIcon sx={{ fontSize: 40, color: G_START }} />
              </Badge>
              <Box>
                <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
                  Notifications
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  Stay updated with your website building journey
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Refresh">
                <IconButton
                  onClick={loadNotifications}
                  sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: G_START } }}
                >
                  <Refresh />
                </IconButton>
              </Tooltip>
              <Tooltip title="Settings">
                <IconButton sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: G_START } }}>
                  <Settings />
                </IconButton>
              </Tooltip>
              <Tooltip title="More options">
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: G_START } }}
                >
                  <MoreVert />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </motion.div>

        {/* Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              bgcolor: '#1A1F2E',
              backgroundImage: 'none',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: 'white',
            },
          }}
        >
          <MenuItem onClick={markAllAsRead} sx={{ gap: 1 }}>
            <DoneAll fontSize="small" /> Mark All as Read
          </MenuItem>
          <MenuItem
            onClick={deleteSelected}
            disabled={selectedNotifications.length === 0}
            sx={{ gap: 1 }}
          >
            <DeleteSweep fontSize="small" /> Delete Selected ({selectedNotifications.length})
          </MenuItem>
          <MenuItem onClick={selectAll} sx={{ gap: 1 }}>
            <Markunread fontSize="small" /> Select All
          </MenuItem>
        </Menu>

        {/* Tabs and Actions */}
        <Card
          sx={{
            mb: 3,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
          }}
        >
          <CardContent sx={{ pb: 0 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                mb: 1,
              }}
            >
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => {
                  setActiveTab(newValue);
                  clearSelection();
                }}
                sx={{
                  '& .MuiTabs-indicator': { background: GRAD },
                  '& .MuiTab-root': {
                    color: 'rgba(255,255,255,0.6)',
                    textTransform: 'none',
                    fontWeight: 500,
                  },
                  '& .Mui-selected': { color: 'white' },
                }}
              >
                <Tab label={`All (${notifications.length})`} />
                <Tab label={`Unread (${unreadCount})`} />
              </Tabs>
              {selectedNotifications.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={clearSelection}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      borderRadius: '999px',
                    }}
                  >
                    Clear Selection
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={deleteSelected}
                    sx={{ background: '#FF6B6B', borderRadius: '999px', textTransform: 'none' }}
                  >
                    Delete ({selectedNotifications.length})
                  </Button>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Card
          sx={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          <CardContent>
            {filteredNotifications.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <NotificationsIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.2)', mb: 2 }} />
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  No notifications
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                  You're all caught up! Check back later for updates.
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                <AnimatePresence>
                  {filteredNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ListItem
                        sx={{
                          py: 2,
                          px: { xs: 1, sm: 2 },
                          bgcolor: getNotificationBg(
                            notification.read,
                            selectedNotifications.includes(notification.id)
                          ),
                          borderLeft: !notification.read ? `3px solid ${G_START}` : 'none',
                          transition: 'all 0.2s',
                          '&:hover': { bgcolor: alpha(G_START, 0.1) },
                        }}
                      >
                        {/* Selection Checkbox */}
                        <IconButton
                          onClick={() => toggleSelect(notification.id)}
                          size="small"
                          sx={{
                            mr: 1,
                            color: selectedNotifications.includes(notification.id)
                              ? G_START
                              : 'rgba(255,255,255,0.3)',
                          }}
                        >
                          {selectedNotifications.includes(notification.id) ? (
                            <CheckCircle />
                          ) : (
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                border: '1px solid rgba(255,255,255,0.3)',
                                borderRadius: '4px',
                              }}
                            />
                          )}
                        </IconButton>

                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor: alpha(
                                notification.type === 'error'
                                  ? '#FF6B6B'
                                  : notification.type === 'warning'
                                    ? '#FFB74D'
                                    : G_START,
                                0.1
                              ),
                            }}
                          >
                            {notification.icon || getTypeIcon(notification.type)}
                          </Avatar>
                        </ListItemAvatar>

                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                flexWrap: 'wrap',
                              }}
                            >
                              <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                                sx={{ color: 'white' }}
                              >
                                {notification.title}
                              </Typography>
                              <Chip
                                label={notification.type}
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: '0.65rem',
                                  bgcolor: alpha(
                                    notification.type === 'success'
                                      ? G_END
                                      : notification.type === 'error'
                                        ? '#FF6B6B'
                                        : notification.type === 'warning'
                                          ? '#FFB74D'
                                          : G_START,
                                    0.15
                                  ),
                                  color:
                                    notification.type === 'success'
                                      ? G_END
                                      : notification.type === 'error'
                                        ? '#FF6B6B'
                                        : notification.type === 'warning'
                                          ? '#FFB74D'
                                          : G_START,
                                }}
                              />
                              {!notification.read && (
                                <Chip
                                  label="New"
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: '0.65rem',
                                    bgcolor: alpha(G_START, 0.2),
                                    color: G_START,
                                  }}
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography
                                variant="body2"
                                sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5 }}
                              >
                                {notification.message}
                              </Typography>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 2,
                                  mt: 1,
                                  flexWrap: 'wrap',
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{ color: 'rgba(255,255,255,0.4)' }}
                                >
                                  {notification.time}
                                </Typography>
                                {notification.actionLink && (
                                  <Button
                                    size="small"
                                    onClick={() => handleAction(notification.actionLink)}
                                    sx={{
                                      color: G_START,
                                      textTransform: 'none',
                                      fontSize: '0.75rem',
                                      p: 0,
                                      minWidth: 'auto',
                                      '&:hover': {
                                        bgcolor: 'transparent',
                                        textDecoration: 'underline',
                                      },
                                    }}
                                  >
                                    {notification.actionText || 'View Details'}
                                  </Button>
                                )}
                              </Box>
                            </>
                          }
                        />

                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {!notification.read && (
                            <Tooltip title="Mark as read">
                              <IconButton
                                size="small"
                                onClick={() => markAsRead(notification.id)}
                                sx={{ color: G_START }}
                              >
                                <Markunread fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => deleteNotification(notification.id)}
                              sx={{
                                color: 'rgba(255,255,255,0.4)',
                                '&:hover': { color: '#FF6B6B' },
                              }}
                            >
                              <DeleteSweep fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </ListItem>
                      <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </List>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions Footer */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<DoneAll />}
            onClick={markAllAsRead}
            sx={{
              borderColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              borderRadius: '999px',
              textTransform: 'none',
              '&:hover': { borderColor: G_START, bgcolor: alpha(G_START, 0.1) },
            }}
          >
            Mark All as Read
          </Button>
          <Button
            variant="outlined"
            startIcon={<DeleteSweep />}
            onClick={() => {
              setNotifications([]);
              setSnackbar({ open: true, message: 'All notifications cleared', severity: 'info' });
            }}
            sx={{
              borderColor: 'rgba(255,255,255,0.2)',
              color: '#FF6B6B',
              borderRadius: '999px',
              textTransform: 'none',
              '&:hover': { borderColor: '#FF6B6B', bgcolor: alpha('#FF6B6B', 0.1) },
            }}
          >
            Clear All
          </Button>
        </Box>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%', bgcolor: '#1A1F2E', color: 'white' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Notifications;
