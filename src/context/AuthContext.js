// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');

    console.log('AuthContext init - storedToken:', storedToken ? 'exists' : 'null');
    console.log('AuthContext init - userData:', userData ? 'exists' : 'null');

    if (storedToken && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setToken(storedToken);
        setUser(parsedUser);
        console.log('User restored from localStorage:', parsedUser);
      } catch (e) {
        console.error('Error parsing user data:', e);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken, userData) => {
    console.log('=== LOGIN CALLED ===');
    console.log('Token:', newToken);
    console.log('UserData:', userData);

    localStorage.setItem('authToken', newToken);
    localStorage.setItem('user', JSON.stringify(userData));

    setToken(newToken);
    setUser(userData);

    console.log('State updated - token set, user set');
    console.log('localStorage authToken:', localStorage.getItem('authToken'));
    console.log('localStorage user:', localStorage.getItem('user'));
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = () => {
    const hasToken = !!localStorage.getItem('authToken');
    const hasUser = !!user;
    return hasToken && hasUser;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
        isAuthenticated: isAuthenticated(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
