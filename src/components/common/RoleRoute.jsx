import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const RoleRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading, role } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(role)) {
    // Redirect to their appropriate dashboard or home
    if (role === 'pharmacy') return <Navigate to="/pharmacy/dashboard" replace />;
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/user/dashboard" replace />;
  }

  return children;
};
