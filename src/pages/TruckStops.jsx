import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaStar, FaParking, FaShower, FaUtensils, FaTools, FaGasPump } from 'react-icons/fa';
import { truckStopsAPI } from '../services/truckStops';
import TruckStopCard from '../components/TruckStopCard';

function TruckStops({ userLocation }) {
  const [truckStops, setTruckStops] = useState([]);
  const [filteredStops, setFilteredStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    hasShowers: false,
    hasRestaurant: false,
    hasRepairShop: false,
    hasFuel: false,
    parkingAvailable: false
  });

  useEffect(() => {
    fetchTruckStops();
  }, []);

  useEffect(() => {
    filterStops();
  }, [truckStops, searchTerm, filters]);

  const fetchTruckStops = async () => {
    try {
      let data;
      if (userLocation) {
        // Get nearby stops if user location is available
        const response = await truckStopsAPI.getNearby(userLocation.lat, userLocation.lng);
        data = response.data;
      } else {
        // Get all stops if no user location
        const response = await truckStopsAPI.getAll();
        data = response.data;
      }
      setTruckStops(data);
    } catch (error) {
      console.error('Error fetching truck stops:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterStops = () => {
    let filtered = truckStops;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(stop =>
        stop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stop.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Amenity filters
    if (filters.hasShowers) {
      filtered = filtered.filter(stop => stop.has_showers);
    }
    if (filters.hasRestaurant) {
      filtered = filtered.filter(stop => stop.has_restaurant);
    }
    if (filters.hasRepairShop) {
      filtered = filtered.filter(stop => stop.has_repair_shop);
    }
    if (filters.hasFuel) {
      filtered = filtered.filter(stop => stop.has_fuel);
    }
    if (filters.parkingAvailable) {
      filtered = filtered.filter(stop => stop.available_spaces > 0);
    }

    setFilteredStops(filtered);
  };

  const handleFilterChange = (filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const clearFilters = () => {
    setFilters({
      hasShowers: false,
      hasRestaurant: false,
      hasRepairShop: false,
      hasFuel: false,
      parkingAvailable: false
    });
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="loading-spinner"></div>
        <p>Loading truck stops...</p>
      </div>
    );
  }

  return (
    <div className="truck-stops-page">
      <div className="page-header text-center mb-3">
        <h1>Truck Stops</h1>
        <p>Find the perfect stop for your journey</p>
      </div>

      {/* Search and Filters */}
      <div className="search-filters card mb-3">
        <div className="search-section mb-2">
          <div className="form-group">
            <label htmlFor="search">
              <FaSearch style={{ marginRight: '0.5rem' }} />
              Search Truck Stops
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or address..."
            />
          </div>
        </div>

        <div className="filters-section">
          <h3>
            <FaFilter style={{ marginRight: '0.5rem' }} />
            Filters
          </h3>
          <div className="filters-grid">
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={filters.hasShowers}
                onChange={() => handleFilterChange('hasShowers')}
              />
              <FaShower style={{ marginRight: '0.5rem' }} />
              Showers
            </label>
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={filters.hasRestaurant}
                onChange={() => handleFilterChange('hasRestaurant')}
              />
              <FaUtensils style={{ marginRight: '0.5rem' }} />
              Restaurant
            </label>
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={filters.hasRepairShop}
                onChange={() => handleFilterChange('hasRepairShop')}
              />
              <FaTools style={{ marginRight: '0.5rem' }} />
              Repair Shop
            </label>
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={filters.hasFuel}
                onChange={() => handleFilterChange('hasFuel')}
              />
              <FaGasPump style={{ marginRight: '0.5rem' }} />
              Fuel
            </label>
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={filters.parkingAvailable}
                onChange={() => handleFilterChange('parkingAvailable')}
              />
              <FaParking style={{ marginRight: '0.5rem' }} />
              Parking Available
            </label>
          </div>
          <button onClick={clearFilters} className="btn btn-secondary mt-2">
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="results-section">
        <div className="results-header flex flex-between align-center mb-2">
          <h2>Results ({filteredStops.length})</h2>
          {userLocation && (
            <span className="location-note">
              Showing stops near your location
            </span>
          )}
        </div>

        {filteredStops.length === 0 ? (
          <div className="text-center card">
            <h3>No truck stops found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="truck-stops-grid">
            {filteredStops.map((stop) => (
              <TruckStopCard key={stop.id} truckStop={stop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TruckStops; 