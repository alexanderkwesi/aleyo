// src/App.js (Updated with Layout)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import PrivateRoute from './components/Auth/PrivateRoute';
import Layout from './components/Layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import Designs from './pages/Designs';
import DesignStudio from './pages/DesignStudio';
import Pricing from './pages/Pricing';
import Integrations from './pages/Integrations';
import Tutorials from './pages/Tutorials';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccess from './components/Payment/PaymentSuccess';
import PaymentCancel from './components/Payment/PaymentCancel';
import AdminPanel from './pages/Admin/AdminPanel';
import Unauthorized from './pages/Unauthorized';
import Notifications from './pages/Notifications';
import VoiceAssistantPage from './pages/VoiceAssistantPage';
import PreviewPage from './pages/PreviewPage';
import Saved_Pages from './pages/Saved_Pages';
import DocumentationPage from './pages/Documentation_Page';
import ApiReference from './pages/API_Reference';
import Support_Page from './pages/Support';
import SettingsPage from './pages/SettingsPage';
import PrivacyPolicy from './pages/Policy';
import Cookies from './pages/Cookies';
import Terms from './pages/Terms'; 


const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#4F6EF7' },
    secondary: { main: '#2DBCB6' },
    background: { default: '#080C14', paper: '#0F172A' },
  },
  typography: {
    fontFamily: '"Inter", "DM Sans", sans-serif',
  },
  shape: { borderRadius: 12 },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <AppProvider>
            <Routes>
              {/* Public Routes without Layout */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Protected Routes with Layout */}
              <Route element={<PrivateRoute />}>
                <Route path="/api-reference" element={<ApiReference />} />
                <Route path="/docs" element={<DocumentationPage />} />
                <Route path="/saved-projects" element={<Saved_Pages />} />
                <Route path="/support" element={<Support_Page />} />
                <Route path="/preview" element={<PreviewPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="/terms" element={<Terms />} />
                <Route element={<Layout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/designs" element={<Designs />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/studio" element={<DesignStudio />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/studio/:projectId" element={<DesignStudio />} />
                  <Route path="/integrations" element={<Integrations />} />
                  <Route path="/voice-assistant" element={<VoiceAssistantPage />} />
                  <Route path="/tutorials" element={<Tutorials />} />
                  <Route path="/payment" element={<PaymentPage />} />
                  <Route path="/payment/success" element={<PaymentSuccess />} />
                  <Route path="/payment/cancel" element={<PaymentCancel />} />
                  <Route path="/admin" element={<AdminPanel />} />
                </Route>
              </Route>

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
