// src/services/auth.js
import { apiService, api } from './api';

const authService = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await apiService.post('/api/auth/login', { email, password });

      // Store tokens
      if (response.access_token) {
        localStorage.setItem('authToken', response.access_token);
      }

      return {
        token: response.access_token,
        user: response.user,
        refreshToken: response.refresh_token || null,
      };
    } catch (error) {
      throw error;
    }
  },

  // Register user
  signup: async (userData) => {
    try {
      const response = await apiService.post('/api/auth/signup', userData);

      if (response.access_token) {
        localStorage.setItem('authToken', response.access_token);
      }

      return {
        token: response.access_token,
        user: response.user,
        refreshToken: response.refresh_token || null,
      };
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await apiService.post('/api/auth/logout', { refresh_token: refreshToken });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('rememberMe');
    }
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    try {
      const response = await apiService.post('/api/auth/refresh', {
        refresh_token: refreshToken,
      });

      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }

      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }

      return {
        token: response.token,
        refreshToken: response.refreshToken || null,
      };
    } catch (error) {
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const userData = await apiService.get('/api/auth/me');
      return userData;
    } catch (error) {
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    return !!token;
  },

  // Get user from local storage (without API call)
  getUserFromStorage: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user from storage:', error);
      return null;
    }
  },

  // Update password
  updatePassword: async (currentPassword, newPassword) => {
    try {
      const response = await apiService.post('/api/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    try {
      const response = await apiService.post('/api/auth/forgot-password', { email });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    try {
      const response = await apiService.post('/api/auth/reset-password', {
        token,
        new_password: newPassword,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Verify email
  verifyEmail: async (token) => {
    try {
      const response = await apiService.post('/api/auth/verify-email', { token });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Resend verification email
  resendVerification: async (email) => {
    try {
      const response = await apiService.post('/api/auth/resend-verification', { email });
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export { authService };
