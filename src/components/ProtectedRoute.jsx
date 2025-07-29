import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const adminToken = localStorage.getItem('adminToken');
      const token = localStorage.getItem('token');
      
      if (!adminToken && !token) {
        setIsAuthenticated(false);
        setIsChecking(false);
        return;
      }
      
      // Check if token is expired
      const tokenToCheck = adminToken || token;
      if (tokenToCheck) {
        try {
          // Check if token is JWT format (has 3 parts separated by dots)
          if (tokenToCheck.includes('.') && tokenToCheck.split('.').length === 3) {
            // Decode JWT token to check expiration
            const payload = JSON.parse(atob(tokenToCheck.split('.')[1]));
            const currentTime = Date.now() / 1000;
            
            if (payload.exp && payload.exp < currentTime) {
              // Token expired, clear and redirect
              localStorage.removeItem('adminToken');
              localStorage.removeItem('token');
              localStorage.removeItem('adminEmail');
              setIsAuthenticated(false);
              setIsChecking(false);
              return;
            }
          }
          // For simple tokens (like Django's token auth), assume they're valid
          
          // Token is valid
          setIsAuthenticated(true);
        } catch (error) {
          // Invalid token, clear and redirect
          localStorage.removeItem('adminToken');
          localStorage.removeItem('token');
          localStorage.removeItem('adminEmail');
          setIsAuthenticated(false);
        }
      }
      
      setIsChecking(false);
    };

    checkAuth();
  }, []);

  if (isChecking) {
    return (
      <Box 
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}
      >
        <CircularProgress size={60} sx={{ color: '#3b82f6', mb: 2 }} />
        <Typography variant="h6" sx={{ color: 'white' }}>
          Verifying authentication...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute; 