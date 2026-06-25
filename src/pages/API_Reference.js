// ApiReferencePage.js
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  alpha,
  useTheme,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
  Alert,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Snackbar,
} from '@mui/material';
import {
  ExpandMore,
  Api,
  Security,
  Payment,
  Mic,
  Storage,
  CloudUpload,
  CheckCircle,
  ErrorOutline,
  Code,
  Lock,
  VpnKey,
  CreditCard,
  AccountBalance,
  Psychology,
  Database,
  Language,
  GitHub,
  Description,
  Build,
  Settings,
  People,
  Email,
  Phone,
  Business,
  Home,
  Dashboard,
  DesignServices,
  IntegrationInstructions,
  Save,
  Publish,
  Visibility,
  Edit,
  Delete,
  ContentCopy,
  Refresh,
  Search,
  FilterList,
  Sort,
  Add,
  Close,
  HelpOutline,
  Info,
  Warning,
  TrendingUp,
  CalendarToday,
  AccessTime,
  CheckCircleOutline,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const G_START = '#4F6EF7';
const G_MID = '#2DBCB6';
const G_END = '#3ED67C';
const GRAD = `linear-gradient(135deg, ${G_START} 0%, ${G_MID} 50%, ${G_END} 100%)`;

const ApiReferencePage = () => {
  const theme = useTheme();
  const [expandedSection, setExpandedSection] = useState('overview');
  const [activeTab, setActiveTab] = useState(0);
  const [testResult, setTestResult] = useState(null);
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [testEndpoint, setTestEndpoint] = useState('');
  const [testResponse, setTestResponse] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSectionChange = (section) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? section : false);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleTestEndpoint = async (endpoint, method, body = null) => {
    setTestEndpoint(endpoint);
    setTestDialogOpen(true);
    setTestResponse('Loading...');

    // Simulate API call
    setTimeout(() => {
      setTestResponse(
        JSON.stringify(
          {
            success: true,
            data: {
              endpoint: endpoint,
              method: method,
              timestamp: new Date().toISOString(),
              mockResponse: `This is a mock response from ${endpoint}`,
              status: 200,
            },
          },
          null,
          2
        )
      );
      showSnackbar(`Test completed for ${endpoint}`, 'success');
    }, 1000);
  };

  const sections = [
    {
      id: 'overview',
      title: '📡 API Overview',
      icon: <Api />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            The Aleyo API provides programmatic access to the Design Studio's core functionality.
            All API endpoints are RESTful and return JSON responses.
          </Typography>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: alpha(G_START, 0.05), borderRadius: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  🌐 Base URL
                </Typography>
                <Chip
                  label="https://api.aleyo.app/v1"
                  sx={{
                    bgcolor: alpha('#FFFFFF', 0.1),
                    color: G_START,
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                  }}
                />
                <Typography variant="body2" sx={{ mt: 2, color: alpha('#FFFFFF', 0.6) }}>
                  Environment variable: <code>REACT_APP_API_URL</code>
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: alpha(G_START, 0.05), borderRadius: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  🔑 Authentication
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.6) }}>
                  Bearer token authentication required for all endpoints except auth routes.
                </Typography>
                <Chip
                  label="Authorization: Bearer {token}"
                  sx={{
                    mt: 1,
                    bgcolor: alpha('#FFFFFF', 0.1),
                    color: G_MID,
                    fontFamily: 'monospace',
                    fontSize: '0.7rem',
                  }}
                />
              </Paper>
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mt: 3, bgcolor: alpha(G_START, 0.1) }}>
            <Typography variant="body2">
              💡 <strong>Mock Mode:</strong> Set <code>REACT_APP_USE_MOCK=true</code> to use mock
              data during development. All endpoints will return simulated responses.
            </Typography>
          </Alert>
        </Box>
      ),
    },
    {
      id: 'authentication',
      title: '🔐 Authentication API',
      icon: <Security />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Authentication endpoints handle user registration, login, and session management.
          </Typography>

          <TableContainer component={Paper} sx={{ bgcolor: alpha('#FFFFFF', 0.03), mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Endpoint</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Method</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  {
                    endpoint: '/auth/login',
                    method: 'POST',
                    desc: 'User login with email and password',
                  },
                  { endpoint: '/auth/signup', method: 'POST', desc: 'Create new user account' },
                  { endpoint: '/auth/me', method: 'GET', desc: 'Get current authenticated user' },
                  {
                    endpoint: '/auth/forgot-password',
                    method: 'POST',
                    desc: 'Request password reset email',
                  },
                  {
                    endpoint: '/auth/reset-password',
                    method: 'POST',
                    desc: 'Reset password with token',
                  },
                ].map((item) => (
                  <TableRow key={item.endpoint}>
                    <TableCell sx={{ color: alpha('#FFFFFF', 0.8), fontFamily: 'monospace' }}>
                      {item.endpoint}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.method}
                        size="small"
                        sx={{ bgcolor: alpha(G_START, 0.2), color: G_START }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>{item.desc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="subtitle1" gutterBottom>
            📝 Example: Login Request
          </Typography>
          <Paper sx={{ p: 2, bgcolor: alpha('#000000', 0.5), borderRadius: 2, mb: 2 }}>
            <pre style={{ color: '#E0E0E0', margin: 0, fontSize: '0.8rem' }}>
              {`POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your_password"
}`}
            </pre>
          </Paper>

          <Typography variant="subtitle1" gutterBottom>
            ✅ Example: Login Response
          </Typography>
          <Paper sx={{ p: 2, bgcolor: alpha('#000000', 0.5), borderRadius: 2 }}>
            <pre style={{ color: '#E0E0E0', margin: 0, fontSize: '0.8rem' }}>
              {`{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_1",
    "email": "user@example.com",
    "name": "John Doe",
    "credits": 100,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}`}
            </pre>
          </Paper>
        </Box>
      ),
    },
    {
      id: 'projects',
      title: '📁 Projects API',
      icon: <Storage />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Manage user projects including creation, retrieval, updates, and deletion.
          </Typography>

          <TableContainer component={Paper} sx={{ bgcolor: alpha('#FFFFFF', 0.03), mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Endpoint</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Method</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  {
                    endpoint: '/projects',
                    method: 'GET',
                    desc: 'Get all projects for current user',
                  },
                  { endpoint: '/projects/{id}', method: 'GET', desc: 'Get specific project by ID' },
                  { endpoint: '/projects', method: 'POST', desc: 'Create a new project' },
                  { endpoint: '/projects/{id}', method: 'PATCH', desc: 'Update existing project' },
                  { endpoint: '/projects/{id}', method: 'DELETE', desc: 'Delete a project' },
                  {
                    endpoint: '/projects/{id}/design',
                    method: 'POST',
                    desc: 'Save design data for project',
                  },
                ].map((item) => (
                  <TableRow key={item.endpoint}>
                    <TableCell sx={{ color: alpha('#FFFFFF', 0.8), fontFamily: 'monospace' }}>
                      {item.endpoint}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.method}
                        size="small"
                        sx={{ bgcolor: alpha(G_START, 0.2), color: G_START }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>{item.desc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="subtitle1" gutterBottom>
            📝 Example: Create Project
          </Typography>
          <Paper sx={{ p: 2, bgcolor: alpha('#000000', 0.5), borderRadius: 2, mb: 2 }}>
            <pre style={{ color: '#E0E0E0', margin: 0, fontSize: '0.8rem' }}>
              {`POST /projects
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "My New Website",
  "type": "business",
  "templateId": 1,
  "design": "Modern Minimalist"
}`}
            </pre>
          </Paper>

          <Typography variant="subtitle1" gutterBottom>
            📝 Example: Save Design
          </Typography>
          <Paper sx={{ p: 2, bgcolor: alpha('#000000', 0.5), borderRadius: 2 }}>
            <pre style={{ color: '#E0E0E0', margin: 0, fontSize: '0.8rem' }}>
              {`POST /projects/{id}/design
Authorization: Bearer {token}
Content-Type: application/json

{
  "components": [
    {
      "id": "hero-1",
      "type": "hero",
      "content": {
        "title": "Welcome",
        "subtitle": "Your journey begins here",
        "buttonText": "Get Started"
      }
    }
  ],
  "styles": {
    "primaryColor": "#4F6EF7",
    "fontFamily": "Inter, sans-serif"
  }
}`}
            </pre>
          </Paper>
        </Box>
      ),
    },
    {
      id: 'templates',
      title: '🎨 Templates API',
      icon: <DesignServices />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Browse and retrieve website templates for different categories and use cases.
          </Typography>

          <TableContainer component={Paper} sx={{ bgcolor: alpha('#FFFFFF', 0.03), mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Endpoint</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Method</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { endpoint: '/templates', method: 'GET', desc: 'Get all templates' },
                  {
                    endpoint: '/templates?category={category}',
                    method: 'GET',
                    desc: 'Filter templates by category',
                  },
                  {
                    endpoint: '/templates/{id}',
                    method: 'GET',
                    desc: 'Get specific template details',
                  },
                ].map((item) => (
                  <TableRow key={item.endpoint}>
                    <TableCell sx={{ color: alpha('#FFFFFF', 0.8), fontFamily: 'monospace' }}>
                      {item.endpoint}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.method}
                        size="small"
                        sx={{ bgcolor: alpha(G_START, 0.2), color: G_START }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>{item.desc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="subtitle1" gutterBottom>
            📝 Example: Get Templates by Category
          </Typography>
          <Paper sx={{ p: 2, bgcolor: alpha('#000000', 0.5), borderRadius: 2 }}>
            <pre style={{ color: '#E0E0E0', margin: 0, fontSize: '0.8rem' }}>
              {`GET /templates?category=business
Authorization: Bearer {token}

Response:
{
  "templates": [
    {
      "id": 1,
      "name": "Modern Minimalist",
      "category": "business",
      "description": "Clean and professional design",
      "rating": 4.8,
      "reviews": 234,
      "features": ["Responsive", "SEO Optimized", "Fast Loading"],
      "popular": true,
      "previewUrl": "/previews/modern-minimalist"
    }
  ]
}`}
            </pre>
          </Paper>
        </Box>
      ),
    },
    {
      id: 'integrations',
      title: '🔌 Integrations API',
      icon: <IntegrationInstructions />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Manage third-party service integrations for your websites.
          </Typography>

          <TableContainer component={Paper} sx={{ bgcolor: alpha('#FFFFFF', 0.03), mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Endpoint</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Method</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { endpoint: '/integrations', method: 'GET', desc: 'Get available integrations' },
                  {
                    endpoint: '/integrations/{id}/connect',
                    method: 'POST',
                    desc: 'Connect an integration',
                  },
                  {
                    endpoint: '/integrations/{id}',
                    method: 'DELETE',
                    desc: 'Disconnect an integration',
                  },
                ].map((item) => (
                  <TableRow key={item.endpoint}>
                    <TableCell sx={{ color: alpha('#FFFFFF', 0.8), fontFamily: 'monospace' }}>
                      {item.endpoint}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.method}
                        size="small"
                        sx={{ bgcolor: alpha(G_START, 0.2), color: G_START }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>{item.desc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="subtitle1" gutterBottom>
            📝 Example: Connect Integration
          </Typography>
          <Paper sx={{ p: 2, bgcolor: alpha('#000000', 0.5), borderRadius: 2 }}>
            <pre style={{ color: '#E0E0E0', margin: 0, fontSize: '0.8rem' }}>
              {`POST /integrations/1/connect
Authorization: Bearer {token}
Content-Type: application/json

{
  "apiKey": "sk_test_123456789",
  "settings": {
    "webhookUrl": "https://mywebsite.com/webhook",
    "mode": "test"
  }
}

Response:
{
  "success": true,
  "integration": {
    "id": 1,
    "name": "Stripe",
    "connected": true,
    "settings": { ... }
  }
}`}
            </pre>
          </Paper>
        </Box>
      ),
    },
    {
      id: 'payment',
      title: '💳 Payment API (GoCardless)',
      icon: <Payment />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Payment processing using GoCardless integration for direct debit and card payments.
          </Typography>

          <TableContainer component={Paper} sx={{ bgcolor: alpha('#FFFFFF', 0.03), mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Method</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  {
                    method: 'createPaymentSession(plan, user, addons)',
                    desc: 'Create a payment session and redirect URL',
                  },
                  {
                    method: 'getPaymentStatus(sessionId)',
                    desc: 'Check payment status by session ID',
                  },
                  {
                    method: 'createMandate(customerDetails)',
                    desc: 'Create a direct debit mandate',
                  },
                  {
                    method: 'calculateAmount(plan, addons)',
                    desc: 'Calculate total amount in pence',
                  },
                ].map((item) => (
                  <TableRow key={item.method}>
                    <TableCell sx={{ color: alpha('#FFFFFF', 0.8), fontFamily: 'monospace' }}>
                      {item.method}
                    </TableCell>
                    <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>{item.desc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="subtitle1" gutterBottom>
            📝 Example: Create Payment Session
          </Typography>
          <Paper sx={{ p: 2, bgcolor: alpha('#000000', 0.5), borderRadius: 2 }}>
            <pre style={{ color: '#E0E0E0', margin: 0, fontSize: '0.8rem' }}>
              {`import { gocardlessService } from './services/gocardless';

const session = await gocardlessService.createPaymentSession(
  { id: 'pro', name: 'Pro', priceMonthly: 79 },
  { id: 'user_1', email: 'user@example.com', name: 'John Doe' },
  [{ name: 'Additional Credits', price: 25 }]
);

// Redirect user to checkout URL
window.location.href = session.checkoutUrl;

// Response:
{
  sessionId: "session_123456789",
  redirectUrl: "https://pay.gocardless.com/flow/session_123456789",
  checkoutUrl: "https://pay.gocardless.com/flow/session_123456789"
}`}
            </pre>
          </Paper>

          <Alert severity="info" sx={{ mt: 3, bgcolor: alpha(G_START, 0.1) }}>
            <Typography variant="body2">
              💳 <strong>GoCardless Configuration:</strong> Set{' '}
              <code>REACT_APP_GOCARDLESS_ACCESS_TOKEN</code>
              in your environment variables. The API URL defaults to{' '}
              <code>https://api.gocardless.com</code>.
            </Typography>
          </Alert>
        </Box>
      ),
    },
    {
      id: 'voice',
      title: '🎤 Voice Assistant API',
      icon: <Mic />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Voice recognition service for hands-free command input using Web Speech API.
          </Typography>

          <TableContainer component={Paper} sx={{ bgcolor: alpha('#FFFFFF', 0.03), mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Method</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  {
                    method: 'startListening(useAzure)',
                    desc: 'Start voice recognition (Web Speech or Azure)',
                  },
                  { method: 'stopListening()', desc: 'Stop active voice recognition' },
                  {
                    method: 'setCallbacks(callbacks)',
                    desc: 'Set event handlers for results, errors, and end',
                  },
                ].map((item) => (
                  <TableRow key={item.method}>
                    <TableCell sx={{ color: alpha('#FFFFFF', 0.8), fontFamily: 'monospace' }}>
                      {item.method}
                    </TableCell>
                    <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>{item.desc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="subtitle1" gutterBottom>
            📝 Example: Voice Service Setup
          </Typography>
          <Paper sx={{ p: 2, bgcolor: alpha('#000000', 0.5), borderRadius: 2 }}>
            <pre style={{ color: '#E0E0E0', margin: 0, fontSize: '0.8rem' }}>
              {`import { voiceService } from './services/voiceAssistant';

// Set up callbacks
voiceService.setCallbacks({
  onResult: (transcript, isFinal) => {
    if (isFinal) {
      console.log('Final command:', transcript);
      processCommand(transcript);
    } else {
      console.log('Interim:', transcript);
    }
  },
  onError: (error) => {
    console.error('Voice error:', error);
  },
  onEnd: () => {
    console.log('Listening ended');
  }
});

// Start listening
voiceService.startListening(false); // false = Web Speech, true = Azure

// Stop listening
voiceService.stopListening();`}
            </pre>
          </Paper>

          <Alert severity="warning" sx={{ mt: 3, bgcolor: alpha('#FFA726', 0.1) }}>
            <Typography variant="body2">
              ⚠️ <strong>Browser Support:</strong> Web Speech API requires HTTPS or localhost.
              Chrome, Edge, and Safari are supported. Firefox support is limited.
            </Typography>
          </Alert>
        </Box>
      ),
    },
    {
      id: 'admin',
      title: '👑 Admin API',
      icon: <People />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Administrative endpoints for user management, credit adjustments, and system oversight.
          </Typography>

          <TableContainer component={Paper} sx={{ bgcolor: alpha('#FFFFFF', 0.03), mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Method</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { method: 'getUsers()', desc: 'Retrieve all registered users' },
                  { method: 'updateUser(id, data)', desc: 'Update user information' },
                  { method: 'deleteUser(id)', desc: 'Delete a user account' },
                  { method: 'inviteUser(data)', desc: 'Send invitation to new user' },
                  {
                    method: 'adjustCredits(userId, amount)',
                    desc: 'Add or remove credits from user',
                  },
                ].map((item) => (
                  <TableRow key={item.method}>
                    <TableCell sx={{ color: alpha('#FFFFFF', 0.8), fontFamily: 'monospace' }}>
                      {item.method}
                    </TableCell>
                    <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>{item.desc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="subtitle1" gutterBottom>
            📝 Example: Admin Methods
          </Typography>
          <Paper sx={{ p: 2, bgcolor: alpha('#000000', 0.5), borderRadius: 2 }}>
            <pre style={{ color: '#E0E0E0', margin: 0, fontSize: '0.8rem' }}>
              {`import { adminService } from './services/admin';

// Get all users
const users = await adminService.getUsers();

// Update user role
await adminService.updateUser('user_123', { role: 'admin', status: 'active' });

// Adjust user credits
await adminService.adjustCredits('user_123', 100); // Add 100 credits

// Invite new user
await adminService.inviteUser({
  email: 'newuser@example.com',
  role: 'user',
  credits: 50
});

// Delete user
await adminService.deleteUser('user_456');`}
            </pre>
          </Paper>
        </Box>
      ),
    },
    {
      id: 'error-codes',
      title: '⚠️ Error Codes',
      icon: <ErrorOutline />,
      content: (
        <Box>
          <TableContainer component={Paper} sx={{ bgcolor: alpha('#FFFFFF', 0.03) }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>HTTP Status</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Code</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { status: 400, code: 'BAD_REQUEST', desc: 'Invalid request parameters' },
                  {
                    status: 401,
                    code: 'UNAUTHORIZED',
                    desc: 'Missing or invalid authentication token',
                  },
                  { status: 403, code: 'FORBIDDEN', desc: 'Insufficient permissions' },
                  { status: 404, code: 'NOT_FOUND', desc: 'Requested resource not found' },
                  { status: 409, code: 'CONFLICT', desc: 'Resource already exists' },
                  { status: 422, code: 'UNPROCESSABLE_ENTITY', desc: 'Validation failed' },
                  { status: 429, code: 'TOO_MANY_REQUESTS', desc: 'Rate limit exceeded' },
                  { status: 500, code: 'INTERNAL_ERROR', desc: 'Server error occurred' },
                ].map((item) => (
                  <TableRow key={item.status}>
                    <TableCell sx={{ color: alpha('#FFFFFF', 0.8) }}>
                      <Chip
                        label={item.status}
                        size="small"
                        sx={{ bgcolor: alpha('#EF4444', 0.2), color: '#EF4444' }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: alpha('#FFFFFF', 0.7), fontFamily: 'monospace' }}>
                      {item.code}
                    </TableCell>
                    <TableCell sx={{ color: alpha('#FFFFFF', 0.7) }}>{item.desc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
            📝 Example Error Response
          </Typography>
          <Paper sx={{ p: 2, bgcolor: alpha('#000000', 0.5), borderRadius: 2 }}>
            <pre style={{ color: '#E0E0E0', margin: 0, fontSize: '0.8rem' }}>
              {`{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired authentication token",
    "status": 401,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}`}
            </pre>
          </Paper>
        </Box>
      ),
    },
    {
      id: 'rate-limiting',
      title: '⏱️ Rate Limits',
      icon: <AccessTime />,
      content: (
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  🔢 Default Limits
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle sx={{ color: G_END }} />
                    </ListItemIcon>
                    <ListItemText primary="Authentication: 5 requests per minute" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle sx={{ color: G_END }} />
                    </ListItemIcon>
                    <ListItemText primary="Project CRUD: 60 requests per minute" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle sx={{ color: G_END }} />
                    </ListItemIcon>
                    <ListItemText primary="Design Save: 30 requests per minute" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle sx={{ color: G_END }} />
                    </ListItemIcon>
                    <ListItemText primary="Template Browsing: 120 requests per minute" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle sx={{ color: G_END }} />
                    </ListItemIcon>
                    <ListItemText primary="Integrations: 20 requests per minute" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  📈 Rate Limit Headers
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <span>📊</span>
                    </ListItemIcon>
                    <ListItemText primary="X-RateLimit-Limit: Maximum requests per window" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <span>📉</span>
                    </ListItemIcon>
                    <ListItemText primary="X-RateLimit-Remaining: Remaining requests" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <span>⏰</span>
                    </ListItemIcon>
                    <ListItemText primary="X-RateLimit-Reset: Time until limit resets" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mt: 3, bgcolor: alpha(G_START, 0.1) }}>
            <Typography variant="body2">
              💡 <strong>Enterprise Plan:</strong> Higher rate limits available for enterprise
              customers. Contact sales@aleyo.com for custom limits.
            </Typography>
          </Alert>
        </Box>
      ),
    },
  ];

  const tabLabels = [
    'Overview',
    'Authentication',
    'Projects',
    'Templates',
    'Integrations',
    'Payment',
    'Voice',
    'Admin',
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <Box>
            <Typography variant="body1" paragraph>
              The Aleyo API provides comprehensive access to the Design Studio platform. All
              endpoints require authentication unless specified otherwise.
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ bgcolor: alpha('#FFFFFF', 0.03), textAlign: 'center', p: 2 }}>
                  <Api sx={{ fontSize: 40, color: G_START }} />
                  <Typography variant="h6">RESTful API</Typography>
                  <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                    Standard HTTP methods
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ bgcolor: alpha('#FFFFFF', 0.03), textAlign: 'center', p: 2 }}>
                  <Lock sx={{ fontSize: 40, color: G_MID }} />
                  <Typography variant="h6">Bearer Token</Typography>
                  <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                    JWT authentication
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ bgcolor: alpha('#FFFFFF', 0.03), textAlign: 'center', p: 2 }}>
                  <Code sx={{ fontSize: 40, color: G_END }} />
                  <Typography variant="h6">JSON Responses</Typography>
                  <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                    Consistent format
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ bgcolor: '#080C14', minHeight: '100vh', pt: 2 }}>
        <Box
        onClick={() => window.open('/dashboard')}
        sx={{
            display: 'inline-flex',
            alignItems: 'center',
            cursor: 'pointer',
            mb: 2, mx: 2,
            '&:hover': { opacity: 0.7 },
        }}
        >
        <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'white', }}>
            ← Back to Dashboard
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
              sx={{
                fontWeight: 800,
                textAlign: 'center',
                color: 'white',
                mb: 2,
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
              }}
            >
              API Reference
              <br />
              <span style={{ fontSize: '0.6em' }}>Aleyo Design Studio API</span>
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                color: 'rgba(255,255,255,0.9)',
                maxWidth: 800,
                mx: 'auto',
              }}
            >
              Complete API documentation for programmatic access to the Design Studio platform
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 6 }}>
        {/* Quick Stats */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            { label: 'Endpoints', value: '15+', icon: <Api /> },
            { label: 'Services', value: '7', icon: <Build /> },
            { label: 'Auth Methods', value: 'JWT', icon: <VpnKey /> },
            { label: 'Response Time', value: '&lt;200ms', icon: <AccessTime /> },
          ].map((stat) => (
            <Grid item xs={6} sm={3} key={stat.label}>
              <Paper
                sx={{ p: 2, textAlign: 'center', bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2 }}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
                >
                  {stat.icon}
                  <Typography variant="h4" sx={{ color: G_START, fontWeight: 700 }}>
                    {stat.value}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.6) }}>
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Tabs Navigation */}
        <Paper sx={{ bgcolor: alpha('#FFFFFF', 0.03), borderRadius: 2, mb: 3, overflowX: 'auto' }}>
          <Tabs
            value={activeTab}
            onChange={(e, v) => setActiveTab(v)}
            sx={{
              '& .MuiTab-root': { color: alpha('#FFFFFF', 0.6), textTransform: 'none' },
              '& .Mui-selected': { color: G_START },
              '& .MuiTabs-indicator': { backgroundColor: G_START },
            }}
          >
            {tabLabels.map((label) => (
              <Tab key={label} label={label} />
            ))}
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <Paper sx={{ p: 3, bgcolor: alpha('#FFFFFF', 0.02), borderRadius: 2, mb: 4 }}>
          {renderTabContent()}
        </Paper>

        {/* Full API Documentation Accordions */}
        <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 700 }}>
          📚 Complete API Documentation
        </Typography>

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
            <AccordionSummary
              expandIcon={<ExpandMore sx={{ color: 'white' }} />}
              sx={{
                '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 1 },
              }}
            >
              {section.icon}
              <Typography variant="h6" sx={{ color: 'white' }}>
                {section.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ borderTop: `1px solid ${alpha('#FFFFFF', 0.08)}`, pt: 2 }}>
              {section.content}
            </AccordionDetails>
          </Accordion>
        ))}

        {/* SDK & Client Libraries */}
        <Paper sx={{ p: 3, bgcolor: alpha(G_START, 0.05), borderRadius: 2, mt: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Code /> SDK & Client Libraries
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: alpha('#FFFFFF', 0.03), textAlign: 'center', p: 2 }}>
                <Typography variant="h3">JS</Typography>
                <Typography variant="body2">JavaScript SDK</Typography>
                <Chip
                  label="npm install @aleyo/sdk"
                  size="small"
                  sx={{ mt: 1, bgcolor: alpha('#FFFFFF', 0.1) }}
                />
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: alpha('#FFFFFF', 0.03), textAlign: 'center', p: 2 }}>
                <Typography variant="h3">🐍</Typography>
                <Typography variant="body2">Python SDK</Typography>
                <Chip
                  label="pip install aleyo-client"
                  size="small"
                  sx={{ mt: 1, bgcolor: alpha('#FFFFFF', 0.1) }}
                />
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: alpha('#FFFFFF', 0.03), textAlign: 'center', p: 2 }}>
                <Typography variant="h3">⚛️</Typography>
                <Typography variant="body2">React Hooks</Typography>
                <Chip
                  label="useAleyo hook"
                  size="small"
                  sx={{ mt: 1, bgcolor: alpha('#FFFFFF', 0.1) }}
                />
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* Environment Variables */}
        <Paper sx={{ p: 3, bgcolor: alpha('#FFFFFF', 0.02), borderRadius: 2, mt: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Settings /> Environment Variables
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Variable</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Default</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.8), fontFamily: 'monospace' }}>
                    REACT_APP_API_URL
                  </TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.6) }}>http://localhost:5000</TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.6) }}>API base URL</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.8), fontFamily: 'monospace' }}>
                    REACT_APP_USE_MOCK
                  </TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.6) }}>true</TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.6) }}>Enable mock data mode</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.8), fontFamily: 'monospace' }}>
                    REACT_APP_GOCARDLESS_API_URL
                  </TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.6) }}>
                    https://api.gocardless.com
                  </TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.6) }}>GoCardless API URL</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.8), fontFamily: 'monospace' }}>
                    REACT_APP_GOCARDLESS_ACCESS_TOKEN
                  </TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.6) }}>—</TableCell>
                  <TableCell sx={{ color: alpha('#FFFFFF', 0.6) }}>GoCardless API token</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Support Footer */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Divider sx={{ borderColor: alpha('#FFFFFF', 0.1), mb: 3 }} />
          <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.5) }}>
            Need help with the API? Contact us at{' '}
            <span style={{ color: G_START }}>api@aleyo.com</span>
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: alpha('#FFFFFF', 0.3), display: 'block', mt: 1 }}
          >
            API Version: v1 | Last updated: January 2025
          </Typography>
        </Box>
      </Container>

      {/* Test Dialog */}
      <Dialog
        open={testDialogOpen}
        onClose={() => setTestDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#1A1F2E',
            borderRadius: 3,
            border: `1px solid ${alpha(G_START, 0.3)}`,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          API Test: {testEndpoint}
          <IconButton onClick={() => setTestDialogOpen(false)}>
            <Close sx={{ color: 'white' }} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.6), mb: 2 }}>
            Mock API Response
          </Typography>
          <Paper sx={{ p: 2, bgcolor: '#0A0F1A', borderRadius: 2, overflow: 'auto' }}>
            <pre
              style={{ color: '#E0E0E0', margin: 0, fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}
            >
              {testResponse}
            </pre>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestDialogOpen(false)} sx={{ color: alpha('#FFFFFF', 0.6) }}>
            Close
          </Button>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(testResponse);
              showSnackbar('Response copied to clipboard', 'success');
            }}
            variant="outlined"
            sx={{ borderColor: G_START, color: G_START }}
          >
            Copy Response
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ bgcolor: '#1A1F2E', color: 'white' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ApiReferencePage;
