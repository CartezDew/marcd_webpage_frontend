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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Alert
} from '@mui/material';
import { Person, Lock, Visibility, VisibilityOff, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { signIn, requestPasswordReset, confirmPasswordReset } from '../services/users';

import '../styles/signin.css';

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Forgot Password State
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetStep, setResetStep] = useState(0);
  const [resetEmail, setResetEmail] = useState('');
  const [professorLastName, setProfessorLastName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

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
        setError('Please enter both email/username and password.');
        setLoading(false);
        return;
      }

      // Regular user signin
      const userData = await signIn({ username: email, password });
      setLoading(false);
      
      // Check if this is an admin user (staff or superuser)
      if (userData.user && (userData.user.is_staff || userData.user.is_superuser)) {
        // Store admin token and redirect to admin dashboard
        const token = userData.access || userData.token;
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminEmail', email);
        navigate('/admin/dashboard');
      } else {
        // Regular user - redirect to home
        navigate('/');
      }
    } catch (err) {
      setLoading(false);
      setError(
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        'Invalid email/username or password.'
      );
    }
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    // Remove focus from the link to avoid potential focus issues
    if (e && e.target) {
      e.target.blur();
    }
    setRegisterMessage(`To register, please contact customer service at ${import.meta.env.VITE_CONTACT_EMAIL} for further assistance.`);
  };

  // Forgot Password Functions
  const handleForgotPassword = (e) => {
    // Remove focus from the link before opening dialog to avoid aria-hidden focus conflict
    if (e && e.target) {
      e.target.blur();
    }
    setForgotPasswordOpen(true);
    setResetStep(0);
    setResetError('');
    setResetSuccess('');
  };

  const handleCloseForgotPassword = () => {
    setForgotPasswordOpen(false);
    setResetStep(0);
    setResetEmail('');
    setProfessorLastName('');
    setNewPassword('');
    setConfirmNewPassword('');
    setShowNewPassword(false);
    setShowConfirmNewPassword(false);
    setResetError('');
    setResetSuccess('');
  };

  const handleVerifySecurityQuestions = async () => {
    if (!resetEmail || !professorLastName.trim()) {
      setResetError('Please fill in all fields.');
      return;
    }

    // Trim whitespace from professor's last name
    const trimmedProfessorLastName = professorLastName.trim();

    setResetLoading(true);
    setResetError('');

    try {
      await requestPasswordReset({
        username: resetEmail,
        professor_last_name: trimmedProfessorLastName
      });
      
      setResetStep(1);
      setResetSuccess('Security questions verified successfully. Please enter your new password.');
    } catch (err) {
      // Check if it's a 404 or 400 error (endpoint doesn't exist)
      if (err?.response?.status === 404) {
        setResetError(
          'Password reset functionality is not yet available. Please contact support for assistance.'
        );
      } else if (err?.response?.status === 400) {
        // Handle specific backend validation errors
        const errorData = err?.response?.data;

        
        if (errorData?.professor_last_name) {
          setResetError('Professor last name is incorrect. Please check your answer.');
        } else if (errorData?.security_answer) {
          setResetError('Security answer is incorrect. Please check your answer.');
        } else if (errorData?.username || errorData?.email) {
          setResetError('Username/email not found. Please check your entry.');
        } else if (errorData?.detail) {
          setResetError(errorData.detail);
        } else {
          setResetError(
            err?.message || 
            'Failed to verify security questions. Please check your answers.'
          );
        }
      } else {
        setResetError(
          err?.message || 
          'Failed to verify security questions. Please check your answers.'
        );
      }
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmNewPassword) {
      setResetError('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setResetError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setResetError('Password must be at least 8 characters long.');
      return;
    }

    // Additional frontend validation
    if (!/[A-Za-z]/.test(newPassword)) {
      setResetError('Password must contain at least one letter.');
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      setResetError('Password must contain at least one number.');
      return;
    }

    // Check for common passwords
    const commonPasswords = ['password', '123456', 'password123', 'admin', 'test123', 'test1234'];
    if (commonPasswords.some(common => newPassword.toLowerCase().includes(common))) {
      setResetError('This password is too common. Please choose a more unique password.');
      return;
    }

    setResetLoading(true);
    setResetError('');

    try {
      await confirmPasswordReset({
        username: resetEmail,
        professor_last_name: trimmedProfessorLastName,
        new_password: newPassword
      });
      
      setResetSuccess('Password reset successfully! You can now sign in with your new password.');
      setTimeout(() => {
        handleCloseForgotPassword();
      }, 2000);
    } catch (err) {
      // Handle specific backend validation errors
      const errorData = err?.response?.data;
      if (errorData?.new_password) {
        // Backend password validation errors
        if (Array.isArray(errorData.new_password)) {
          setResetError(errorData.new_password.join(' '));
        } else {
          setResetError(errorData.new_password);
        }
      } else if (errorData?.detail) {
        setResetError(errorData.detail);
      } else {
        setResetError(
          err?.message || 
          'Failed to reset password. Please try again.'
        );
      }
    } finally {
      setResetLoading(false);
    }
  };

  const steps = ['Verify Security Questions', 'Reset Password'];

  return (
    <Container maxWidth="sm" className="signin-container">
      <form onSubmit={handleSignIn} style={{ width: '100%' }}>
        <Card className="signin-card">
          <CardContent>
            <Box sx={{ px: 1 }}>
              <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid sx={{ width: '90%' }}>
                  <div className="signin-header" ref={headerRef}>
                    <Typography
                      variant="h6"
                      className={`signin-title${headerVisible ? ' animate' : ''}`}
                    >
                      Welcome back to Marc'd
                    </Typography>
                  </div>
                  <TextField
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    fullWidth
                    required
                    autoFocus
                    className="signin-input"
                    placeholder="Username or Email"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person className="signin-icon" />
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
                    <Link 
                      href="#" 
                      underline="hover" 
                      className="signin-link"
                      onClick={handleForgotPassword}
                    >
                      Forgot password?
                    </Link>
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

      {/* Forgot Password Dialog */}
      <Dialog 
        open={forgotPasswordOpen} 
        onClose={handleCloseForgotPassword}
        maxWidth="sm"
        fullWidth
        className="forgot-password-dialog"
        aria-labelledby="forgot-password-dialog-title"
        disableRestoreFocus={false}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" id="forgot-password-dialog-title">Reset Password</Typography>
            <IconButton onClick={handleCloseForgotPassword}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stepper activeStep={resetStep} sx={{ mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {resetError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {resetError}
            </Alert>
          )}

          {resetSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {resetSuccess}
            </Alert>
          )}

          {resetStep === 0 && (
            <Box>
                        <Typography variant="body2" sx={{ mb: 2 }}>
            Please verify your security questions to reset your password. 
            You need to know Professor Rob's last name to proceed.
          </Typography>
              <TextField
                fullWidth
                label="Username or Email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                sx={{ mb: 2 }}
                autoFocus
              />
              <TextField
                fullWidth
                label="What is Professor Rob's last name?"
                value={professorLastName}
                onChange={(e) => setProfessorLastName(e.target.value)}
                placeholder="Enter Professor Rob's last name"
                helperText="Enter Professor Rob's last name exactly (case-insensitive)"
                sx={{ mb: 2 }}
              />
            </Box>
          )}

          {resetStep === 1 && (
            <Box>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Please enter your new password.
              </Typography>
              <Typography variant="caption" sx={{ mb: 2, display: 'block', color: '#666' }}>
                Password requirements:
                • Minimum 8 characters
                • Must include letters and numbers
                • Cannot be a common password
                • Special characters recommended (!@#$%^&*)
              </Typography>
              <TextField
                fullWidth
                type={showNewPassword ? 'text' : 'password'}
                label="New Password"
                placeholder="e.g. MySecurePass123!"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                type={showConfirmNewPassword ? 'text' : 'password'}
                label="Confirm New Password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)} edge="end">
                        {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForgotPassword}>
            Cancel
          </Button>
          {resetStep === 0 && (
            <Button 
              onClick={handleVerifySecurityQuestions}
              disabled={resetLoading}
              variant="contained"
            >
              {resetLoading ? 'Verifying...' : 'Verify'}
            </Button>
          )}
          {resetStep === 1 && (
            <Button 
              onClick={handleResetPassword}
              disabled={resetLoading}
              variant="contained"
            >
              {resetLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default SignIn;
 