import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../services/adminApi';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin/dashboard');
      return;
    }

    // Redirect to signin page since this component is no longer used
    navigate('/signin');
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // For demo purposes, using a simple check
      // In production, this would be a real API call
      if (email === 'admin@marcd.com' && password === 'admin123') {
        // Store admin token
        localStorage.setItem('adminToken', 'demo-token');
        localStorage.setItem('adminEmail', email);
        
        // Redirect to dashboard
        navigate('/admin/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      className={`admin-login-container ${isVisible ? 'animate' : ''}`}
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.6 }}
        >
          <Paper
            elevation={24}
            sx={{
              p: 4,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: 3,
              backdropFilter: 'blur(10px)',
              color: 'white'
            }}
          >
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <LockIcon sx={{ fontSize: 60, color: '#3b82f6', mb: 2 }} />
              </motion.div>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
                Admin Login
              </Typography>
              <Typography variant="body1" sx={{ color: '#a1a1aa' }}>
                Access the Marc'd Admin Dashboard
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              </motion.div>
            )}

            {/* Login Form */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: '#a1a1aa' }} />
                      </InputAdornment>
                    ),
                    sx: {
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.2)'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(59, 130, 246, 0.5)'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3b82f6'
                      }
                    }
                  }}
                  InputLabelProps={{
                    sx: {
                      color: '#a1a1aa',
                      '&.Mui-focused': {
                        color: '#3b82f6'
                      }
                    }
                  }}
                  sx={{
                    '& .MuiInputBase-input::placeholder': {
                      color: '#a1a1aa',
                      opacity: 1
                    }
                  }}
                />
              </Box>

              <Box sx={{ mb: 4 }}>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#a1a1aa' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                          sx={{ color: '#a1a1aa' }}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.2)'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(59, 130, 246, 0.5)'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3b82f6'
                      }
                    }
                  }}
                  InputLabelProps={{
                    sx: {
                      color: '#a1a1aa',
                      '&.Mui-focused': {
                        color: '#3b82f6'
                      }
                    }
                  }}
                  sx={{
                    '& .MuiInputBase-input::placeholder': {
                      color: '#a1a1aa',
                      opacity: 1
                    }
                  }}
                />
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.5,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  borderRadius: 2,
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
                  },
                  '&:disabled': {
                    background: 'rgba(59, 130, 246, 0.5)',
                    transform: 'none'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  'Sign In'
                )}
              </Button>
            </motion.form>

            {/* Demo Credentials */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Box sx={{ mt: 4, p: 2, background: 'rgba(59, 130, 246, 0.1)', borderRadius: 2, border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <Typography variant="body2" sx={{ color: '#a1a1aa', textAlign: 'center', mb: 1 }}>
                  Demo Credentials:
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', textAlign: 'center', fontFamily: 'monospace' }}>
                  Email: admin@marcd.com
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', textAlign: 'center', fontFamily: 'monospace' }}>
                  Password: admin123
                </Typography>
              </Box>
            </motion.div>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AdminLogin; 