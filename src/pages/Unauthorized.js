// src/pages/Unauthorized.js
import React from 'react';
import { Box, Container, Paper, Typography, Button, alpha } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowBack, Home } from '@mui/icons-material';

const G_START = '#4F6EF7';
const G_MID = '#2DBCB6';
const GRAD = `linear-gradient(135deg, ${G_START} 0%, ${G_MID} 50%, #3ED67C 100%)`;

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: '#080C14',
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
              <Lock sx={{ fontSize: 40, color: '#EF4444' }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                color: 'white',
                fontWeight: 700,
                mb: 1,
                background: GRAD,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Access Denied
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255,255,255,0.6)',
                mb: 3,
              }}
            >
              You don't have permission to access this page. Please contact your administrator if
              you believe this is an error.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                sx={{
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': { borderColor: G_START },
                }}
              >
                Go Back
              </Button>
              <Button
                variant="contained"
                startIcon={<Home />}
                onClick={() => navigate('/dashboard')}
                sx={{
                  background: GRAD,
                  '&:hover': { opacity: 0.9 },
                }}
              >
                Dashboard
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Unauthorized;
