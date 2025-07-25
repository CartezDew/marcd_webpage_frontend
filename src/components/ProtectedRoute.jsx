import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('adminToken');
    return !!token;
  };

  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute; 