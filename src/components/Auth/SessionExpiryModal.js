// src/components/Auth/SessionExpiryModal.js
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  LinearProgress,
  Box,
  alpha,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const G_START = '#4F6EF7';
const GRAD = `linear-gradient(135deg, #4F6EF7 0%, #2DBCB6 50%, #3ED67C 100%)`;

const SessionExpiryModal = () => {
  const { sessionExpiry, refreshAccessToken, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [extending, setExtending] = useState(false);

  useEffect(() => {
    if (!sessionExpiry) return;

    const checkSession = () => {
      const now = new Date();
      const timeRemaining = sessionExpiry - now;
      const minutesRemaining = Math.floor(timeRemaining / 60000);

      // Show warning when 5 minutes remaining
      if (timeRemaining <= 300000 && timeRemaining > 0 && !open) {
        setOpen(true);
        setTimeLeft(minutesRemaining);
      }

      // Auto logout when session expires
      if (timeRemaining <= 0) {
        logout();
        setOpen(false);
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 10000);
    return () => clearInterval(interval);
  }, [sessionExpiry, open, logout]);

  useEffect(() => {
    if (open && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 60000);
      return () => clearInterval(timer);
    }
  }, [open, timeLeft]);

  const handleExtendSession = async () => {
    setExtending(true);
    try {
      await refreshAccessToken();
      setOpen(false);
    } catch (error) {
      console.error('Failed to extend session:', error);
    } finally {
      setExtending(false);
    }
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  const progress = (timeLeft / 5) * 100;

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={() => {}}
          disableEscapeKeyDown
          PaperProps={{
            sx: {
              background: '#0D1220',
              border: `1px solid ${alpha(G_START, 0.3)}`,
              borderRadius: '20px',
              maxWidth: 400,
            },
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <DialogTitle sx={{ color: 'white', textAlign: 'center' }}>
              Session Expiring Soon
            </DialogTitle>
            <DialogContent>
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  textAlign: 'center',
                  mb: 2,
                }}
              >
                Your session will expire in{' '}
                <span style={{ color: G_START, fontWeight: 'bold' }}>
                  {timeLeft} minute{timeLeft !== 1 ? 's' : ''}
                </span>
                .
              </Typography>
              <Box sx={{ mb: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: GRAD,
                    },
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.5)',
                  textAlign: 'center',
                }}
              >
                Would you like to extend your session?
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
              <Button
                onClick={handleLogout}
                sx={{
                  color: 'rgba(255,255,255,0.6)',
                  '&:hover': { color: '#EF4444' },
                }}
              >
                Logout
              </Button>
              <Button
                variant="contained"
                onClick={handleExtendSession}
                disabled={extending}
                sx={{
                  background: GRAD,
                  '&:hover': { opacity: 0.9 },
                }}
              >
                {extending ? 'Extending...' : 'Extend Session'}
              </Button>
            </DialogActions>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default SessionExpiryModal;
