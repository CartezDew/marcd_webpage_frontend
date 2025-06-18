import { useState, useEffect } from 'react';
import { FaThermometerHalf, FaWind, FaCloudRain, FaCloudSun } from 'react-icons/fa';

function WeatherWidget({ lat, lng, weatherData }) {
  const [weather, setWeather] = useState(weatherData);
  const [loading, setLoading] = useState(!weatherData);

  useEffect(() => {
    if (!weatherData && lat && lng) {
      fetchWeatherData();
    }
  }, [lat, lng, weatherData]);

  const fetchWeatherData = async () => {
    try {
      // For now, we'll simulate weather data
      // In a real app, you'd call a weather API like OpenWeatherMap
      const mockWeather = {
        temperature: Math.round(Math.random() * 30 + 10), // 10-40°C
        conditions: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
        wind_speed: Math.round(Math.random() * 20 + 5), // 5-25 mph
        precipitation: Math.round(Math.random() * 100) / 100 // 0-1 inches
      };
      
      setWeather(mockWeather);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (conditions) => {
    const condition = conditions.toLowerCase();
    if (condition.includes('rain') || condition.includes('storm')) {
      return <FaCloudRain />;
    } else if (condition.includes('cloud')) {
      return <FaCloudSun />;
    } else {
      return <FaCloudSun />;
    }
  };

  if (loading) {
    return (
      <div className="weather-widget">
        <div className="loading-spinner"></div>
        <p>Loading weather...</p>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="weather-widget">
        <p>Weather data unavailable</p>
      </div>
    );
  }

  return (
    <div className="weather-widget">
      <div className="weather-main">
        <div className="weather-icon">
          {getWeatherIcon(weather.conditions)}
        </div>
        <div className="weather-temp">
          {weather.temperature}°F
        </div>
        <div className="weather-conditions">
          {weather.conditions}
        </div>
      </div>
      
      <div className="weather-details">
        <div className="weather-detail">
          <FaWind />
          <span>{weather.wind_speed} mph</span>
        </div>
        <div className="weather-detail">
          <FaCloudRain />
          <span>{weather.precipitation}"</span>
        </div>
      </div>
    </div>
  );
}

export default WeatherWidget; 