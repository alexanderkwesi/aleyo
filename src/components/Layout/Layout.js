// src/components/Layout/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../../context/AuthContext';
import VoiceAssistant from '../VoiceAssistant/VoiceAssistant';

const Layout = () => {
  const { user } = useAuth();

  const handleVoiceCommand = (command) => {
    // Handle voice commands across the app
    console.log('Voice command received:', command);
    window.dispatchEvent(new CustomEvent('voice-command', { detail: command }));
  };

  const getContextFromPath = () => {
    const path = window.location.pathname;
    if (path.includes('/studio')) return 'studio';
    if (path.includes('/designs')) return 'gallery';
    if (path.includes('/integrations')) return 'integrations';
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/admin')) return 'admin';
    return 'home';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1, pt: { xs: 7, md: 8 } }}>
        <Outlet />
      </Box>
      <Footer />
      {user && (
        <VoiceAssistant
          onCommand={handleVoiceCommand}
          currentContext={getContextFromPath()}
          userName={user.name}
        />
      )}
    </Box>
  );
};

export default Layout;
