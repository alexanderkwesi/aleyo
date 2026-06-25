// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authService } from '../services/auth';
import { apiService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
  const [sessionExpiry, setSessionExpiry] = useState(null);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          // Verify token with backend
          const userData = await authService.getCurrentUser();
          setUser(userData);

          // Set session expiry (e.g., 24 hours from now)
          const expiryTime = new Date();
          expiryTime.setHours(expiryTime.getHours() + 24);
          setSessionExpiry(expiryTime);

          // Set up auto logout timer
          setupAutoLogout(expiryTime);
        } catch (error) {
          console.error('Auth initialization error:', error);
          if (error.response?.status === 401) {
            // Token expired, try to refresh
            await refreshAccessToken();
          } else {
            logout();
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  // Auto logout on session expiry
  const setupAutoLogout = (expiryTime) => {
    const now = new Date();
    const timeUntilExpiry = expiryTime - now;

    if (timeUntilExpiry > 0) {
      setTimeout(() => {
        logout();
        window.dispatchEvent(new CustomEvent('session-expired'));
      }, timeUntilExpiry);
    }
  };

  // Refresh token functionality
  const refreshAccessToken = async () => {
    try {
      const response = await authService.refreshToken(refreshToken);
      setToken(response.token);
      localStorage.setItem('authToken', response.token);
      if (response.refreshToken) {
        setRefreshToken(response.refreshToken);
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      return response.token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return null;
    }
  };

  // Login function
  const login = async (email, password, rememberMe = false) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);

      setToken(response.token);
      setUser(response.user);

      localStorage.setItem('authToken', response.token);
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      if (response.refreshToken) {
        setRefreshToken(response.refreshToken);
        localStorage.setItem('refreshToken', response.refreshToken);
      }

      // Set session expiry
      const expiryTime = new Date();
      expiryTime.setHours(expiryTime.getHours() + (rememberMe ? 720 : 24)); // 30 days or 24 hours
      setSessionExpiry(expiryTime);
      setupAutoLogout(expiryTime);

      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (userData) => {
    setLoading(true);
    try {
      const response = await authService.signup(userData);

      setToken(response.token);
      setUser(response.user);

      localStorage.setItem('authToken', response.token);
      if (response.refreshToken) {
        setRefreshToken(response.refreshToken);
        localStorage.setItem('refreshToken', response.refreshToken);
      }

      // Set session expiry
      const expiryTime = new Date();
      expiryTime.setHours(expiryTime.getHours() + 24);
      setSessionExpiry(expiryTime);
      setupAutoLogout(expiryTime);

      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      setRefreshToken(null);
      setSessionExpiry(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('redirectAfterLogin');
    }
  };

  // Check if user has specific role
  const hasRole = useCallback(
    (role) => {
      if (!user) return false;
      return user.roles?.includes(role) || user.role === role;
    },
    [user]
  );

  // Check if user has specific permission
  const hasPermission = useCallback(
    (permission) => {
      if (!user) return false;
      return user.permissions?.includes(permission);
    },
    [user]
  );

  // Check if user has any of the required roles
  const hasAnyRole = useCallback(
    (roles) => {
      if (!user) return false;
      return roles.some((role) => user.roles?.includes(role) || user.role === role);
    },
    [user]
  );

  // Check if user has all required permissions
  const hasAllPermissions = useCallback(
    (permissions) => {
      if (!user) return false;
      return permissions.every((permission) => user.permissions?.includes(permission));
    },
    [user]
  );

  // Update user data
  const updateUser = useCallback(
    async (updates) => {
      try {
        const updatedUser = await apiService.updateUser(user.id, updates);
        setUser(updatedUser);
        return updatedUser;
      } catch (error) {
        throw error;
      }
    },
    [user]
  );

  const value = {
    user,
    token,
    refreshToken,
    loading,
    sessionExpiry,
    isAuthenticated: !!user && !!token,
    login,
    signup,
    logout,
    refreshAccessToken,
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAllPermissions,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
