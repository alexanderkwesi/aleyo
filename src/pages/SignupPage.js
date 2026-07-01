// SignupPage.js
import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Person } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const G_START = '#4F6EF7';
const G_END = '#3ED67C';
const GRAD = `linear-gradient(135deg, ${G_START} 0%, #2DBCB6 50%, ${G_END} 100%)`;

const API_BASE = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeTerms: false,
  });

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (!formData.agreeTerms) {
      setError('You must agree to the terms and conditions');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400) {
          setError(
            data.detail || 'Email already registered. Please use a different email or login.'
          );
        } else if (res.status === 429) {
          setError('Too many signup attempts. Please try again later.');
        } else {
          setError(data.detail || 'Registration failed. Please try again.');
        }
        setLoading(false);
        return;
      }

      // Check for successful signup response
      if (data.status === 'success' && data.access_token && data.user) {
        // Store user data
        const userData = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          credits: data.user.credits,
          created_at: data.user.created_at,
          subscription_tier: data.user.subscription_tier,
        };

        // Log the user in (this updates both token and user state)
        login(data.access_token, userData);

        // Show success message (optional)
        console.log('Signup successful! Welcome', userData.name);

        // Navigate to dashboard
        navigate('/login');
      } else {
        setError('Invalid server response. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Network error. Please check your connection and try again.');
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #080C14 0%, #0F172A 100%)',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <img
              src="/logo-1.png"
              alt="Aleyo Logo"
              style={{
                width: 48,
                height: 48,
                marginBottom: 16,
                cursor: 'pointer',
              }}
              onClick={() => navigate('/')}
            />
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 600, mt: 2 }}>
              Create Account
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 1 }}>
              Get 50 free credits to start building your website
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                background: 'rgba(220,38,38,0.1)',
                color: '#f87171',
                border: '1px solid #dc2626',
                '& .MuiAlert-icon': { color: '#f87171' },
              }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} aria-label="Signup form">
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              autoFocus
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&.Mui-focused fieldset': { borderColor: G_START },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                '& .MuiInputLabel-root.Mui-focused': { color: G_START },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: 'rgba(255,255,255,0.5)' }} />
                  </InputAdornment>
                ),
              }}
              inputProps={{
                'aria-label': 'Full name',
                autoComplete: 'name',
              }}
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&.Mui-focused fieldset': { borderColor: G_START },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                '& .MuiInputLabel-root.Mui-focused': { color: G_START },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: 'rgba(255,255,255,0.5)' }} />
                  </InputAdornment>
                ),
              }}
              inputProps={{
                'aria-label': 'Email address',
                autoComplete: 'email',
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              helperText="Must be at least 6 characters"
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&.Mui-focused fieldset': { borderColor: G_START },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                '& .MuiInputLabel-root.Mui-focused': { color: G_START },
                '& .MuiFormHelperText-root': { color: 'rgba(255,255,255,0.4)' },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'rgba(255,255,255,0.5)' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      sx={{ color: 'rgba(255,255,255,0.5)' }}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              inputProps={{
                'aria-label': 'Password',
                autoComplete: 'new-password',
                minLength: 6,
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  sx={{
                    color: 'rgba(255,255,255,0.5)',
                    '&.Mui-checked': { color: G_START },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  I agree to the{' '}
                  <Link
                    component={RouterLink}
                    to="/terms"
                    sx={{ color: G_START, textDecoration: 'none' }}
                  >
                    Terms of Service
                  </Link>
                  {' and '}
                  <Link
                    component={RouterLink}
                    to="/privacy"
                    sx={{ color: G_START, textDecoration: 'none' }}
                  >
                    Privacy Policy
                  </Link>
                </Typography>
              }
              sx={{ mb: 2 }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                background: GRAD,
                borderRadius: '999px',
                textTransform: 'none',
                py: 1.5,
                mb: 2,
                '&:hover': {
                  opacity: 0.9,
                  transform: 'scale(1.02)',
                  transition: 'all 0.2s ease',
                },
                '&:disabled': {
                  opacity: 0.6,
                },
              }}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>

            <Typography align="center" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
              Already have an account?{' '}
              <Link
                component={RouterLink}
                to="/login"
                sx={{
                  color: G_START,
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Sign in
              </Link>
            </Typography>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignupPage;
