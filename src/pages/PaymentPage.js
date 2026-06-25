// src/pages/PaymentPage.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Grid,
  Card,
  CardContent,
  Divider,
  Alert,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  InputAdornment,
  IconButton,
  Chip,
  alpha,
} from '@mui/material';
import {
  Payment as PaymentIcon,
  CreditCard,
  AccountBalance,
  Security,
  CheckCircle,
  ArrowBack,
  HelpOutline,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { gocardlessService } from '../services/gocardless';
import { motion } from 'framer-motion';

const G_START = '#4F6EF7';
const G_MID = '#2DBCB6';
const G_END = '#3ED67C';
const GRAD = `linear-gradient(135deg, ${G_START} 0%, ${G_MID} 50%, ${G_END} 100%)`;

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('direct_debit');

  const [formData, setFormData] = useState({
    // Personal details
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',

    // Address
    addressLine1: '',
    addressLine2: '',
    city: '',
    postcode: '',
    country: 'GB',

    // Bank details (for Direct Debit)
    accountHolderName: '',
    accountNumber: '',
    sortCode: '',
    bankName: '',

    // Card details (placeholder)
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  // Get selected plan from location state
  const selectedPlan = location.state?.plan || {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 79,
    priceYearly: 790,
    credits: 2000,
  };

  const isYearly = location.state?.isYearly || false;
  const selectedAddons = location.state?.addons || [];

  const calculateTotal = () => {
    const planPrice = isYearly ? selectedPlan.priceYearly : selectedPlan.priceMonthly;
    const addonsPrice = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
    return planPrice + addonsPrice;
  };

  const steps = ['Your Details', 'Payment Method', 'Confirm & Pay'];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handlePayment();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      const session = await gocardlessService.createPaymentSession(
        selectedPlan,
        { id: user?.id, email: user?.email, name: formData.fullName },
        selectedAddons
      );

      // Redirect to GoCardless payment page
      if (session.checkoutUrl) {
        window.location.href = session.checkoutUrl;
      } else {
        // Mock payment - navigate to success
        navigate('/payment/success', {
          state: {
            plan: selectedPlan,
            isYearly,
            addons: selectedAddons,
            total: calculateTotal(),
          },
        });
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateStep = () => {
    if (activeStep === 0) {
      return (
        formData.fullName &&
        formData.email &&
        formData.addressLine1 &&
        formData.city &&
        formData.postcode
      );
    }
    if (activeStep === 1) {
      if (paymentMethod === 'direct_debit') {
        return formData.accountHolderName && formData.accountNumber && formData.sortCode;
      }
      return formData.cardNumber && formData.expiryDate && formData.cvv;
    }
    return true;
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: 'white', mb: 2 }}>
              Personal Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.fullName}
                  onChange={handleChange('fullName')}
                  required
                  sx={{ input: { color: 'white' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  required
                  sx={{ input: { color: 'white' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phone}
                  onChange={handleChange('phone')}
                  sx={{ input: { color: 'white' } }}
                />
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ color: 'white', mt: 3, mb: 2 }}>
              Billing Address
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address Line 1"
                  value={formData.addressLine1}
                  onChange={handleChange('addressLine1')}
                  required
                  sx={{ input: { color: 'white' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address Line 2 (Optional)"
                  value={formData.addressLine2}
                  onChange={handleChange('addressLine2')}
                  sx={{ input: { color: 'white' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={formData.city}
                  onChange={handleChange('city')}
                  required
                  sx={{ input: { color: 'white' } }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Postcode"
                  value={formData.postcode}
                  onChange={handleChange('postcode')}
                  required
                  sx={{ input: { color: 'white' } }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Country"
                  value={formData.country}
                  onChange={handleChange('country')}
                  required
                  sx={{ input: { color: 'white' } }}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
              <FormLabel component="legend" sx={{ color: 'white', mb: 2 }}>
                Select Payment Method
              </FormLabel>
              <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <Paper
                  sx={{
                    mb: 2,
                    p: 2,
                    background:
                      paymentMethod === 'direct_debit'
                        ? `rgba(79,110,247,0.1)`
                        : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${paymentMethod === 'direct_debit' ? G_START : 'rgba(255,255,255,0.1)'}`,
                    cursor: 'pointer',
                  }}
                  onClick={() => setPaymentMethod('direct_debit')}
                >
                  <FormControlLabel
                    value="direct_debit"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccountBalance sx={{ color: G_START }} />
                        <Box>
                          <Typography variant="body1" sx={{ color: 'white' }}>
                            Direct Debit
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                            Save 10% with Direct Debit
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </Paper>

                <Paper
                  sx={{
                    p: 2,
                    background:
                      paymentMethod === 'card' ? `rgba(79,110,247,0.1)` : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${paymentMethod === 'card' ? G_START : 'rgba(255,255,255,0.1)'}`,
                    cursor: 'pointer',
                  }}
                  onClick={() => setPaymentMethod('card')}
                >
                  <FormControlLabel
                    value="card"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CreditCard sx={{ color: G_START }} />
                        <Typography variant="body1" sx={{ color: 'white' }}>
                          Credit/Debit Card
                        </Typography>
                      </Box>
                    }
                  />
                </Paper>
              </RadioGroup>
            </FormControl>

            {paymentMethod === 'direct_debit' && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ color: 'white', mb: 2 }}>
                  Bank Account Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Account Holder Name"
                      value={formData.accountHolderName}
                      onChange={handleChange('accountHolderName')}
                      required
                      sx={{ input: { color: 'white' } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Sort Code"
                      placeholder="12-34-56"
                      value={formData.sortCode}
                      onChange={handleChange('sortCode')}
                      required
                      sx={{ input: { color: 'white' } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Account Number"
                      value={formData.accountNumber}
                      onChange={handleChange('accountNumber')}
                      required
                      sx={{ input: { color: 'white' } }}
                    />
                  </Grid>
                </Grid>

                <Alert
                  severity="info"
                  sx={{
                    mt: 2,
                    background: `rgba(79,110,247,0.1)`,
                    border: `1px solid ${alpha(G_START, 0.3)}`,
                    '& .MuiAlert-icon': { color: G_START },
                  }}
                >
                  <Typography variant="body2">
                    Direct Debit payments are protected by the Direct Debit Guarantee.
                  </Typography>
                </Alert>
              </Box>
            )}

            {paymentMethod === 'card' && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ color: 'white', mb: 2 }}>
                  Card Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Card Number"
                      placeholder="4242 4242 4242 4242"
                      value={formData.cardNumber}
                      onChange={handleChange('cardNumber')}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CreditCard sx={{ color: 'rgba(255,255,255,0.5)' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ input: { color: 'white' } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Expiry Date"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleChange('expiryDate')}
                      required
                      sx={{ input: { color: 'white' } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="CVV"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleChange('cvv')}
                      required
                      type="password"
                      sx={{ input: { color: 'white' } }}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: 'white', mb: 2 }}>
              Order Summary
            </Typography>

            <Card
              sx={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                mb: 2,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    {selectedPlan.name} Plan ({isYearly ? 'Yearly' : 'Monthly'})
                  </Typography>
                  <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                    £{isYearly ? selectedPlan.priceYearly : selectedPlan.priceMonthly}
                  </Typography>
                </Box>

                {selectedAddons.map((addon) => (
                  <Box
                    key={addon.name}
                    sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
                  >
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>{addon.name}</Typography>
                    <Typography sx={{ color: 'white' }}>£{addon.price}</Typography>
                  </Box>
                ))}

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 1 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography sx={{ color: 'white', fontWeight: 'bold' }}>Total</Typography>
                  <Typography sx={{ color: G_START, fontWeight: 'bold', fontSize: '1.2rem' }}>
                    £{calculateTotal()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Card
              sx={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <CardContent>
                <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
                  Payment Method:{' '}
                  {paymentMethod === 'direct_debit' ? 'Direct Debit' : 'Credit/Debit Card'}
                </Typography>
                {paymentMethod === 'direct_debit' && (
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    Account: {formData.accountHolderName} •••• {formData.accountNumber?.slice(-4)}
                  </Typography>
                )}
                {paymentMethod === 'card' && (
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    Card: •••• {formData.cardNumber?.slice(-4)}
                  </Typography>
                )}
              </CardContent>
            </Card>

            <Alert
              severity="success"
              sx={{
                mt: 2,
                background: `rgba(62,214,124,0.1)`,
                border: `1px solid ${alpha(G_END, 0.3)}`,
              }}
            >
              <Typography variant="body2">
                You'll receive {selectedPlan.credits} AI credits immediately after payment.
              </Typography>
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ bgcolor: '#080C14', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            sx={{
              p: 4,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '24px',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <PaymentIcon sx={{ fontSize: 32, color: G_START }} />
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                Complete Your Purchase
              </Typography>
            </Box>

            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel StepIconProps={{ sx: { color: G_START } }}>
                    <Typography sx={{ color: 'white' }}>{label}</Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {renderStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                variant="outlined"
                onClick={activeStep === 0 ? () => navigate('/pricing') : handleBack}
                disabled={loading}
                sx={{
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': { borderColor: G_START },
                }}
              >
                {activeStep === 0 ? 'Back to Pricing' : 'Back'}
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!validateStep() || loading}
                sx={{
                  background: GRAD,
                  px: 4,
                  '&:hover': { opacity: 0.9 },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : activeStep === steps.length - 1 ? (
                  `Pay £${calculateTotal()}`
                ) : (
                  'Continue'
                )}
              </Button>
            </Box>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255,255,255,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                }}
              >
                <Security sx={{ fontSize: 14 }} />
                Secure payment powered by GoCardless
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default PaymentPage;
