// src/services/auth.js
import axios from 'axios';

// Safe environment variable access for browser
const getEnvVar = (name, defaultValue) => {
  // Check if we're in a Node.js environment
  if (typeof process !== 'undefined' && process.env) {
    return process.env[name] || defaultValue;
  }
  // Check for Vite environment variables
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[name] || import.meta.env[`VITE_${name}`] || defaultValue;
  }
  return defaultValue;
};

// Configuration with fallback defaults
const USE_MOCK = getEnvVar('REACT_APP_USE_MOCK', 'true') === 'true';
const API_URL = getEnvVar('REACT_APP_API_URL', 'http://localhost:5000');

// Mock user storage for development
let mockUsers = [
  {
    id: 'user_1',
    email: 'demo@aleyo.com',
    password: 'password123',
    name: 'Demo User',
    credits: 50,
    createdAt: new Date().toISOString(),
  },
];

class AuthService {
  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 10000,
    });
  }

  async login(email, password) {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const user = mockUsers.find((u) => u.email === email && u.password === password);
          if (user) {
            const { password: _, ...userWithoutPassword } = user;
            const token = `mock_token_${Date.now()}`;
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(userWithoutPassword));
            resolve({
              token,
              user: userWithoutPassword,
            });
          } else {
            reject(new Error('Invalid email or password'));
          }
        }, 800);
      });
    }

    try {
      const response = await this.client.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async signup(userData) {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const existingUser = mockUsers.find((u) => u.email === userData.email);
          if (existingUser) {
            reject(new Error('Email already registered'));
            return;
          }

          const newUser = {
            id: `user_${Date.now()}`,
            email: userData.email,
            name: userData.name,
            credits: 50,
            createdAt: new Date().toISOString(),
            password: userData.password,
          };
          mockUsers.push(newUser);

          const { password: _, ...userWithoutPassword } = newUser;
          const token = `mock_token_${Date.now()}`;

          localStorage.setItem('authToken', token);
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));

          resolve({
            token,
            user: userWithoutPassword,
          });
        }, 800);
      });
    }

    try {
      const response = await this.client.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  }

  async getCurrentUser() {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            resolve(JSON.parse(storedUser));
          } else {
            resolve(null);
          }
        }, 300);
      });
    }

    try {
      const response = await this.client.get('/auth/me');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get user');
    }
  }

  async forgotPassword(email) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(`Password reset email sent to ${email}`);
          resolve({ success: true, message: 'Reset email sent' });
        }, 1000);
      });
    }

    try {
      const response = await this.client.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send reset email');
    }
  }

  async resetPassword(token, newPassword) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, message: 'Password reset successful' });
        }, 1000);
      });
    }

    try {
      const response = await this.client.post('/auth/reset-password', { token, newPassword });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to reset password');
    }
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }

  getToken() {
    return localStorage.getItem('authToken');
  }

  setAuthHeader(token) {
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }
}

export const authService = new AuthService();
