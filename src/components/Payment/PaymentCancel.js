// src/components/Payment/PaymentCancel.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Chip,
  alpha,
  Snackbar,
} from '@mui/material';
import {
  Cancel as CancelIcon,
  ArrowBack,
  HelpOutline,
  SupportAgent,
  QuestionAnswer,
  Email,
  Chat,
  Refresh,
  Feedback,
  SentimentDissatisfied,
  Replay,
  CheckCircle,
  Close,
  Payment as PaymentIcon,
  CreditCard,
  AccountBalance,
  Security,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const G_START = '#4F6EF7';
const G_MID = '#2DBCB6';
const G_END = '#3ED67C';
const GRAD = `linear-gradient(135deg, ${G_START} 0%, ${G_MID} 50%, ${G_END} 100%)`;

const PaymentCancel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [showSupportDialog, setShowSupportDialog] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackReason, setFeedbackReason] = useState('');
  const [feedbackComment, setFeedbackComment] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [retryLoading, setRetryLoading] = useState(false);

  // Get plan details from location state or localStorage
  const [planDetails, setPlanDetails] = useState(null);

  useEffect(() => {
    // Try to get plan details from location state or localStorage
    const statePlan = location.state?.plan;
    const storedPlan = localStorage.getItem('cancelled_plan');

    if (statePlan) {
      setPlanDetails(statePlan);
      // Store for persistence
      localStorage.setItem('cancelled_plan', JSON.stringify(statePlan));
    } else if (storedPlan) {
      setPlanDetails(JSON.parse(storedPlan));
    } else {
      // Default plan details
      setPlanDetails({
        id: 'pro',
        name: 'Pro',
        priceMonthly: 79,
        priceYearly: 790,
        credits: 2000,
      });
    }
  }, [location]);

  const handleRetryPayment = async () => {
    setRetryLoading(true);
    // Simulate retry - in production, would redirect to payment
    setTimeout(() => {
      setRetryLoading(false);
      // Navigate back to payment page with the same plan
      navigate('/payment', {
        state: {
          plan: planDetails,
          isYearly: location.state?.isYearly || false,
          addons: location.state?.addons || [],
        },
      });
    }, 1000);
  };

  const handleTryDifferentPlan = () => {
    navigate('/pricing');
  };

  const handleContactSupport = () => {
    setShowSupportDialog(true);
  };

  const handleSubmitFeedback = async () => {
    setLoading(true);
    // Simulate feedback submission
    setTimeout(() => {
      setShowFeedbackDialog(false);
      setSnackbar({
        open: true,
        message: 'Thank you for your feedback! We appreciate your input.',
        severity: 'success',
      });
      setLoading(false);

      // Reset form
      setFeedbackRating(0);
      setFeedbackReason('');
      setFeedbackComment('');
    }, 1000);
  };

  const handleSendSupportMessage = async () => {
    setLoading(true);
    // Simulate sending support message
    setTimeout(() => {
      setShowSupportDialog(false);
      setSnackbar({
        open: true,
        message: "Support ticket created! We'll get back to you within 24 hours.",
        severity: 'success',
      });
      setLoading(false);
    }, 1000);
  };

  const showNotification = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const cancelReasons = [
    'Too expensive',
    'Technical issues',
    'Found a better alternative',
    'Not ready to commit',
    'Payment method not accepted',
    'Just exploring options',
    'Other',
  ];

  const quickActions = [
    {
      icon: <Replay />,
      title: 'Retry Payment',
      description: 'Try processing your payment again',
      action: handleRetryPayment,
      color: G_START,
    },
    {
      icon: <Refresh />,
      title: 'Try Different Plan',
      description: 'Explore other pricing options',
      action: handleTryDifferentPlan,
      color: G_MID,
    },
    {
      icon: <SupportAgent />,
      title: 'Contact Support',
      description: 'Get help from our support team',
      action: handleContactSupport,
      color: G_END,
    },
    {
      icon: <Feedback />,
      title: 'Provide Feedback',
      description: 'Help us improve our service',
      action: () => setShowFeedbackDialog(true),
      color: '#F59E0B',
    },
  ];

  const commonIssues = [
    {
      title: 'Payment Declined',
      description:
        'Your bank may have declined the transaction. Contact your bank or try a different payment method.',
      solution: 'Try a different card or contact your bank to authorize the transaction.',
    },
    {
      title: 'Insufficient Funds',
      description: 'The payment was declined due to insufficient funds in your account.',
      solution: 'Add funds to your account or try a different payment method.',
    },
    {
      title: 'Technical Error',
      description: 'A temporary technical issue prevented the payment from completing.',
      solution: 'Wait a few minutes and try again, or contact support if the issue persists.',
    },
    {
      title: 'Payment Method Not Accepted',
      description: 'Your payment method may not be accepted for this transaction.',
      solution: 'Try using a different card or payment method.',
    },
  ];

  return (
    <Box sx={{ bgcolor: '#080C14', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Paper
            sx={{
              p: 4,
              mb: 4,
              textAlign: 'center',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '24px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <CancelIcon sx={{ fontSize: 80, color: '#EF4444', mb: 2 }} />
            </motion.div>

            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
              Payment Cancelled
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: 'rgba(255,255,255,0.6)', mb: 3, maxWidth: 600, mx: 'auto' }}
            >
              Your payment was not completed. No charges have been made to your account. You can try
              again or explore other options below.
            </Typography>

            {planDetails && (
              <Chip
                label={`Attempted: ${planDetails.name} Plan`}
                sx={{
                  bgcolor: 'rgba(239,68,68,0.1)',
                  color: '#EF4444',
                  border: '1px solid rgba(239,68,68,0.3)',
                }}
              />
            )}
          </Paper>

          {/* Quick Actions Grid */}
          <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
            What would you like to do?
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      background: 'rgba(255,255,255,0.03)',
                      border: `1px solid rgba(255,255,255,0.08)`,
                      borderRadius: '16px',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        borderColor: action.color,
                        boxShadow: `0 8px 24px ${alpha(action.color, 0.2)}`,
                      },
                    }}
                    onClick={action.action}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <IconButton
                        sx={{
                          bgcolor: alpha(action.color, 0.1),
                          color: action.color,
                          mb: 2,
                          width: 56,
                          height: 56,
                          '&:hover': { bgcolor: alpha(action.color, 0.2) },
                        }}
                      >
                        {action.icon}
                      </IconButton>
                      <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                        {action.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        {action.description}
                      </Typography>
                      {action.title === 'Retry Payment' && retryLoading && (
                        <CircularProgress size={24} sx={{ mt: 1, color: action.color }} />
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Common Issues Section */}
          <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
            Common Issues & Solutions
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {commonIssues.map((issue, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  sx={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <HelpOutline sx={{ color: G_START, fontSize: 20 }} />
                      <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                        {issue.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>
                      {issue.description}
                    </Typography>
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 1 }} />
                    <Typography variant="body2" sx={{ color: G_START, mt: 1 }}>
                      💡 {issue.solution}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Alternative Payment Methods */}
          <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
            Alternative Payment Methods
          </Typography>
          <Paper
            sx={{
              p: 3,
              mb: 4,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CreditCard sx={{ color: G_START, fontSize: 32 }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                      Credit/Debit Card
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                      Visa, Mastercard, American Express
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AccountBalance sx={{ color: G_START, fontSize: 32 }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                      Direct Debit
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                      Save 10% on all plans
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PaymentIcon sx={{ color: G_START, fontSize: 32 }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                      PayPal
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                      Secure online payments
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Need Help Section */}
          <Paper
            sx={{
              p: 3,
              background: `linear-gradient(135deg, ${alpha(G_START, 0.1)} 0%, ${alpha(G_MID, 0.05)} 100%)`,
              border: `1px solid ${alpha(G_START, 0.2)}`,
              borderRadius: '16px',
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
              Still having issues?
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2 }}>
              Our support team is here to help you complete your purchase
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<Chat />}
                onClick={() => window.open('https://calendly.com/aleyo/support', '_blank')}
                sx={{
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': { borderColor: G_START },
                }}
              >
                Live Chat
              </Button>
              <Button
                variant="outlined"
                startIcon={<Email />}
                onClick={() => (window.location.href = 'mailto:support@aleyo.com')}
                sx={{
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': { borderColor: G_START },
                }}
              >
                Email Support
              </Button>
              <Button
                variant="contained"
                startIcon={<QuestionAnswer />}
                onClick={handleContactSupport}
                sx={{
                  background: GRAD,
                  '&:hover': { opacity: 0.9 },
                }}
              >
                Create Support Ticket
              </Button>
            </Box>
          </Paper>

          {/* Back to Navigation */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/pricing')}
              sx={{
                color: 'rgba(255,255,255,0.6)',
                '&:hover': { color: 'white' },
              }}
            >
              Back to Pricing
            </Button>
            <Button sx={{ ml: 2, color: G_START }} onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </Box>
        </motion.div>
      </Container>

      {/* Feedback Dialog */}
      <Dialog
        open={showFeedbackDialog}
        onClose={() => setShowFeedbackDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: '#0D1220',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Feedback sx={{ color: G_START }} />
            <Typography variant="h6">Help Us Improve</Typography>
          </Box>
          <IconButton
            onClick={() => setShowFeedbackDialog(false)}
            sx={{ color: 'rgba(255,255,255,0.5)' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2 }}>
            We'd love to know why you cancelled your payment. Your feedback helps us improve.
          </Typography>

          <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
            How would you rate your experience?
          </Typography>
          <Rating
            value={feedbackRating}
            onChange={(_, value) => setFeedbackRating(value)}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel sx={{ color: 'rgba(255,255,255,0.6)' }}>Reason for cancellation</InputLabel>
            <Select
              value={feedbackReason}
              onChange={(e) => setFeedbackReason(e.target.value)}
              label="Reason for cancellation"
              sx={{
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
              }}
            >
              {cancelReasons.map((reason) => (
                <MenuItem key={reason} value={reason}>
                  {reason}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Additional comments"
            value={feedbackComment}
            onChange={(e) => setFeedbackComment(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Button
            onClick={() => setShowFeedbackDialog(false)}
            sx={{ color: 'rgba(255,255,255,0.6)' }}
          >
            Skip
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitFeedback}
            disabled={loading}
            sx={{ background: GRAD }}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Feedback'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Support Ticket Dialog */}
      <Dialog
        open={showSupportDialog}
        onClose={() => setShowSupportDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: '#0D1220',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SupportAgent sx={{ color: G_START }} />
            <Typography variant="h6">Contact Support</Typography>
          </Box>
          <IconButton
            onClick={() => setShowSupportDialog(false)}
            sx={{ color: 'rgba(255,255,255,0.5)' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2 }}>
            Our support team will get back to you within 24 hours.
          </Typography>

          <TextField
            fullWidth
            label="Subject"
            placeholder="Payment issue: [describe your issue]"
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
              },
            }}
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Message"
            placeholder="Please describe the issue you're experiencing..."
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Button
            onClick={() => setShowSupportDialog(false)}
            sx={{ color: 'rgba(255,255,255,0.6)' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSendSupportMessage}
            disabled={loading}
            sx={{ background: GRAD }}
          >
            {loading ? <CircularProgress size={24} /> : 'Send Message'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{
            background: '#0D1220',
            border: `1px solid ${snackbar.severity === 'success' ? G_END : G_START}`,
            color: 'white',
            borderRadius: '12px',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PaymentCancel;
