import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Nav from './components/Nav';
import Home from './pages/Home';
import TruckStops from './pages/TruckStops';
import TruckStopDetail from './pages/TruckStopDetail';
import Feedback from './pages/Feedback';
import Survey from './pages/Survey';
import './App.css';

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
      <Nav />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home userLocation={userLocation} />} />
          <Route path="/truck-stops" element={<TruckStops userLocation={userLocation} />} />
          <Route path="/truck-stops/:id" element={<TruckStopDetail />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/survey" element={<Survey />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
