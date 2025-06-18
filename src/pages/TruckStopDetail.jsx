import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaParking, FaShower, FaUtensils, FaTools, FaGasPump, FaMapMarkedAlt, FaThermometerHalf, FaWind, FaCloudRain } from 'react-icons/fa';
import { truckStopsAPI } from '../services/truckStops';
import { reviewsAPI } from '../services/reviews';
import { weatherAPI } from '../services/weather';
import FeedbackForm from '../components/FeedbackForm';
import WeatherWidget from '../components/WeatherWidget';

function TruckStopDetail() {
  const { id } = useParams();
  const [truckStop, setTruckStop] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchTruckStopDetails();
  }, [id]);

  const fetchTruckStopDetails = async () => {
    try {
      // Fetch truck stop details
      const stopResponse = await truckStopsAPI.getById(id);
      setTruckStop(stopResponse.data);

      // Fetch reviews for this truck stop
      const reviewsResponse = await reviewsAPI.getAll();
      const stopReviews = reviewsResponse.data.filter(review => review.truck_stop === parseInt(id));
      setReviews(stopReviews);

      // Fetch weather data for this truck stop
      try {
        const weatherResponse = await weatherAPI.getByTruckStop(id);
        if (weatherResponse.data.length > 0) {
          setWeather(weatherResponse.data[0]); // Get most recent weather
        }
      } catch (error) {
        console.log('No weather data available for this location');
      }

    } catch (error) {
      console.error('Error fetching truck stop details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      await reviewsAPI.create({
        ...reviewData,
        truck_stop: parseInt(id)
      });
      setShowReviewForm(false);
      fetchTruckStopDetails(); // Refresh data
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const getParkingStatusClass = () => {
    if (!truckStop) return '';
    if (truckStop.available_spaces === 0) return 'parking-full';
    if (truckStop.available_spaces < truckStop.parking_spaces / 2) return 'parking-limited';
    return 'parking-available';
  };

  const getParkingStatusText = () => {
    if (!truckStop) return '';
    if (truckStop.available_spaces === 0) return 'Full';
    if (truckStop.available_spaces < truckStop.parking_spaces / 2) return 'Limited';
    return 'Available';
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="loading-spinner"></div>
        <p>Loading truck stop details...</p>
      </div>
    );
  }

  if (!truckStop) {
    return (
      <div className="text-center">
        <h2>Truck Stop Not Found</h2>
        <Link to="/truck-stops" className="btn btn-primary">
          Back to Truck Stops
        </Link>
      </div>
    );
  }

  return (
    <div className="truck-stop-detail">
      <div className="page-header mb-3">
        <Link to="/truck-stops" className="btn btn-secondary mb-2">
          ← Back to Truck Stops
        </Link>
        <h1>{truckStop.name}</h1>
        <p className="address">{truckStop.address}</p>
      </div>

      <div className="grid grid-2 gap-3">
        {/* Main Information */}
        <div className="main-info">
          <div className="card mb-3">
            <h2>Truck Stop Information</h2>
            
            <div className="amenities-section mb-2">
              <h3>Amenities</h3>
              <div className="amenities-grid">
                {truckStop.has_showers && (
                  <div className="amenity-item">
                    <FaShower />
                    <span>Showers</span>
                  </div>
                )}
                {truckStop.has_restaurant && (
                  <div className="amenity-item">
                    <FaUtensils />
                    <span>Restaurant</span>
                  </div>
                )}
                {truckStop.has_repair_shop && (
                  <div className="amenity-item">
                    <FaTools />
                    <span>Repair Shop</span>
                  </div>
                )}
                {truckStop.has_fuel && (
                  <div className="amenity-item">
                    <FaGasPump />
                    <span>Fuel</span>
                  </div>
                )}
              </div>
            </div>

            <div className="parking-section mb-2">
              <h3>Parking</h3>
              <div className={`parking-status ${getParkingStatusClass()}`}>
                {getParkingStatusText()}
              </div>
              <p>{truckStop.available_spaces} of {truckStop.parking_spaces} spaces available</p>
              <p className="text-muted">Last updated: {new Date(truckStop.last_updated).toLocaleString()}</p>
            </div>

            <div className="ratings-section">
              <h3>Average Ratings</h3>
              <div className="ratings-grid">
                <div className="rating-item">
                  <span>Cleanliness:</span>
                  <span className="rating-stars">
                    {'★'.repeat(Math.round(truckStop.cleanliness_rating))}
                    {'☆'.repeat(5 - Math.round(truckStop.cleanliness_rating))}
                  </span>
                  <span>({truckStop.cleanliness_rating.toFixed(1)})</span>
                </div>
                <div className="rating-item">
                  <span>Food Quality:</span>
                  <span className="rating-stars">
                    {'★'.repeat(Math.round(truckStop.food_rating))}
                    {'☆'.repeat(5 - Math.round(truckStop.food_rating))}
                  </span>
                  <span>({truckStop.food_rating.toFixed(1)})</span>
                </div>
                <div className="rating-item">
                  <span>Safety:</span>
                  <span className="rating-stars">
                    {'★'.repeat(Math.round(truckStop.safety_rating))}
                    {'☆'.repeat(5 - Math.round(truckStop.safety_rating))}
                  </span>
                  <span>({truckStop.safety_rating.toFixed(1)})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="card">
            <div className="reviews-header flex flex-between align-center mb-2">
              <h2>Reviews ({reviews.length})</h2>
              <button 
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="btn btn-primary"
              >
                {showReviewForm ? 'Cancel' : 'Add Review'}
              </button>
            </div>

            {showReviewForm && (
              <FeedbackForm 
                onSubmit={handleReviewSubmit}
                onCancel={() => setShowReviewForm(false)}
              />
            )}

            <div className="reviews-list">
              {reviews.length === 0 ? (
                <p>No reviews yet. Be the first to review this truck stop!</p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-header flex flex-between align-center">
                      <div className="review-ratings">
                        <span>Clean: {'★'.repeat(review.cleanliness_rating)}</span>
                        <span>Food: {'★'.repeat(review.food_rating)}</span>
                        <span>Safety: {'★'.repeat(review.safety_rating)}</span>
                      </div>
                      <span className="review-date">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="parking-availability mb-1">
                      <strong>Parking:</strong> {review.parking_availability}
                    </div>
                    {review.comment && (
                      <p className="review-comment">{review.comment}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          {/* Weather Widget */}
          {weather && (
            <div className="card mb-3">
              <h3>Current Weather</h3>
              <WeatherWidget 
                lat={truckStop.latitude} 
                lng={truckStop.longitude}
                weatherData={weather}
              />
            </div>
          )}

          {/* Location Info */}
          <div className="card">
            <h3>Location</h3>
            <p><strong>Coordinates:</strong></p>
            <p>Latitude: {truckStop.latitude}</p>
            <p>Longitude: {truckStop.longitude}</p>
            <button 
              onClick={() => {
                window.open(
                  `https://www.google.com/maps?q=${truckStop.latitude},${truckStop.longitude}`,
                  '_blank'
                );
              }}
              className="btn btn-primary mt-2"
            >
              <FaMapMarkedAlt style={{ marginRight: '0.5rem' }} />
              Open in Maps
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TruckStopDetail; 