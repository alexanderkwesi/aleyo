// src/components/Auth/RoleBasedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PrivateRoute from './PrivateRoute';

const RoleBasedRoute = ({
  children,
  roles = [],
  permissions = [],
  redirectTo = '/dashboard',
  fallbackRedirect = '/unauthorized',
}) => {
  const { user, hasRole, hasPermission, isAuthenticated } = useAuth();

  // First, ensure user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check roles
  if (roles.length > 0) {
    const hasRequiredRole = roles.some((role) => hasRole(role));
    if (!hasRequiredRole) {
      return <Navigate to={fallbackRedirect} replace />;
    }
  }

  // Check permissions
  if (permissions.length > 0) {
    const hasRequiredPermissions = permissions.every((perm) => hasPermission(perm));
    if (!hasRequiredPermissions) {
      return <Navigate to={fallbackRedirect} replace />;
    }
  }

  return children;
};

export default RoleBasedRoute;
