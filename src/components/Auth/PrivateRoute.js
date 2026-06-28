// src/components/Auth/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, CircularProgress, Typography, Paper, alpha } from '@mui/material';
import { motion } from 'framer-motion';

const G_START = '#4F6EF7';
const G_MID = '#2DBCB6';
const G_END = '#3ED67C';
const GRAD = `linear-gradient(135deg, ${G_START} 0%, ${G_MID} 50%, ${G_END} 100%)`;

// Loading component for better UX
const LoadingScreen = () => (
  <Box
    sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#080C14',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
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
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: G_START,
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              },
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 40,
              height: 40,
              background: GRAD,
              borderRadius: '50%',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
        </Box>
        <Typography
          variant="h6"
          sx={{
            mt: 3,
            color: 'white',
            fontWeight: 600,
            background: GRAD,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Verifying Access...
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mt: 1,
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          Please wait while we secure your experience
        </Typography>
      </Paper>
    </motion.div>
    <style>{`
      @keyframes pulse {
        0%, 100% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0.5;
        }
        50% {
          transform: translate(-50%, -50%) scale(1.2);
          opacity: 1;
        }
      }
    `}</style>
  </Box>
);

// Unauthorized access component
const UnauthorizedScreen = () => {
  const location = useLocation();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#080C14',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          sx={{
            p: 4,
            maxWidth: 500,
            textAlign: 'center',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '24px',
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: `rgba(239,68,68,0.1)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <Typography variant="h2" sx={{ color: '#EF4444' }}>
              !
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
            Access Denied
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>
            You don't have permission to access this page. Please contact your administrator if you
            believe this is an error.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'monospace',
              mb: 3,
            }}
          >
            Attempted to access: {location.pathname}
          </Typography>
        </Paper>
      </motion.div>
    </Box>
  );
};

// Main Private Route Component
const PrivateRoute = ({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  redirectTo = '/login',
}) => {
  const { user, token, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Debug logs
  console.log('=== PRIVATE ROUTE DEBUG ===');
  console.log('user:', user);
  console.log('token:', token);
  console.log('loading:', loading);
  console.log('isAuthenticated:', isAuthenticated);
  console.log('location:', location.pathname);
  console.log('localStorage authToken:', localStorage.getItem('authToken'));
  console.log('localStorage user:', localStorage.getItem('user'));

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated || !token) {
    console.log('Not authenticated, redirecting to:', redirectTo);
    localStorage.setItem('redirectAfterLogin', location.pathname + location.search);
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(
      (role) => user?.roles?.includes(role) || user?.role === role
    );

    if (!hasRequiredRole) {
      return <UnauthorizedScreen />;
    }
  }

  // Check permission-based access
  if (requiredPermissions.length > 0) {
    const hasRequiredPermission = requiredPermissions.every((permission) =>
      user?.permissions?.includes(permission)
    );

    if (!hasRequiredPermission) {
      return <UnauthorizedScreen />;
    }
  }

  // Check if email is verified (optional)
  if (user?.requiresEmailVerification && !user?.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // Check if subscription is active for premium features
  const requiresSubscription = requiredPermissions.some(
    (p) => p === 'premium' || p === 'pro' || p === 'enterprise'
  );

  if (requiresSubscription && (!user?.subscription || user.subscription.status !== 'active')) {
    return <Navigate to="/pricing" state={{ from: location, required: 'subscription' }} replace />;
  }

  // All checks passed - render the protected content
  return children ? children : <Outlet />;
};

export default PrivateRoute;
