import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Nav from './components/Nav';
import Home from './pages/Home';
import ContactUs from './pages/ContactUs';
import Survey from './pages/Survey';
import './styles/global.css';
import './styles/components.css';
import OurStory from './pages/OurStory';
import Leadership_Cartez from './pages/Leadership_Cartez';
import Leadership_Beth from './pages/Leadership_Beth';
import Features from './pages/Features';
import SignIn from './pages/SignIn';
import NotFound from './pages/NotFound';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#D32F2F', // Red color for highlights
      dark: '#B71C1C',
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
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  // Remove userLocation and loading state
  return (
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
            <Route path="*" element={<NotFound />} /> {/* fallback */}
          </Routes>
        </main>
      </ThemeProvider>
    </div>
  );
}

export default App;
