// src/pages/Admin/Analytics.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Tabs,
  Tab,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import { adminService } from '../../services/admin';

const G_START = '#4F6EF7';
const G_MID = '#2DBCB6';
const G_END = '#3ED67C';

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAnalytics(timeRange);
      setAnalyticsData(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const userGrowthOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      background: 'transparent',
      animations: { enabled: true },
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
      categories: analyticsData?.userGrowth?.labels || [],
      labels: { style: { colors: 'rgba(255,255,255,0.6)' } },
    },
    yaxis: {
      title: { text: 'Users', style: { color: 'rgba(255,255,255,0.6)' } },
      labels: { style: { colors: 'rgba(255,255,255,0.6)' } },
    },
    colors: [G_START],
    tooltip: { theme: 'dark' },
  };

  const revenueOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      background: 'transparent',
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        horizontal: false,
      },
    },
    xaxis: {
      categories: analyticsData?.revenue?.labels || [],
      labels: { style: { colors: 'rgba(255,255,255,0.6)' } },
    },
    yaxis: {
      title: { text: 'Revenue ($)', style: { color: 'rgba(255,255,255,0.6)' } },
      labels: { style: { colors: 'rgba(255,255,255,0.6)' } },
    },
    colors: [G_MID],
    tooltip: { theme: 'dark' },
  };

  const planDistributionOptions = {
    chart: {
      type: 'donut',
      toolbar: { show: false },
      background: 'transparent',
    },
    labels: analyticsData?.planDistribution?.labels || [],
    colors: [G_START, G_MID, G_END, '#F59E0B', '#EF4444'],
    legend: {
      labels: { colors: 'rgba(255,255,255,0.6)' },
      position: 'bottom',
    },
    tooltip: { theme: 'dark' },
  };

  const MetricCard = ({ title, value, change, icon }) => (
    <Card
      sx={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mt: 1 }}>
              {value}
            </Typography>
            {change && (
              <Typography
                variant="caption"
                sx={{ color: change > 0 ? G_END : '#EF4444', mt: 0.5, display: 'block' }}
              >
                {change > 0 ? '+' : ''}
                {change}% from last period
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              background: `rgba(79,110,247,0.1)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>Loading analytics...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
          Analytics Dashboard
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel sx={{ color: 'rgba(255,255,255,0.6)' }}>Time Range</InputLabel>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            label="Time Range"
            sx={{ color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }}
          >
            <MenuItem value="week">Last 7 Days</MenuItem>
            <MenuItem value="month">Last 30 Days</MenuItem>
            <MenuItem value="quarter">Last 3 Months</MenuItem>
            <MenuItem value="year">Last Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Users"
            value={analyticsData?.totalUsers || 0}
            change={analyticsData?.userGrowth?.change}
            icon="👥"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Revenue"
            value={`$${analyticsData?.totalRevenue || 0}`}
            change={analyticsData?.revenue?.change}
            icon="💰"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Active Projects"
            value={analyticsData?.activeProjects || 0}
            change={analyticsData?.projectsGrowth}
            icon="📁"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Conversion Rate"
            value={`${analyticsData?.conversionRate || 0}%`}
            change={analyticsData?.conversionChange}
            icon="🎯"
          />
        </Grid>
      </Grid>

      {/* Charts Tabs */}
      <Paper
        sx={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          sx={{
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            '& .MuiTab-root': {
              color: 'rgba(255,255,255,0.6)',
              '&.Mui-selected': { color: G_START },
            },
          }}
        >
          <Tab label="User Growth" />
          <Tab label="Revenue" />
          <Tab label="Plan Distribution" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <Chart
              options={userGrowthOptions}
              series={[{ name: 'New Users', data: analyticsData?.userGrowth?.data || [] }]}
              type="area"
              height={350}
            />
          )}
          {activeTab === 1 && (
            <Chart
              options={revenueOptions}
              series={[{ name: 'Revenue', data: analyticsData?.revenue?.data || [] }]}
              type="bar"
              height={350}
            />
          )}
          {activeTab === 2 && (
            <Chart
              options={planDistributionOptions}
              series={analyticsData?.planDistribution?.data || []}
              type="donut"
              height={350}
            />
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminAnalytics;
