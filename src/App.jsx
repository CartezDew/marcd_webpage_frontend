import { Routes, Route } from 'react-router-dom';
import { useState, useEffect, Suspense, lazy } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography, CircularProgress } from '@mui/material';
import Nav from './components/Nav';
import Footer from './components/Footer';
import { WaitlistProvider } from './context/WaitlistContext';
import ProtectedRoute from './components/ProtectedRoute';

// Critical CSS imports
import './styles/global.css';
import './styles/components.css';

// Lazy load non-critical pages for faster initial bundle
const Home = lazy(() => import('./pages/Home'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const Survey = lazy(() => import('./pages/Survey'));
const OurStory = lazy(() => import('./pages/OurStory'));
const Leadership_Cartez = lazy(() => import('./pages/Leadership_Cartez'));
const Leadership_Beth = lazy(() => import('./pages/Leadership_Beth'));
const Features = lazy(() => import('./pages/Features'));
const SignIn = lazy(() => import('./pages/SignIn'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Lazy load admin CSS only when needed
const loadAdminCSS = () => import('./styles/admin.css');
// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#be0303', // Red color for highlights
      dark: '#9a0202',
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
          // backgroundColor: 'rgba(10, 9, 9, 0.6)',
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: 'none',
          backgroundImage: 'none',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#be0303 !important',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          '& .MuiTabs-indicator': {
            backgroundColor: '#be0303 !important',
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
            color: '#be0303 !important',
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

// Fast loading component
const PageLoader = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
    <CircularProgress size={40} />
  </Box>
);

function App() {
  // Load admin CSS when admin route is accessed
  useEffect(() => {
    if (window.location.pathname.includes('/admin')) {
      loadAdminCSS();
    }
  }, []);

  return (
    <WaitlistProvider>
      <div className="App">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Nav />
          <main className="main-content">
            <Suspense fallback={<PageLoader />}>
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
            </Suspense>
          </main>
          <Footer />
        </ThemeProvider>
      </div>
    </WaitlistProvider>
  );
}

export default App;
