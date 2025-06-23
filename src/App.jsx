import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Nav from './components/Nav';
import Home from './pages/Home';
import TruckStops from './pages/TruckStops';
import TruckStopDetail from './pages/TruckStopDetail';
import ContactUs from './pages/ContactUs';
import Survey from './pages/Survey';
import './styles/global.css';
import './styles/components.css';

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
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Getting your location...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Nav />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home userLocation={userLocation} />} />
            <Route path="/truck-stops" element={<TruckStops userLocation={userLocation} />} />
            <Route path="/truck-stops/:id" element={<TruckStopDetail />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/survey" element={<Survey />} />
          </Routes>
        </main>
      </ThemeProvider>
    </div>
  );
}

export default App;
