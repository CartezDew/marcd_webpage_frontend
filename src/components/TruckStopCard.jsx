import { Link } from 'react-router-dom';
import { FaStar, FaShower, FaUtensils, FaTools, FaGasPump, FaMapMarkedAlt } from 'react-icons/fa';

function TruckStopCard({ truckStop }) {
  const getParkingStatusClass = () => {
    if (truckStop.available_spaces === 0) return 'parking-full';
    if (truckStop.available_spaces < truckStop.parking_spaces / 2) return 'parking-limited';
    return 'parking-available';
  };

  const getParkingStatusText = () => {
    if (truckStop.available_spaces === 0) return 'Full';
    if (truckStop.available_spaces < truckStop.parking_spaces / 2) return 'Limited';
    return 'Available';
  };

  return (
    <div className="card truck-stop-card">
      <div className="truck-stop-info">
        <h3>
          <Link to={`/truck-stops/${truckStop.id}`} className="truck-stop-link">
            {truckStop.name}
          </Link>
        </h3>
        <p className="address">{truckStop.address}</p>
        
        <div className="truck-stop-amenities">
          {truckStop.has_showers && (
            <span className="amenity-badge">
              <FaShower style={{ marginRight: '0.25rem' }} />
              Showers
            </span>
          )}
          {truckStop.has_restaurant && (
            <span className="amenity-badge">
              <FaUtensils style={{ marginRight: '0.25rem' }} />
              Restaurant
            </span>
          )}
          {truckStop.has_repair_shop && (
            <span className="amenity-badge">
              <FaTools style={{ marginRight: '0.25rem' }} />
              Repair Shop
            </span>
          )}
          {truckStop.has_fuel && (
            <span className="amenity-badge">
              <FaGasPump style={{ marginRight: '0.25rem' }} />
              Fuel
            </span>
          )}
        </div>

        <div className="truck-stop-ratings">
          <div className="rating-item">
            <span>Cleanliness:</span>
            <span className="rating-stars">
              {'★'.repeat(Math.round(truckStop.cleanliness_rating))}
              {'☆'.repeat(5 - Math.round(truckStop.cleanliness_rating))}
            </span>
            <span>({truckStop.cleanliness_rating.toFixed(1)})</span>
          </div>
          <div className="rating-item">
            <span>Food:</span>
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

        {truckStop.distance && (
          <div className="distance-info">
            <span className="distance-text">
              {truckStop.distance.distance_miles ? 
                `${truckStop.distance.distance_miles} miles away` :
                `${truckStop.distance.distance_km} km away`
              }
            </span>
          </div>
        )}
      </div>

      <div className="truck-stop-status">
        <div className={`parking-status ${getParkingStatusClass()}`}>
          {getParkingStatusText()}
        </div>
        <p className="text-center mt-1">
          {truckStop.available_spaces}/{truckStop.parking_spaces} spaces
        </p>
        <div className="truck-stop-actions mt-2">
          <Link to={`/truck-stops/${truckStop.id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
          <button 
            onClick={() => {
              window.open(
                `https://www.google.com/maps?q=${truckStop.latitude},${truckStop.longitude}`,
                '_blank'
              );
            }}
            className="btn btn-secondary btn-sm"
          >
            <FaMapMarkedAlt style={{ marginRight: '0.25rem' }} />
            Map
          </button>
        </div>
      </div>
    </div>
  );
}

export default TruckStopCard; 