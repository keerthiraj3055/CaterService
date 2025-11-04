import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { token, user } = useContext(AuthContext);
  
  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // If roles are specified, check if user has required role
  if (roles.length > 0 && !roles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on user role
    switch (user?.role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'employee':
        return <Navigate to="/employee" replace />;
      case 'corporate':
        return <Navigate to="/corporate" replace />;
      case 'user':
        return <Navigate to="/user/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }
  
  return children;
};

export default ProtectedRoute;
