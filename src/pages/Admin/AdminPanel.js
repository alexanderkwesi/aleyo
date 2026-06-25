// src/pages/Admin/AdminPanel.js
import React, { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Avatar,
  Chip,
  LinearProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  useTheme,
  alpha,
  Tooltip,
  Badge,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  Payment as PaymentIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  TrendingUp,
  TrendingDown,
  Download,
  Refresh,
  MoreVert,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Star,
  Storefront,
  Rocket,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import UserManagement from './UserManagement';
import AdminAnalytics from './AdminAnalytics';
import AdminSettings from './Settings';
import SystemMonitor from './SystemMonitor';
import { adminService } from '../../services/admin';

const G_START = '#4F6EF7';
const G_MID = '#2DBCB6';
const G_END = '#3ED67C';
const GRAD = `linear-gradient(135deg, ${G_START} 0%, ${G_MID} 50%, ${G_END} 100%)`;

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index} style={{ paddingTop: 24 }}>
    {value === index && children}
  </div>
);

const AdminPanel = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadDashboardData();
    loadNotifications();
    loadRecentActivity();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    const mockNotifications = [
      {
        id: 1,
        type: 'info',
        message: 'New user registered',
        time: '5 minutes ago',
        read: false,
      },
      {
        id: 2,
        type: 'warning',
        message: 'High server load detected',
        time: '1 hour ago',
        read: false,
      },
      {
        id: 3,
        type: 'success',
        message: 'Payment processed successfully',
        time: '2 hours ago',
        read: true,
      },
    ];
    setNotifications(mockNotifications);
  };

  const loadRecentActivity = async () => {
    const mockActivity = [
      {
        id: 1,
        user: 'John Doe',
        action: 'Created new project',
        time: '10 minutes ago',
        avatar: 'JD',
      },
      {
        id: 2,
        user: 'Jane Smith',
        action: 'Upgraded to Pro plan',
        time: '25 minutes ago',
        avatar: 'JS',
      },
      {
        id: 3,
        user: 'Tech Corp',
        action: 'Added Stripe integration',
        time: '1 hour ago',
        avatar: 'TC',
      },
    ];
    setRecentActivity(mockActivity);
  };

  const handleRefresh = () => {
    loadDashboardData();
    loadNotifications();
    loadRecentActivity();
  };

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const StatCard = ({ title, value, icon, trend, trendValue, color }) => (
    <Card
      sx={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${alpha(color, 0.2)}`,
        borderRadius: '16px',
        transition: 'transform 0.3s',
        '&:hover': { transform: 'translateY(-4px)' },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              {title}
            </Typography>
            <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', mt: 1 }}>
              {value}
            </Typography>
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                {trend === 'up' ? (
                  <TrendingUp sx={{ fontSize: 14, color: G_END }} />
                ) : (
                  <TrendingDown sx={{ fontSize: 14, color: '#EF4444' }} />
                )}
                <Typography variant="caption" sx={{ color: trend === 'up' ? G_END : '#EF4444' }}>
                  {trendValue} from last month
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar sx={{ bgcolor: alpha(color, 0.2), width: 56, height: 56 }}>{icon}</Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}
      >
        <LinearProgress sx={{ width: 200 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#080C14', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}
          >
            <Box>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                Admin Dashboard
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                Welcome back, {user?.name || 'Admin'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Tooltip title="Refresh">
                <IconButton onClick={handleRefresh} sx={{ color: 'white' }}>
                  <Refresh />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download Report">
                <IconButton sx={{ color: 'white' }}>
                  <Download />
                </IconButton>
              </Tooltip>
              <IconButton onClick={handleNotificationClick} sx={{ color: 'white' }}>
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleNotificationClose}
                PaperProps={{
                  sx: {
                    background: '#0D1220',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    width: 320,
                  },
                }}
              >
                <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <Typography sx={{ color: 'white', fontWeight: 600 }}>Notifications</Typography>
                  <Button size="small" onClick={markAllAsRead} sx={{ color: G_START }}>
                    Mark all as read
                  </Button>
                </Box>
                {notifications.map((notification) => (
                  <MenuItem key={notification.id} sx={{ py: 1 }}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        {notification.type === 'success' && <CheckCircle sx={{ color: G_END }} />}
                        {notification.type === 'warning' && <Warning sx={{ color: '#F59E0B' }} />}
                        {notification.type === 'error' && <ErrorIcon sx={{ color: '#EF4444' }} />}
                        {notification.type === 'info' && (
                          <NotificationsIcon sx={{ color: G_START }} />
                        )}
                      </ListItemAvatar>
                      <ListItemText
                        primary={notification.message}
                        secondary={notification.time}
                        primaryTypographyProps={{
                          variant: 'body2',
                          sx: { color: notification.read ? 'rgba(255,255,255,0.5)' : 'white' },
                        }}
                        secondaryTypographyProps={{
                          variant: 'caption',
                          sx: { color: 'rgba(255,255,255,0.3)' },
                        }}
                      />
                    </ListItem>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Box>
        </motion.div>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Users"
              value={stats?.totalUsers || '2,847'}
              icon={<PeopleIcon />}
              trend="up"
              trendValue="12%"
              color={G_START}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Projects"
              value={stats?.activeProjects || '1,234'}
              icon={<Rocket />}
              trend="up"
              trendValue="8%"
              color={G_MID}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Monthly Revenue"
              value={`$${stats?.monthlyRevenue || '12,345'}`}
              icon={<PaymentIcon />}
              trend="up"
              trendValue="23%"
              color={G_END}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Subscriptions"
              value={stats?.activeSubscriptions || '892'}
              icon={<Star />}
              trend="up"
              trendValue="5%"
              color="#F59E0B"
            />
          </Grid>
        </Grid>

        {/* Tabs Navigation */}
        <Paper
          sx={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          <Tabs
            value={tabValue}
            onChange={(e, v) => setTabValue(v)}
            sx={{
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              '& .MuiTab-root': {
                color: 'rgba(255,255,255,0.6)',
                '&.Mui-selected': { color: G_START },
              },
            }}
          >
            <Tab icon={<DashboardIcon />} label="Overview" />
            <Tab icon={<PeopleIcon />} label="User Management" />
            <Tab icon={<AnalyticsIcon />} label="Analytics" />
            <Tab icon={<SettingsIcon />} label="Settings" />
            <Tab icon={<SecurityIcon />} label="System" />
          </Tabs>

          {/* Overview Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Card sx={{ background: 'rgba(255,255,255,0.02)', mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                        Recent Activity
                      </Typography>
                      <List>
                        {recentActivity.map((activity, index) => (
                          <React.Fragment key={activity.id}>
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar sx={{ bgcolor: alpha(G_START, 0.2) }}>
                                  {activity.avatar}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <Typography sx={{ color: 'white' }}>
                                    {activity.user}
                                    <Typography
                                      component="span"
                                      sx={{ color: 'rgba(255,255,255,0.6)', ml: 1 }}
                                    >
                                      {activity.action}
                                    </Typography>
                                  </Typography>
                                }
                                secondary={activity.time}
                                secondaryTypographyProps={{
                                  sx: { color: 'rgba(255,255,255,0.4)' },
                                }}
                              />
                            </ListItem>
                            {index < recentActivity.length - 1 && (
                              <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
                            )}
                          </React.Fragment>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={{ background: 'rgba(255,255,255,0.02)', mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                        Quick Actions
                      </Typography>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<PeopleIcon />}
                        sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                      >
                        Invite Users
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Storefront />}
                        sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                      >
                        Manage Plans
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<SettingsIcon />}
                        sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                      >
                        System Settings
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          {/* User Management Tab */}
          <TabPanel value={tabValue} index={1}>
            <UserManagement />
          </TabPanel>

          {/* Analytics Tab */}
          <TabPanel value={tabValue} index={2}>
            <AdminAnalytics />
          </TabPanel>

          {/* Settings Tab */}
          <TabPanel value={tabValue} index={3}>
            <AdminSettings />
          </TabPanel>

          {/* System Monitor Tab */}
          <TabPanel value={tabValue} index={4}>
            <SystemMonitor />
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminPanel;
