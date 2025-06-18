import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTruck, FaCloudSun, FaParking, FaStar, FaMapMarkedAlt, FaThermometerHalf, FaWind } from 'react-icons/fa';
import WeatherWidget from '../components/WeatherWidget';
import MapView from '../components/MapView';

function Home({ userLocation }) {
  const [nearbyStops, setNearbyStops] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userLocation) {
      fetchNearbyStops();
    }
  }, [userLocation]);

  const fetchNearbyStops = async () => {
    if (!userLocation) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/truck-stops/nearby/?lat=${userLocation.lat}&lng=${userLocation.lng}&unit=miles`
      );
      const data = await response.json();
      setNearbyStops(data.slice(0, 5)); // Show only first 5 nearby stops
    } catch (error) {
      console.error('Error fetching nearby stops:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <FaMapMarkedAlt />,
      title: "GPS Truck Stop Finder",
      description: "Find truck stops near your location in real time with precise GPS coordinates."
    },
    {
      icon: <FaCloudSun />,
      title: "Weather Updates",
      description: "Get real-time weather conditions for your current location and destination."
    },
    {
      icon: <FaParking />,
      title: "Parking Availability",
      description: "See real-time parking availability reported by other drivers."
    },
    {
      icon: <FaStar />,
      title: "Driver Reviews",
      description: "Read and write reviews about cleanliness, food quality, and safety."
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero-section text-center mb-3">
        <h1>Welcome to Marc'd Trucking</h1>
        <p className="hero-subtitle">
          Your trusted companion on the road. Find truck stops, check weather, and share experiences with fellow drivers.
        </p>
        
        {userLocation && (
          <div className="location-info card">
            <h3>Your Current Location</h3>
            <p>Latitude: {userLocation.lat.toFixed(4)}</p>
            <p>Longitude: {userLocation.lng.toFixed(4)}</p>
          </div>
        )}
      </div>

      {/* Features Grid */}
      <div className="features-section mb-3">
        <h2 className="text-center mb-2">App Features</h2>
        <div className="grid grid-3">
          {features.map((feature, index) => (
            <div key={index} className="card text-center">
              <div className="feature-icon mb-1">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions mb-3">
        <h2 className="text-center mb-2">Quick Actions</h2>
        <div className="flex flex-center gap-2">
          <Link to="/truck-stops" className="btn btn-primary">
            <FaTruck style={{ marginRight: '0.5rem' }} />
            Find Truck Stops
          </Link>
          <Link to="/feedback" className="btn btn-secondary">
            <FaComments style={{ marginRight: '0.5rem' }} />
            Send Feedback
          </Link>
        </div>
      </div>

      {/* Nearby Truck Stops */}
      {userLocation && (
        <div className="nearby-stops mb-3">
          <h2 className="text-center mb-2">Nearby Truck Stops</h2>
          {loading ? (
            <div className="text-center">
              <div className="loading-spinner"></div>
              <p>Finding nearby truck stops...</p>
            </div>
          ) : (
            <div className="grid grid-2">
              {nearbyStops.map((stop) => (
                <div key={stop.id} className="card truck-stop-card">
                  <div className="truck-stop-info">
                    <h3>{stop.name}</h3>
                    <p>{stop.address}</p>
                    <div className="truck-stop-amenities">
                      {stop.has_showers && <span className="amenity-badge">Showers</span>}
                      {stop.has_restaurant && <span className="amenity-badge">Restaurant</span>}
                      {stop.has_repair_shop && <span className="amenity-badge">Repair Shop</span>}
                      {stop.has_fuel && <span className="amenity-badge">Fuel</span>}
                    </div>
                    <div className="truck-stop-ratings">
                      <div className="rating-item">
                        <span>Cleanliness:</span>
                        <span className="rating-stars">{'★'.repeat(Math.round(stop.cleanliness_rating))}</span>
                      </div>
                      <div className="rating-item">
                        <span>Food:</span>
                        <span className="rating-stars">{'★'.repeat(Math.round(stop.food_rating))}</span>
                      </div>
                    </div>
                  </div>
                  <div className="truck-stop-status">
                    <div className={`parking-status ${
                      stop.available_spaces === 0 ? 'parking-full' :
                      stop.available_spaces < stop.parking_spaces / 2 ? 'parking-limited' :
                      'parking-available'
                    }`}>
                      {stop.available_spaces === 0 ? 'Full' :
                       stop.available_spaces < stop.parking_spaces / 2 ? 'Limited' :
                       'Available'}
                    </div>
                    <p className="text-center mt-1">
                      {stop.available_spaces}/{stop.parking_spaces} spaces
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {nearbyStops.length > 0 && (
            <div className="text-center mt-2">
              <Link to="/truck-stops" className="btn btn-primary">
                View All Truck Stops
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Weather Widget */}
      {userLocation && (
        <div className="weather-section mb-3">
          <h2 className="text-center mb-2">Current Weather</h2>
          <WeatherWidget lat={userLocation.lat} lng={userLocation.lng} />
        </div>
      )}

      {/* Map View */}
      {userLocation && (
        <div className="map-section">
          <h2 className="text-center mb-2">Map View</h2>
          <MapView 
            userLocation={userLocation}
            truckStops={nearbyStops}
          />
        </div>
      )}
    </div>
  );
}

export default Home;
