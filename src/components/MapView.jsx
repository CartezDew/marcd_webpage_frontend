import { useEffect, useRef } from 'react';
import { FaMapMarkedAlt, FaTruck } from 'react-icons/fa';

function MapView({ userLocation, truckStops }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (userLocation && truckStops.length > 0) {
      renderMap();
    }
  }, [userLocation, truckStops]);

  const renderMap = () => {
    if (!mapRef.current) return;

    // Create a simple map representation
    const mapContainer = mapRef.current;
    mapContainer.innerHTML = '';

    // Create map header
    const mapHeader = document.createElement('div');
    mapHeader.className = 'map-header';
    mapHeader.innerHTML = `
      <div class="map-legend">
        <div class="legend-item">
          <FaMapMarkedAlt style="color: #3498db;" />
          <span>Your Location</span>
        </div>
        <div class="legend-item">
          <FaTruck style="color: #e74c3c;" />
          <span>Truck Stop</span>
        </div>
      </div>
    `;
    mapContainer.appendChild(mapHeader);

    // Create map content
    const mapContent = document.createElement('div');
    mapContent.className = 'map-content';
    
    // Add user location marker
    const userMarker = document.createElement('div');
    userMarker.className = 'map-marker user-marker';
    userMarker.innerHTML = '<FaMapMarkedAlt />';
    userMarker.title = 'Your Location';
    mapContent.appendChild(userMarker);

    // Add truck stop markers
    truckStops.forEach((stop, index) => {
      const stopMarker = document.createElement('div');
      stopMarker.className = 'map-marker truck-stop-marker';
      stopMarker.innerHTML = '<FaTruck />';
      stopMarker.title = `${stop.name} - ${stop.available_spaces}/${stop.parking_spaces} spaces`;
      
      // Position markers based on distance (simplified)
      const distance = stop.distance?.distance_miles || 0;
      const position = Math.min(distance * 10, 80); // Scale distance to position
      stopMarker.style.left = `${20 + (index * 15)}%`;
      stopMarker.style.top = `${20 + position}%`;
      
      mapContent.appendChild(stopMarker);
    });

    mapContainer.appendChild(mapContent);

    // Add map info
    const mapInfo = document.createElement('div');
    mapInfo.className = 'map-info';
    mapInfo.innerHTML = `
      <p><strong>Map Legend:</strong></p>
      <p>• Blue marker: Your current location</p>
      <p>• Red markers: Nearby truck stops</p>
      <p>• Hover over markers for details</p>
    `;
    mapContainer.appendChild(mapInfo);
  };

  if (!userLocation) {
    return (
      <div className="map-container">
        <div className="text-center">
          <p>Location access required to show map</p>
        </div>
      </div>
    );
  }

  return (
    <div className="map-container">
      <div ref={mapRef} className="simple-map">
        {!userLocation && (
          <div className="text-center">
            <p>Loading map...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MapView; 