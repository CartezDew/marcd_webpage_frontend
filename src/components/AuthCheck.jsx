import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AuthCheck = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const adminToken = localStorage.getItem('adminToken');
      const token = localStorage.getItem('token');
      
      if (!adminToken && !token) {
        // No tokens found, redirect to login
        navigate('/signin');
        return;
      }
      
      // Check if token is expired (simple check - you might want to validate with backend)
      const tokenToCheck = adminToken || token;
      if (tokenToCheck) {
        try {
          // Decode JWT token to check expiration
          const payload = JSON.parse(atob(tokenToCheck.split('.')[1]));
          const currentTime = Date.now() / 1000;
          
          if (payload.exp && payload.exp < currentTime) {
            // Token expired, clear and redirect
            localStorage.removeItem('adminToken');
            localStorage.removeItem('token');
            localStorage.removeItem('adminEmail');
            navigate('/signin');
            return;
          }
          
          // Token is valid
          setIsAuthenticated(true);
        } catch (error) {
          // Invalid token, clear and redirect
          localStorage.removeItem('adminToken');
          localStorage.removeItem('token');
          localStorage.removeItem('adminEmail');
          navigate('/signin');
          return;
        }
      }
      
      setIsChecking(false);
    };

    checkAuth();
  }, [navigate]);

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

  return isAuthenticated ? children : null;
};

export default AuthCheck; 