import React, { useState } from 'react';
import { Box, Container, Paper, TextField, Button, Typography, Link, Alert } from '@mui/material';
import { Email } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import logoImage from '../logo-1.png';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
    }, 1000);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, borderRadius: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <img
              src={logoImage}
              alt="Aleyo Logo"
              style={{
                width: 48,
                height: 48,
                marginBottom: 16,
                cursor: 'pointer',
              }}
              onClick={() => navigate('/')}
            />
            <Typography variant="h5" sx={{ mt: 2 }}>
              Reset Password
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your email to receive reset instructions
            </Typography>
          </Box>

          {success ? (
            <Alert severity="success" sx={{ mb: 3 }}>
              Password reset email sent! Check your inbox.
              <Button size="small" onClick={() => navigate('/login')} sx={{ ml: 2 }}>
                Return to Login
              </Button>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
              <Button fullWidth type="submit" variant="contained" size="large" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <Typography align="center" sx={{ mt: 2 }}>
                <Link component={RouterLink} to="/login">
                  Back to Login
                </Link>
              </Typography>
            </form>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPasswordPage;
