import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography } from '@mui/material';
import Nav from './components/Nav';
import Home from './pages/Home';
import ContactUs from './pages/ContactUs';
import Survey from './pages/Survey';
import './styles/global.css';
import './styles/components.css';
import './styles/admin.css';
import OurStory from './pages/OurStory';
import Leadership_Cartez from './pages/Leadership_Cartez';
import Leadership_Beth from './pages/Leadership_Beth';
import Features from './pages/Features';
import SignIn from './pages/SignIn';

import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { WaitlistProvider } from './context/WaitlistContext';
import Footer from './components/Footer';
// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF9800', // Orange color for highlights
      dark: '#F57C00',
    },
    secondary: {
      main: '#2c3e50',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    h3: {
      fontWeight: 300,
    },
    h4: {
      fontWeight: 400,
    },
    h5: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: 'transparent',
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: 'transparent',
          backgroundImage: 'none',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          '& .MuiTabs-indicator': {
            backgroundColor: '#3b82f6 !important',
            height: '3px !important',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#a1a1aa !important',
          fontWeight: '600 !important',
          textTransform: 'none !important',
          minHeight: '48px !important',
          padding: '0.75rem 1.5rem !important',
          '&.Mui-selected': {
            color: '#3b82f6 !important',
            backgroundColor: 'transparent !important',
          },
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05) !important',
          },
        },
      },
    },
  },
});

// Simple NotFound component
const NotFound = () => {
  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h3" color="error">
        404 - Page Not Found
      </Typography>
      <Typography variant="subtitle1" mt={2}>
        The page you're looking for doesn't exist.
      </Typography>
    </Box>
  );
};

function App() {
  // Remove userLocation and loading state
  return (
    <WaitlistProvider>
      <div className="App">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Nav />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/contactus" element={<ContactUs />} />
              <Route path="/survey" element={<Survey />} />
              <Route path="/our-story" element={<OurStory />} />
              <Route path="/leadership/cartez" element={<Leadership_Cartez />} />
              <Route path="/leadership/beth" element={<Leadership_Beth />} />
              <Route path="/features" element={<Features />} />
              <Route path="/signin" element={<SignIn />} />

              <Route path="/admin/dashboard" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} /> {/* fallback */}
            </Routes>
          </main>
          <Footer />
        </ThemeProvider>
      </div>
    </WaitlistProvider>
  );
}

export default App;
