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
import Chart from 'react-apexcharts';


// Gradient colors from HomePage
const G_START = '#4F6EF7';
const G_MID = '#2DBCB6';
const G_END = '#3ED67C';
const GRAD = `linear-gradient(135deg, ${G_START} 0%, ${G_MID} 50%, ${G_END} 100%)`;

const Dashboard = ({ currentProject, setCurrentProject }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    creditsUsed: 0,
    creditsRemaining: 0,
    websitesPublished: 0,
    monthlyGrowth: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [creditUsage, setCreditUsage] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    setProjects([
      {
        id: 1,
        name: 'My Business Website',
        type: 'business',
        lastEdited: '2024-01-15',
        status: 'published',
        credits: 150,
        design: 'Modern Minimalist',
      },
      {
        id: 2,
        name: 'Portfolio Site',
        type: 'portfolio',
        lastEdited: '2024-01-14',
        status: 'draft',
        credits: 75,
        design: 'Creative Agency',
      },
      {
        id: 3,
        name: 'E-commerce Store',
        type: 'ecommerce',
        lastEdited: '2024-01-13',
        status: 'building',
        credits: 200,
        design: 'Shop Modern',
      },
    ]);

    setStats({
      totalProjects: 3,
      creditsUsed: 425,
      creditsRemaining: 75,
      websitesPublished: 1,
      monthlyGrowth: 23,
    });

    setRecentActivity([
      {
        id: 1,
        action: 'Published website',
        project: 'My Business Website',
        time: '2 hours ago',
        icon: <Rocket />,
      },
      {
        id: 2,
        action: 'Added Stripe integration',
        project: 'E-commerce Store',
        time: '5 hours ago',
        icon: <Payment />,
      },
      {
        id: 3,
        action: 'Merged designs',
        project: 'Portfolio Site',
        time: '1 day ago',
        icon: <DesignServices />,
      },
      {
        id: 4,
        action: 'Used 50 credits',
        project: 'Website Builder',
        time: '2 days ago',
        icon: <TrendingUp />,
      },
    ]);

    setCreditUsage([
      { month: 'Jan', usage: 150 },
      { month: 'Feb', usage: 220 },
      { month: 'Mar', usage: 180 },
      { month: 'Apr', usage: 250 },
      { month: 'May', usage: 300 },
      { month: 'Jun', usage: 425 },
    ]);
  };

  const getProjectIcon = (type) => {
    switch (type) {
      case 'business':
        return <Business />;
      case 'portfolio':
        return <DesignServices />;
      case 'ecommerce':
        return <Storefront />;
      case 'education':
        return <School />;
      case 'restaurant':
        return <Restaurant />;
      default:
        return <Code />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      case 'building':
        return 'info';
      default:
        return 'default';
    }
  };

  const handleCreateProject = () => navigate('/designs');
  const handleEditProject = (project) => {
    setCurrentProject(project);
    navigate('/studio');
  };
  const handleDeleteProject = (projectId) =>
    setProjects(projects.filter((p) => p.id !== projectId));

  const chartOptions = {
    chart: { type: 'area', toolbar: { show: false }, background: 'transparent' },
    stroke: { curve: 'smooth', width: 2 },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3 } },
    xaxis: {
      categories: creditUsage.map((item) => item.month),
      labels: { style: { colors: theme.palette.text.secondary } },
    },
    yaxis: {
      title: { text: 'Credits Used', style: { color: theme.palette.text.secondary } },
      labels: { style: { colors: theme.palette.text.secondary } },
    },
    colors: [G_START],
    tooltip: { theme: 'dark' },
  };

  const chartSeries = [{ name: 'Credit Usage', data: creditUsage.map((item) => item.usage) }];

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
                Welcome back, Creator! 👋
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                Your AI-powered website building journey continues. You have{' '}
                {stats.creditsRemaining} credits remaining.
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
              progress: (stats.creditsUsed / 500) * 100,
              icon: <TrendingUp />,
              color: G_MID,
            },
            {
              label: 'Credits Remaining',
              value: stats.creditsRemaining,
              subtitle: '50 free credits included',
              icon: <CloudQueue />,
              color: G_END,
            },
            {
              label: 'Published Websites',
              value: stats.websitesPublished,
              subtitle: 'Live on the web',
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
                        {item.growth && (
                          <Typography variant="caption" sx={{ color: G_END }}>
                            +{item.growth}% this month
                          </Typography>
                        )}
                        {item.subtitle && (
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                            {item.subtitle}
                          </Typography>
                        )}
                        {item.progress && (
                          <LinearProgress
                            variant="determinate"
                            value={item.progress}
                            sx={{
                              mt: 1,
                              height: 6,
                              borderRadius: 3,
                              bgcolor: 'rgba(255,255,255,0.1)',
                              '& .MuiLinearProgress-bar': { background: GRAD },
                            }}
                          />
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
                  Your Projects
                </Typography>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 2 }} />
                <AnimatePresence>
                  {projects.map((project, index) => (
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
                            {getProjectIcon(project.type)}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="subtitle1"
                              fontWeight="bold"
                              sx={{ color: 'white' }}
                            >
                              {project.name}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                              <Chip
                                label={project.status}
                                size="small"
                                color={getStatusColor(project.status)}
                                sx={{ height: 20, fontSize: '0.7rem' }}
                              />
                              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                Last edited: {project.lastEdited}
                              </Typography>
                              <Typography variant="caption" sx={{ color: G_START }}>
                                {project.credits} credits used
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Box>
                          <Tooltip title="Preview">
                            <IconButton size="small" sx={{ color: G_START }}>
                              <Visibility />
                            </IconButton>
                          </Tooltip>
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
                              color="error"
                              onClick={() => handleDeleteProject(project.id)}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Paper>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {projects.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>
                      No projects yet. Click "New Project" to get started!
                    </Typography>
                  </Box>
                )}
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
                <Chart options={chartOptions} series={chartSeries} type="area" height={250} />
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
                <List>
                  {recentActivity.map((activity, index) => (
                    <React.Fragment key={activity.id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: alpha(G_START, 0.1) }}>{activity.icon}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={activity.action}
                          secondary={
                            <>
                              <Typography variant="caption" component="span">
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
                      {index < recentActivity.length - 1 && (
                        <Divider
                          variant="inset"
                          component="li"
                          sx={{ borderColor: 'rgba(255,255,255,0.08)' }}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </List>
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
              { icon: <DesignServices />, label: 'Browse Designs', action: '/template' },
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
                  onClick={() => window.open(item.action, '_blank')}
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
