// src/components/Layout/ProtectedLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';
import VoiceAssistant from '../VoiceAssistant/VoiceAssistant';
import { useAuth } from '../../context/AuthContext';

const ProtectedLayout = () => {
  const { user } = useAuth();

  const handleVoiceCommand = (command) => {
    // Handle voice commands across the app
    console.log('Voice command received:', command);
    // You can dispatch events or use context to handle commands
    window.dispatchEvent(new CustomEvent('voice-command', { detail: command }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1, pt: { xs: 7, md: 8 } }}>
        <Outlet />
      </Box>
      <Footer />
      <VoiceAssistant
        onCommand={handleVoiceCommand}
        currentContext={getContextFromPath()}
        userName={user?.name}
      />
    </Box>
  );
};

const getContextFromPath = () => {
  const path = window.location.pathname;
  if (path.includes('/studio')) return 'studio';
  if (path.includes('/designs')) return 'gallery';
  if (path.includes('/integrations')) return 'integrations';
  if (path.includes('/dashboard')) return 'dashboard';
  return 'home';
};

export default ProtectedLayout;
