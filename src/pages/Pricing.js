// Pricing.js
import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Switch,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  alpha,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Avatar,
  Divider,
} from '@mui/material';
import {
  CheckCircle,
  Rocket,
  Business,
  Apartment, // Changed from Enterprise to Apartment
  Star,
  Payment,
  Security,
  SupportAgent,
  Storage,
  Analytics,
  CloudQueue,
  TrendingUp,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const G_START = '#4F6EF7';
const G_MID = '#2DBCB6';
const G_END = '#3ED67C';
const GRAD = `linear-gradient(135deg, ${G_START} 0%, ${G_MID} 50%, ${G_END} 100%)`;

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    icon: <Rocket />,
    priceMonthly: 29,
    priceYearly: 290,
    credits: 500,
    features: [
      '500 AI credits per month',
      'Up to 3 websites',
      'Basic templates',
      'Email support',
      'SSL certificate',
      'Custom domain',
    ],
    popular: false,
    color: G_START,
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: <Business />,
    priceMonthly: 79,
    priceYearly: 790,
    credits: 2000,
    features: [
      '2000 AI credits per month',
      'Up to 15 websites',
      'All templates',
      'Priority support',
      'Advanced analytics',
      'Custom code injection',
      'E-commerce features',
      'API access',
    ],
    popular: true,
    color: G_MID,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: <Apartment />, // Changed from Enterprise to Apartment
    priceMonthly: 199,
    priceYearly: 1990,
    credits: 10000,
    features: [
      '10000 AI credits per month',
      'Unlimited websites',
      'Custom templates',
      '24/7 dedicated support',
      'White-label options',
      'Team collaboration',
      'Advanced security',
      'SLA guarantee',
      'Custom integrations',
    ],
    popular: false,
    color: G_END,
  },
];

const addons = [
  { name: 'Additional Credits (500)', price: 25, icon: <CloudQueue /> },
  { name: 'Priority Support', price: 49, icon: <SupportAgent /> },
  { name: 'Advanced Analytics', price: 29, icon: <Analytics /> },
  { name: 'Extra Storage (10GB)', price: 15, icon: <Storage /> },
];

const Pricing = () => {
  const theme = useTheme();
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState([]);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setSelectedAddons([]);
    setCheckoutOpen(true);
  };

  const handleAddonToggle = (addon) => {
    setSelectedAddons((prev) =>
      prev.includes(addon) ? prev.filter((a) => a !== addon) : [...prev, addon]
    );
  };

  const getTotalPrice = () => {
    if (!selectedPlan) return 0;
    const planPrice = isYearly ? selectedPlan.priceYearly : selectedPlan.priceMonthly;
    const addonsPrice = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
    return planPrice + addonsPrice;
  };

  const handleCheckout = () => {
    // In production, integrate with Stripe or other payment processor
    alert(
      `Proceeding to checkout with ${selectedPlan?.name} plan${isYearly ? ' (yearly)' : ' (monthly)'}\nTotal: $${getTotalPrice()}`
    );
    setCheckoutOpen(false);
    window.open('/payment', '_blank'); // Open payment page in new tab
  };

  return (
    <Box sx={{ bgcolor: '#080C14', minHeight: '100vh', pt: 2 }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            sx={{ color: 'white', textAlign: 'center' }}
          >
            Simple, Transparent Pricing
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255,255,255,0.6)',
              textAlign: 'center',
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Choose the plan that fits your needs. All plans include AI-powered website building
            tools.
          </Typography>
        </motion.div>

        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 6, gap: 2 }}
        >
          <Typography variant="body1" sx={{ color: !isYearly ? 'white' : 'rgba(255,255,255,0.5)' }}>
            Monthly
          </Typography>
          <Switch
            checked={isYearly}
            onChange={() => setIsYearly(!isYearly)}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: G_START,
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: G_START,
              },
            }}
          />
          <Typography variant="body1" sx={{ color: isYearly ? 'white' : 'rgba(255,255,255,0.5)' }}>
            Yearly{' '}
            <Chip
              label="Save 20%"
              size="small"
              sx={{ ml: 1, bgcolor: alpha(G_END, 0.2), color: G_END, height: 20 }}
            />
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {plans.map((plan, index) => (
            <Grid item xs={12} md={4} key={plan.id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    position: 'relative',
                    background: plan.popular
                      ? `linear-gradient(135deg, ${alpha(plan.color, 0.1)} 0%, rgba(0,0,0,0.8) 100%)`
                      : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${plan.popular ? plan.color : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '24px',
                    height: '100%',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                    },
                  }}
                >
                  {plan.popular && (
                    <Chip
                      label="Most Popular"
                      icon={<Star />}
                      sx={{
                        position: 'absolute',
                        top: -12,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: GRAD,
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    />
                  )}
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Avatar sx={{ bgcolor: alpha(plan.color, 0.2), color: plan.color }}>
                        {plan.icon}
                      </Avatar>
                      <Typography variant="h5" fontWeight="bold" sx={{ color: 'white' }}>
                        {plan.name}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="h3"
                        fontWeight="bold"
                        sx={{ color: 'white', display: 'inline' }}
                      >
                        ${isYearly ? plan.priceYearly : plan.priceMonthly}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: 'rgba(255,255,255,0.5)', display: 'inline', ml: 1 }}
                      >
                        /{isYearly ? 'year' : 'month'}
                      </Typography>
                      {isYearly && (
                        <Typography
                          variant="caption"
                          sx={{ color: G_END, display: 'block', mt: 0.5 }}
                        >
                          Save ${plan.priceMonthly * 12 - plan.priceYearly}/year
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>
                        Includes:
                      </Typography>
                      <List dense disablePadding>
                        {plan.features.map((feature, idx) => (
                          <ListItem key={idx} disableGutters sx={{ py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <CheckCircle sx={{ fontSize: 16, color: plan.color }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={feature}
                              primaryTypographyProps={{
                                variant: 'body2',
                                sx: { color: 'rgba(255,255,255,0.7)' },
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                    <Box
                      sx={{
                        mt: 2,
                        p: 1.5,
                        bgcolor: 'rgba(255,255,255,0.05)',
                        borderRadius: '12px',
                      }}
                    >
                      <Typography variant="body2" sx={{ color: 'white' }}>
                        🎁 {plan.credits} AI credits included
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        ~ {Math.floor(plan.credits / 100)} full websites
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      fullWidth
                      variant={plan.popular ? 'contained' : 'outlined'}
                      size="large"
                      onClick={() => handlePlanSelect(plan)}
                      sx={{
                        ...(plan.popular && { background: GRAD }),
                        borderColor: plan.popular ? 'transparent' : 'rgba(255,255,255,0.2)',
                        color: plan.popular ? 'white' : 'rgba(255,255,255,0.9)',
                        '&:hover': {
                          borderColor: plan.color,
                          bgcolor: alpha(plan.color, 0.1),
                        },
                        borderRadius: '40px',
                        py: 1.5,
                      }}
                    >
                      Get Started
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>
            All plans include a 14-day money-back guarantee. No questions asked.
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mt: 1 }}>
            Need a custom plan?{' '}
            <span style={{ color: G_START, cursor: 'pointer' }}>Contact our sales team</span>
          </Typography>
        </Box>

        <Dialog
          open={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: '#0A0F1A',
              borderRadius: '16px',
              border: `1px solid ${alpha(G_START, 0.3)}`,
            },
          }}
        >
          {selectedPlan && (
            <>
              <DialogTitle sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                Checkout - {selectedPlan.name} Plan
              </DialogTitle>
              <DialogContent sx={{ mt: 2 }}>
                <Alert severity="info" sx={{ mb: 2, bgcolor: alpha(G_START, 0.1), color: 'white' }}>
                  You're getting {selectedPlan.credits} AI credits per month
                </Alert>

                <Typography variant="subtitle1" sx={{ color: 'white', mb: 2 }}>
                  Add-ons (optional)
                </Typography>
                <Grid container spacing={1} sx={{ mb: 3 }}>
                  {addons.map((addon) => (
                    <Grid item xs={12} key={addon.name}>
                      <Card
                        sx={{
                          bgcolor: selectedAddons.includes(addon)
                            ? alpha(G_START, 0.1)
                            : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${selectedAddons.includes(addon) ? G_START : 'rgba(255,255,255,0.1)'}`,
                          cursor: 'pointer',
                        }}
                        onClick={() => handleAddonToggle(addon)}
                      >
                        <CardContent
                          sx={{
                            py: 1,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {addon.icon}
                            <Typography sx={{ color: 'white' }}>{addon.name}</Typography>
                          </Box>
                          <Typography sx={{ color: G_START, fontWeight: 'bold' }}>
                            ${addon.price}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    {selectedPlan.name} ({isYearly ? 'Yearly' : 'Monthly'})
                  </Typography>
                  <Typography sx={{ color: 'white' }}>
                    ${isYearly ? selectedPlan.priceYearly : selectedPlan.priceMonthly}
                  </Typography>
                </Box>
                {selectedAddons.map((addon) => (
                  <Box
                    key={addon.name}
                    sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
                  >
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>{addon.name}</Typography>
                    <Typography sx={{ color: 'white' }}>${addon.price}</Typography>
                  </Box>
                ))}
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography sx={{ color: 'white', fontWeight: 'bold' }}>Total</Typography>
                  <Typography sx={{ color: G_START, fontWeight: 'bold', fontSize: '1.5rem' }}>
                    ${getTotalPrice()}
                  </Typography>
                </Box>

                <TextField
                  fullWidth
                  placeholder="Promo code"
                  variant="outlined"
                  size="small"
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    },
                  }}
                />
              </DialogContent>
              <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <Button
                  onClick={() => setCheckoutOpen(false)}
                  sx={{ color: 'rgba(255,255,255,0.6)' }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCheckout}
                  sx={{ background: GRAD, px: 3 }}
                >
                  Proceed to Payment
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default Pricing;
