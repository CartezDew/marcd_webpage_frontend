import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, InputAdornment, IconButton, Link, Card, CardContent, Container, Grid } from '@mui/material';
import { Visibility, VisibilityOff, Lock, Email } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../services/users';
import '../styles/signin.css';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [registerMessage, setRegisterMessage] = useState('');
  const [headerVisible, setHeaderVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setHeaderVisible(true), 100);
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
                  <div className="signin-header">
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
                    type="submit"
                    fullWidth
                    className="signin-btn primary"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </Button>
                  <Button
                    fullWidth
                    className="signin-btn secondary"
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
