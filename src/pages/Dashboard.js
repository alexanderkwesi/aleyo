import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Avatar,
  LinearProgress,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  useTheme,
  alpha,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Rocket,
  DesignServices,
  IntegrationInstructions,
  Payment,
  TrendingUp,
  Visibility,
  Edit,
  Delete,
  CheckCircle,
  Storefront,
  School,
  Restaurant,
  Business,
  Code,
  Speed,
  CloudQueue,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Chart from 'react-apexcharts';

const G_START = '#4F6EF7';
const G_MID = '#2DBCB6';
const G_END = '#3ED67C';
const GRAD = `linear-gradient(135deg, ${G_START} 0%, ${G_MID} 50%, ${G_END} 100%)`;
const API_BASE = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
//const Dashboard = ({ currentProject, setCurrentProject }) => {
const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalProjects: 0,
    creditsUsed: 0,
    creditsRemaining: 0,
    websitesPublished: 0,
    monthlyGrowth: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [creditUsage, setCreditUsage] = useState([]);
  const [creditTransactions, setCreditTransactions] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);

  useEffect(() => {
    if (token) {
      loadDashboardData();
    } else {
      setLoading(false);
    }
  }, [token]);

  // ── Keep dashboard data live ──
  // Without this, stats/credits/activity are fetched once on mount and then
  // go stale: credits purchased elsewhere, projects published from another
  // tab, or simply leaving the tab open for a while would never be reflected
  // until the user manually triggers an action (delete/publish) or reloads.
  useEffect(() => {
    if (!token) return;

    // Poll periodically in the background.
    const POLL_INTERVAL = 60 * 1000; // 60s
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadDashboardData(true);
      }
    }, POLL_INTERVAL);

    // Also refresh immediately whenever the tab regains focus/visibility,
    // since that's when stale data is most likely to be noticed.
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadDashboardData(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [token]);

  const loadDashboardData = async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);

    try {
      // Fetch user projects
      const projectsRes = await fetch(`${API_BASE}/api/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!projectsRes.ok) {
        if (projectsRes.status === 401) {
          logout();
          navigate('/login');
          return;
        }
        throw new Error('Failed to fetch projects');
      }

      const projectsData = await projectsRes.json();
      setProjects(projectsData);

      // Fetch credit balance
      const balanceRes = await fetch(`${API_BASE}/api/credits/balance`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      let creditsRemaining = 0;
      if (balanceRes.ok) {
        const balanceData = await balanceRes.json();
        creditsRemaining = balanceData.credits || 0;
      }

      // Fetch credit transactions
      const transactionsRes = await fetch(`${API_BASE}/api/credits/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      let transactions = [];
      if (transactionsRes.ok) {
        transactions = await transactionsRes.json();
        setCreditTransactions(transactions);
      }

      // Calculate stats
      const totalProjects = projectsData.length;
      const publishedProjects = projectsData.filter((p) => p.published_url).length;

      // Calculate credits used (sum of negative transactions)
      const creditsUsed = transactions
        .filter((t) => t.type === 'usage')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      // Calculate credits purchased
      const creditsPurchased = transactions
        .filter((t) => t.type === 'purchase')
        .reduce((sum, t) => sum + t.amount, 0);

      // Monthly growth calculation (compare last 30 days vs previous 30 days)
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      const recentProjects = projectsData.filter((p) => new Date(p.created_at) >= thirtyDaysAgo);
      const olderProjects = projectsData.filter(
        (p) => new Date(p.created_at) >= sixtyDaysAgo && new Date(p.created_at) < thirtyDaysAgo
      );

      const monthlyGrowth =
        olderProjects.length > 0
          ? Math.round(
              ((recentProjects.length - olderProjects.length) / olderProjects.length) * 100
            )
          : recentProjects.length > 0
            ? 100
            : 0;

      setStats({
        totalProjects,
        creditsUsed,
        creditsRemaining,
        websitesPublished: publishedProjects,
        monthlyGrowth: Math.max(0, monthlyGrowth),
      });

      // Prepare credit usage data for chart (last 6 months)
      const last6Months = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleString('default', { month: 'short' });
        last6Months.push(monthName);
      }

      const monthlyUsage = last6Months.map((month) => {
        // Filter transactions for this month
        const monthTransactions = transactions.filter((t) => {
          const txDate = new Date(t.created_at);
          return (
            txDate.toLocaleString('default', { month: 'short' }) === month && t.type === 'usage'
          );
        });
        return monthTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      });

      setCreditUsage(
        last6Months.map((month, index) => ({
          month,
          usage: monthlyUsage[index] || 0,
        }))
      );

      // Prepare recent activity
      const activities = [];

      // Add project creation activities
      projectsData.slice(0, 3).forEach((p) => {
        activities.push({
          id: `project-${p.id}`,
          action: 'Created project',
          project: p.name,
          timestamp: new Date(p.created_at).getTime(),
          time: timeAgo(new Date(p.created_at)),
          icon: <DesignServices />,
        });
      });

      // Add publish activities
      projectsData
        .filter((p) => p.published_url)
        .slice(0, 2)
        .forEach((p) => {
          activities.push({
            id: `publish-${p.id}`,
            action: 'Published website',
            project: p.name,
            timestamp: new Date(p.updated_at).getTime(),
            time: timeAgo(new Date(p.updated_at)),
            icon: <Rocket />,
          });
        });

      // Add credit transactions
      transactions.slice(0, 3).forEach((t) => {
        const isUsage = t.type === 'usage';
        activities.push({
          id: `tx-${t.id}`,
          action: isUsage ? `Used ${Math.abs(t.amount)} credits` : `Purchased ${t.amount} credits`,
          project: t.description || 'Credits',
          timestamp: new Date(t.created_at).getTime(),
          time: timeAgo(new Date(t.created_at)),
          icon: isUsage ? <TrendingUp /> : <Payment />,
        });
      });

      // Sort activities by actual timestamp, most recent first.
      // (Previously this parsed the leading number out of strings like
      // "5h ago" / "10m ago" without accounting for the unit, so e.g.
      // "5h ago" sorted as more recent than "10m ago". Using the raw
      // timestamp captured above fixes the ordering.)
      activities.sort((a, b) => b.timestamp - a.timestamp);

      setRecentActivity(activities.slice(0, 10));
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const timeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getProjectIcon = (type) => {
    // Try to detect project type from name or customizations
    const name = (type || '').toLowerCase();
    if (name.includes('business') || name.includes('company') || name.includes('corp')) {
      return <Business />;
    }
    if (name.includes('portfolio') || name.includes('creative')) {
      return <DesignServices />;
    }
    if (name.includes('shop') || name.includes('store') || name.includes('ecom')) {
      return <Storefront />;
    }
    if (name.includes('school') || name.includes('edu') || name.includes('learn')) {
      return <School />;
    }
    if (name.includes('restaurant') || name.includes('food') || name.includes('cafe')) {
      return <Restaurant />;
    }
    return <Code />;
  };

  const getStatusColor = (status) => {
    if (status === 'published' || status === 'live') return 'success';
    if (status === 'draft') return 'warning';
    if (status === 'building') return 'info';
    return 'default';
  };

  const handleCreateProject = () => navigate('/designs');

  const handleEditProject = (project) => {
    // Pass the project ID instead of the name
    navigate(`/studio?project=${encodeURIComponent(project.id)}`);
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await fetch(`${API_BASE}/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== projectId));
        // Refresh stats
        loadDashboardData();
      } else {
        alert('Failed to delete project');
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Error deleting project');
    }
  };

  const handlePublishProject = async (projectId) => {
    try {
      const res = await fetch(`${API_BASE}/api/projects/${projectId}/publish`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        alert(`Website published successfully!\nURL: ${data.published_url}`);
        loadDashboardData();
      } else {
        const error = await res.json();
        alert(error.detail || 'Failed to publish website');
      }
    } catch (err) {
      console.error('Error publishing project:', err);
      alert('Error publishing website');
    }
  };

  const chartOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      background: 'transparent',
      foreColor: '#ffffff',
    },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
      },
    },
    xaxis: {
      categories: creditUsage.map((item) => item.month),
      labels: { style: { colors: 'rgba(255,255,255,0.6)' } },
    },
    yaxis: {
      title: { text: 'Credits Used', style: { color: 'rgba(255,255,255,0.6)' } },
      labels: { style: { colors: 'rgba(255,255,255,0.6)' } },
    },
    colors: [G_START],
    tooltip: { theme: 'dark' },
  };

  const chartSeries = [{ name: 'Credit Usage', data: creditUsage.map((item) => item.usage) }];

  if (loading) {
    return (
      <Box
        sx={{
          bgcolor: '#080C14',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress sx={{ color: G_START }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ bgcolor: '#080C14', minHeight: '100vh', pt: 4 }}>
        <Container maxWidth="xl">
          <Paper sx={{ p: 4, bgcolor: alpha('#FF4444', 0.1), borderRadius: 2 }}>
            <Typography color="#FF4444">{error}</Typography>
            <Button onClick={loadDashboardData} sx={{ mt: 2, color: G_START }}>
              Retry
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#080C14', minHeight: '100vh', pt: 2 }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
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
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
                Welcome back, {user?.name || 'Creator'}! 👋
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                Your AI-powered website building journey continues. You have{' '}
                <strong style={{ color: G_END }}>{stats.creditsRemaining}</strong> credits
                remaining.
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={handleCreateProject}
              sx={{
                background: GRAD,
                borderRadius: '999px',
                py: 1,
                px: 3,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  transform: 'scale(1.02)',
                  transition: 'all 0.2s ease',
                },
              }}
            >
              New Project
            </Button>
          </Box>
        </motion.div>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            {
              label: 'Total Projects',
              value: stats.totalProjects,
              growth: stats.monthlyGrowth,
              icon: <Rocket />,
              color: G_START,
            },
            {
              label: 'Credits Used',
              value: stats.creditsUsed,
              subtitle: 'Total credits consumed',
              icon: <TrendingUp />,
              color: G_MID,
            },
            {
              label: 'Credits',
              value: stats.creditsRemaining,
              subtitle: 'Available to use',
              icon: <CloudQueue />,
              color: G_END,
            },
            {
              label: 'Published Websites',
              value: stats.websitesPublished,
              subtitle: 'Live on the web (10 credits each)',
              icon: <CheckCircle />,
              color: G_START,
            },
          ].map((item, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card
                  sx={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${alpha(item.color, 0.2)}`,
                    borderRadius: '16px',
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                          {item.label}
                        </Typography>
                        <Typography variant="h3" fontWeight="bold" sx={{ color: 'white' }}>
                          {item.value}
                        </Typography>
                        {item.growth !== undefined && item.growth > 0 && (
                          <Typography variant="caption" sx={{ color: G_END }}>
                            +{item.growth}% this month
                          </Typography>
                        )}
                        {item.subtitle && (
                          <Typography
                            variant="caption"
                            sx={{ color: 'rgba(255,255,255,0.4)', display: 'block' }}
                          >
                            {item.subtitle}
                          </Typography>
                        )}
                      </Box>
                      <Avatar sx={{ bgcolor: alpha(item.color, 0.2), width: 56, height: 56 }}>
                        {item.icon}
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Card
              sx={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ color: 'white', mb: 2 }}>
                  Your Projects ({projects.length})
                </Typography>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 2 }} />
                <AnimatePresence>
                  {projects.length > 0 ? (
                    projects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Paper
                          sx={{
                            p: 2,
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '12px',
                            transition: 'all 0.3s',
                            '&:hover': {
                              transform: 'translateX(4px)',
                              bgcolor: alpha(G_START, 0.05),
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: alpha(G_START, 0.1) }}>
                              {getProjectIcon(project.name)}
                            </Avatar>
                            <Box>
                              <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                                sx={{ color: 'white' }}
                              >
                                {project.name}
                              </Typography>
                              <Box
                                sx={{
                                  display: 'flex',
                                  gap: 1,
                                  alignItems: 'center',
                                  mt: 0.5,
                                  flexWrap: 'wrap',
                                }}
                              >
                                <Chip
                                  label={project.published_url ? 'Published' : 'Draft'}
                                  size="small"
                                  color={project.published_url ? 'success' : 'warning'}
                                  sx={{ height: 20, fontSize: '0.7rem' }}
                                />
                                <Typography
                                  variant="caption"
                                  sx={{ color: 'rgba(255,255,255,0.5)' }}
                                >
                                  Updated: {timeAgo(new Date(project.updated_at))}
                                </Typography>
                                {project.published_url && (
                                  <Typography variant="caption" sx={{ color: G_START }}>
                                    Live
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {!project.published_url && (
                              <Tooltip title="Publish (5 credits)">
                                <IconButton
                                  size="small"
                                  onClick={() => handlePublishProject(project.id)}
                                  sx={{ color: G_END }}
                                >
                                  <Rocket />
                                </IconButton>
                              </Tooltip>
                            )}
                            {project.published_url && (
                              <Tooltip title="View">
                                <IconButton
                                  size="small"
                                  onClick={() => window.open(project.published_url, '_blank')}
                                  sx={{ color: G_START }}
                                >
                                  <Visibility />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={() => handleEditProject(project)}
                                sx={{ color: G_MID }}
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteProject(project.id)}
                                sx={{ color: '#ff4444' }}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Paper>
                      </motion.div>
                    ))
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        No projects yet. Click "New Project" to get started!
                      </Typography>
                    </Box>
                  )}
                </AnimatePresence>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={handleCreateProject} sx={{ color: G_START }}>
                  + Create New Project
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={5}>
            <Card
              sx={{
                mb: 3,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ color: 'white', mb: 2 }}>
                  Credit Usage Analytics
                </Typography>
                {creditUsage.some((c) => c.usage > 0) ? (
                  <Chart options={chartOptions} series={chartSeries} type="area" height={250} />
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>
                      No credit usage data yet. Start building!
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            <Card
              sx={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ color: 'white', mb: 2 }}>
                  Recent Activity
                </Typography>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 2 }} />
                {recentActivity.length > 0 ? (
                  <List>
                    {recentActivity.slice(0, 5).map((activity, index) => (
                      <React.Fragment key={activity.id}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: alpha(G_START, 0.1) }}>{activity.icon}</Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={activity.action}
                            secondary={
                              <>
                                <Typography
                                  variant="caption"
                                  component="span"
                                  sx={{ color: 'rgba(255,255,255,0.6)' }}
                                >
                                  {activity.project}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ ml: 1, color: 'rgba(255,255,255,0.4)' }}
                                >
                                  • {activity.time}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                        {index < recentActivity.length - 1 && index < 4 && (
                          <Divider
                            variant="inset"
                            component="li"
                            sx={{ borderColor: 'rgba(255,255,255,0.08)' }}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>
                      No recent activity
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: 'white', mb: 2 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            {[
              { icon: <DesignServices />, label: 'Browse Designs', action: '/designs' },
              {
                icon: <IntegrationInstructions />,
                label: 'Add Integrations',
                action: '/api-integration',
              },
              { icon: <Payment />, label: 'Buy Credits', action: '/pricing' },
              { icon: <Speed />, label: 'Quick Tutorial', action: '/tutorials' },
            ].map((item, idx) => (
              <Grid item xs={6} sm={4} md={2} key={idx}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={item.icon}
                  onClick={() => navigate(item.action)}
                  sx={{
                    py: 2,
                    borderColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    borderRadius: '999px',
                    textTransform: 'none',
                    '&:hover': { borderColor: G_MID, background: alpha(G_START, 0.1) },
                  }}
                >
                  {item.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
