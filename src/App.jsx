import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { WaitlistProvider } from './context/WaitlistContext';
import Nav from './components/Nav';
import Footer from './components/Footer';
import AppLoading from './components/AppLoading';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';

// Lazy load components for code splitting
const Home = React.lazy(() => import('./pages/Home'));
const Features = React.lazy(() => import('./pages/Features'));
const OurStory = React.lazy(() => import('./pages/OurStory'));
const ContactUs = React.lazy(() => import('./pages/ContactUs'));
const Survey = React.lazy(() => import('./pages/Survey'));
const Register = React.lazy(() => import('./pages/Register'));
const SignIn = React.lazy(() => import('./pages/SignIn'));
const SignOut = React.lazy(() => import('./pages/SignOut'));
const LeadershipCartez = React.lazy(() => import('./pages/Leadership_Cartez'));
const LeadershipBeth = React.lazy(() => import('./pages/Leadership_Beth'));
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));

// Create theme with optimized settings
const theme = createTheme({
  palette: {
    primary: {
      main: '#be0303',
      dark: '#9a0202',
    },
  },
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#be0303 !important',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
  },
});

// Loading fallback component
const PageLoader = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '50vh' 
  }}>
    <AppLoading />
  </div>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <WaitlistProvider>
        <Router>
          <div className="App">
            <Nav />
            <main>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/our-story" element={<OurStory />} />
                  <Route path="/contactus" element={<ContactUs />} />
                  <Route path="/survey" element={<Survey />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signout" element={<SignOut />} />
                  <Route path="/leadership/cartez" element={<LeadershipCartez />} />
                  <Route path="/leadership/beth" element={<LeadershipBeth />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route 
                    path="/admin/dashboard" 
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </Router>
      </WaitlistProvider>
    </ThemeProvider>
  );
}

export default App;
