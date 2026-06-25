import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  IconButton,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  alpha,
} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import {
  Memory,
  Storage,
  Cloud,
  Security,
  Warning,
  CheckCircle,
  Refresh,
  Speed,
  DataArray,
} from '@mui/icons-material';
import { adminService } from '../../services/admin';

const G_START = '#4F6EF7';
const G_MID = '#2DBCB6';
const G_END = '#3ED67C';

const SystemMonitor = () => {
  const [systemStatus, setSystemStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    loadSystemStatus();
    loadLogs();
    const interval = setInterval(loadSystemStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadSystemStatus = async () => {
    try {
      const data = await adminService.getSystemStatus();
      setSystemStatus(data);
    } catch (error) {
      console.error('Failed to load system status:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLogs = async () => {
    try {
      const data = await adminService.getSystemLogs();
      setLogs(data);
    } catch (error) {
      console.error('Failed to load logs:', error);
    }
  };

  const StatusCard = ({ title, value, status, icon, color }) => (
    <Card
      sx={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${alpha(color || G_START, 0.2)}`,
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
            {status && (
              <Chip
                label={status}
                size="small"
                sx={{
                  mt: 1,
                  bgcolor: alpha(status === 'Healthy' ? G_END : '#EF4444', 0.2),
                  color: status === 'Healthy' ? G_END : '#EF4444',
                }}
              />
            )}
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              background: alpha(color || G_START, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
        {title === 'DoneIcon Usage' && (
          <LinearProgress
            variant="determinate"
            value={value}
            sx={{
              mt: 2,
              height: 6,
              borderRadius: 3,
              bgcolor: 'rgba(255,255,255,0.1)',
              '& .MuiLinearProgress-bar': {
                background: value > 80 ? '#EF4444' : G_START,
              },
            }}
          />
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
          System Monitor
        </Typography>
        <IconButton onClick={loadSystemStatus} sx={{ color: 'white' }}>
          <Refresh />
        </IconButton>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatusCard
            title="DoneIcon Usage"
            value={`${systemStatus?.DoneIcon || 0}%`}
            icon={<DoneIcon />}
            color={systemStatus?.DoneIcon > 80 ? '#EF4444' : G_START}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatusCard
            title="Memory Usage"
            value={`${systemStatus?.memory || 0}%`}
            icon={<Memory />}
            color={systemStatus?.memory > 80 ? '#EF4444' : G_START}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatusCard
            title="Storage"
            value={`${systemStatus?.storage || 0}%`}
            icon={<Storage />}
            color={systemStatus?.storage > 80 ? '#EF4444' : G_START}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatusCard
            title="API Status"
            value={systemStatus?.apiStatus || 'Online'}
            status={systemStatus?.apiStatus === 'Online' ? 'Healthy' : 'Issues'}
            icon={<Cloud />}
            color={systemStatus?.apiStatus === 'Online' ? G_END : '#EF4444'}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              mb: 3,
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                Recent System Logs
              </Typography>
              <List>
                {logs.slice(0, 5).map((log, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>
                        {log.type === 'error' ? (
                          <Warning sx={{ color: '#EF4444' }} />
                        ) : (
                          <CheckCircle sx={{ color: G_END }} />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={log.message}
                        secondary={log.timestamp}
                        primaryTypographyProps={{ variant: 'body2', sx: { color: 'white' } }}
                        secondaryTypographyProps={{ sx: { color: 'rgba(255,255,255,0.4)' } }}
                      />
                    </ListItem>
                    {index < logs.length - 1 && (
                      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              mb: 3,
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                Security Alerts
              </Typography>
              {systemStatus?.securityAlerts?.length > 0 ? (
                systemStatus.securityAlerts.map((alert, index) => (
                  <Alert
                    key={index}
                    severity={alert.severity}
                    sx={{
                      mb: 2,
                      bgcolor: alpha(alert.severity === 'high' ? '#EF4444' : '#F59E0B', 0.1),
                      border: `1px solid ${alpha(alert.severity === 'high' ? '#EF4444' : '#F59E0B', 0.3)}`,
                    }}
                  >
                    {alert.message}
                  </Alert>
                ))
              ) : (
                <Alert
                  severity="success"
                  sx={{ bgcolor: alpha(G_END, 0.1), border: `1px solid ${alpha(G_END, 0.3)}` }}
                >
                  No security alerts at this time
                </Alert>
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
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Refresh />}
                    sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  >
                    Clear Cache
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<DataArray />}
                    sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  >
                    Backup DataArray
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Speed />}
                    sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  >
                    Run Diagnostics
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Security />}
                    sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  >
                    Security Scan
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SystemMonitor;
