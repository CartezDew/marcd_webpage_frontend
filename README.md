# Marc'd Trucking App - Frontend

A modern React application for truck drivers to find truck stops, check weather conditions, and share experiences with the community.

## Features

### 🚛 Core Features
- **GPS Truck Stop Finder**: Find truck stops near your location in real-time
- **Weather Integration**: Real-time weather updates for your current location
- **Parking Availability**: Real-time parking status updates from other drivers
- **User Reviews**: Rate and review truck stops for cleanliness, food quality, and safety
- **Interactive Map**: Visual representation of nearby truck stops

### 🛠️ Technical Features
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Data**: Live updates for parking availability and weather
- **Search & Filter**: Find truck stops by amenities and location
- **User Feedback System**: Submit reviews and general feedback
- **Modern UI/UX**: Clean, intuitive interface with smooth animations

## Tech Stack

- **Frontend Framework**: React 18
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: React Icons
- **Maps**: Leaflet (for future implementation)
- **Styling**: CSS3 with modern features
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend API running (Django backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd marcd_webpage_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Backend Setup
Make sure your Django backend is running on `http://localhost:8000` before using the frontend.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Nav.jsx         # Navigation component
│   ├── TruckStopCard.jsx # Truck stop display card
│   ├── WeatherWidget.jsx # Weather information widget
│   ├── MapView.jsx     # Map visualization
│   └── FeedbackForm.jsx # Review submission form
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── TruckStops.jsx  # Truck stops listing
│   ├── TruckStopDetail.jsx # Individual truck stop details
│   ├── Feedback.jsx    # General feedback form
│   └── Survey.jsx      # User survey
├── services/           # API service functions
│   ├── apiConfig.js    # Axios configuration
│   ├── truckStops.js   # Truck stop API calls
│   ├── reviews.js      # Review API calls
│   ├── weather.js      # Weather API calls
│   └── feedback.js     # Feedback API calls
├── App.jsx             # Main application component
├── App.css             # Global styles
└── main.jsx           # Application entry point
```

## API Integration

The frontend integrates with the Django backend through the following endpoints:

### Truck Stops
- `GET /truck-stops/` - Get all truck stops
- `GET /truck-stops/{id}/` - Get specific truck stop
- `GET /truck-stops/nearby/` - Get nearby truck stops by coordinates

### Reviews
- `GET /reviews/` - Get all reviews
- `POST /reviews/` - Create new review
- `PUT /reviews/{id}/` - Update review
- `DELETE /reviews/{id}/` - Delete review

### Weather
- `GET /weather/` - Get weather data
- `POST /weather/` - Create weather record

### Feedback
- `GET /feedback/` - Get feedback (admin only)
- `POST /feedback/` - Submit feedback

## Key Components

### TruckStopCard
Displays truck stop information including:
- Name and address
- Available amenities (showers, restaurant, repair shop, fuel)
- Average ratings (cleanliness, food, safety)
- Parking availability status
- Distance from user location

### WeatherWidget
Shows current weather conditions:
- Temperature
- Weather conditions
- Wind speed
- Precipitation

### MapView
Visual representation of:
- User's current location
- Nearby truck stops
- Interactive markers with tooltips

### FeedbackForm
Allows users to submit reviews with:
- Star ratings for cleanliness, food, and safety
- Parking availability status
- Optional comments

## Styling

The application uses a modern, responsive design with:
- **Color Scheme**: Blue gradient background with white cards
- **Typography**: Segoe UI font family
- **Layout**: CSS Grid and Flexbox for responsive layouts
- **Animations**: Smooth hover effects and transitions
- **Mobile-First**: Responsive design that works on all screen sizes

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_WEATHER_API_KEY=your_openweathermap_api_key
```

## Future Enhancements

### Phase 2 Features
- [ ] Real-time weather API integration (OpenWeatherMap)
- [ ] Advanced map features with Leaflet
- [ ] Push notifications for parking updates
- [ ] Offline functionality
- [ ] User authentication system
- [ ] Favorite truck stops
- [ ] Route planning integration

### Phase 3 Features
- [ ] Mobile app (React Native)
- [ ] Real-time chat between drivers
- [ ] Fuel price tracking
- [ ] Maintenance scheduling
- [ ] Driver community features

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for the trucking community**
