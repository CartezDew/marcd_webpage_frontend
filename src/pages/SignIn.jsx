import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Grid, 
  Link, 
  InputAdornment, 
  IconButton 
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../services/users';
import '../styles/signin.css';

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registerMessage, setRegisterMessage] = useState('');
  const [headerVisible, setHeaderVisible] = useState(false);
  const [primaryButtonVisible, setPrimaryButtonVisible] = useState(false);
  const [secondaryButtonVisible, setSecondaryButtonVisible] = useState(false);
  
  const headerRef = useRef(null);
  const primaryButtonRef = useRef(null);
  const secondaryButtonRef = useRef(null);

  // Header animation observer
  useEffect(() => {
    const headerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHeaderVisible(true);
          }
        });
      },
      {
        threshold: 0.05, // Trigger when 5% of the header is visible
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (headerRef.current) {
      headerObserver.observe(headerRef.current);
    }

    return () => {
      if (headerRef.current) {
        headerObserver.unobserve(headerRef.current);
      }
    };
  }, []);

  // Primary button animation observer
  useEffect(() => {
    const primaryButtonObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Start primary button animation immediately when visible
            setPrimaryButtonVisible(true);
          }
        });
      },
      {
        threshold: 0.05, // Trigger when 5% of the button is visible
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (primaryButtonRef.current) {
      primaryButtonObserver.observe(primaryButtonRef.current);
    }

    return () => {
      if (primaryButtonRef.current) {
        primaryButtonObserver.unobserve(primaryButtonRef.current);
      }
    };
  }, []);

  // Secondary button animation observer
  useEffect(() => {
    const secondaryButtonObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Start secondary button animation after primary button animation completes
            setTimeout(() => {
              setSecondaryButtonVisible(true);
            }, 800); // 0.8s delay to match primary button animation duration
          }
        });
      },
      {
        threshold: 0.05, // Trigger when 5% of the button is visible
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (secondaryButtonRef.current) {
      secondaryButtonObserver.observe(secondaryButtonRef.current);
    }

    return () => {
      if (secondaryButtonRef.current) {
        secondaryButtonObserver.unobserve(secondaryButtonRef.current);
      }
    };
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!email || !password) {
        setError('Please enter both email and password.');
        setLoading(false);
        return;
      }
      await signIn({ email, password });
      setLoading(false);
      navigate('/');
    } catch (err) {
      setLoading(false);
      setError(
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        'Invalid email or password.'
      );
    }
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
            setRegisterMessage(`To register, please contact customer service at ${import.meta.env.VITE_CONTACT_EMAIL} for further assistance.`);
  };

  return (
    <Container maxWidth="sm" className="signin-container">
      <form onSubmit={handleSignIn} style={{ width: '100%' }}>
        <Card className="signin-card">
          <CardContent>
            <Box sx={{ px: 1 }}>
              <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item xs={12} sx={{ width: '90%' }}>
                  <div className="signin-header" ref={headerRef}>
                    <Typography
                      variant="h6"
                      className={`signin-title${headerVisible ? ' animate' : ''}`}
                    >
                      Welcome back to Marc'd
                    </Typography>
                  </div>
                  <TextField
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    fullWidth
                    required
                    autoFocus
                    className="signin-input"
                    placeholder="Email"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email className="signin-icon" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    fullWidth
                    required
                    placeholder="Password"
                    className="signin-input"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock className="signin-icon" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <div className="signin-forgot">
                    <Link href="#" underline="hover" className="signin-link">Forgot password?</Link>
                  </div>
                  {error && <div className="signin-error">{error}</div>}
                  <Button
                    ref={primaryButtonRef}
                    type="submit"
                    fullWidth
                    className={`signin-btn primary${primaryButtonVisible ? ' animate' : ''}`}
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </Button>
                  <Button
                    ref={secondaryButtonRef}
                    fullWidth
                    className={`signin-btn secondary${secondaryButtonVisible ? ' animate' : ''}`}
                  >
                    Sign in with one-time code
                  </Button>
                  <div className="signin-footer">
                    <span>Don&apos;t have an account? </span>
                    <Link href="/register" className="signin-link" onClick={handleRegisterClick}>Register</Link>
                  </div>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </form>
      {registerMessage && (
        <div className="register-message">{registerMessage}</div>
      )}
    </Container>
  );
}

export default SignIn;
 