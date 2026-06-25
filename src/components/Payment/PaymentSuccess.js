// src/components/Payment/PaymentSuccess.js
import React, { useEffect, useState } from 'react';
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
  Divider,
} from '@mui/material';
import { CheckCircle, ArrowForward, Receipt } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const G_START = '#4F6EF7';
const G_END = '#3ED67C';
const GRAD = `linear-gradient(135deg, ${G_START} 0%, ${G_END} 100%)`;

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    // Verify payment with backend
    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search);
      const sessionId = params.get('session_id');

      if (sessionId) {
        try {
          // In production, verify with backend
          // const result = await apiService.verifyPayment(sessionId);
          setPaymentDetails(
            location.state || {
              plan: { name: 'Pro Plan' },
              total: 79,
              isYearly: false,
            }
          );
        } catch (error) {
          console.error('Payment verification failed:', error);
        }
      } else if (location.state) {
        setPaymentDetails(location.state);
      }

      setLoading(false);
    };

    verifyPayment();
  }, [location]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: '#080C14',
        }}
      >
        <CircularProgress sx={{ color: G_START }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{ bgcolor: '#080C14', minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '24px',
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <CheckCircle sx={{ fontSize: 80, color: G_END, mb: 2 }} />
            </motion.div>

            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
              Payment Successful!
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>
              Thank you for your purchase. Your account has been upgraded.
            </Typography>

            {paymentDetails && (
              <Card sx={{ maxWidth: 400, mx: 'auto', mb: 3, background: 'rgba(255,255,255,0.05)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Receipt sx={{ color: G_START }} />
                    <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                      Order Summary
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {paymentDetails.plan?.name}
                    </Typography>
                    <Typography sx={{ color: 'white' }}>£{paymentDetails.total}</Typography>
                  </Box>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography sx={{ color: 'white', fontWeight: 'bold' }}>Total Paid</Typography>
                    <Typography sx={{ color: G_START, fontWeight: 'bold' }}>
                      £{paymentDetails.total}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}

            <Alert
              severity="success"
              sx={{ mb: 3, background: `rgba(62,214,124,0.1)`, border: `1px solid ${G_END}` }}
            >
              Your AI credits have been added to your account. Start building your website now!
            </Alert>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/dashboard')}
                sx={{
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': { borderColor: G_START },
                }}
              >
                Go to Dashboard
              </Button>
              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/studio')}
                sx={{
                  background: GRAD,
                  '&:hover': { opacity: 0.9 },
                }}
              >
                Start Building
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default PaymentSuccess;
