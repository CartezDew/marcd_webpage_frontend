import React, { useState, useEffect } from 'react';
import { Box, Typography, Container } from '@mui/material';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import { 
  Navigation as NavigationIcon,
  LocalParking as ParkingIcon,
  MonitorWeight as WeightIcon,
  Speed as SpeedIcon,
  LocalPolice as PoliceIcon,
  SupportAgent as SupportAgentIcon,
  KeyboardVoice as KeyboardVoiceIcon,
  Favorite as FavoriteIcon,
  EmojiEvents as StarIcon,
} from '@mui/icons-material';
import '../styles/features.css';

function Features() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      id: 1,
      icon: <StarIcon />,
      title: "Top Marc'er Rewards",
      route: '#rewards',
      description: "Turn your impact into income. Earn cash and climb the leaderboard while makeing the road better for everyone."
    },
    {
      id: 2,
      icon: <NavigationIcon />,
      title: "Navigation",
      route: '#navigation',
      description: "Get truck-optimized directions for any route."
    },
    {
      id: 3,
      icon: <ParkingIcon />,
      title: "Real-time Parking Solutions",
      route: '#parking',
      description: "Find and share parking availability on the go."
    },
    {
      id: 4,
      icon: <KeyboardVoiceIcon />,
      title: "Voice-Activated Controls",
      route: '#voice-controls',
      description: "Hands-free interaction for safer driving."
    },
    {
      id: 5,
      icon: <SupportAgentIcon />,
      title: "Spotter Request Assistance",
      route: '#spotter-request',
      description: "Request help with tight dock or blindside parking."
    },
    {
      id: 6,
      icon: <SpeedIcon />,
      title: "Speed Monitoring Alerts",
      route: '#speed-alerts',
      description: "Stay informed of speed limits and alerts."
    },
    {
      id: 7,
      icon: <PoliceIcon />,
      title: "DOT/Police Alerts",
      route: '#dot-police-alerts',
      description: "Stay updated on nearby Police and DOT officers."
    },
    {
      id: 8,
      icon: <FavoriteIcon />,
      title: "Favorite Places",
      route: '#favorite-places',
      description: "Save frequently visited spots for quick access."
    },    
  ];

  return (
    <Box className="features-container">
      <Container maxWidth="lg" className="features-content">
        {/* Header Section */}
        <Box className={`features-header ${isVisible ? 'animate' : ''}`}>
          <Typography variant="h1" className="features-title">
            All Features
          </Typography>
          <Typography className="features-subtitle">
           "Not just another app. This one's Marc'd."
           <GpsFixedIcon style={{ color: '#be0303', marginLeft: '0.5rem' }} />
          </Typography>
        </Box>

        {/* Features Grid */}
        <Box className={`features-grid ${isVisible ? 'animate' : ''}`}>
          {features.map((feature, index) => (
            <Box 
              key={feature.id} 
              className={`feature-card feature-card-${feature.id}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Box className="feature-icon">
                {feature.icon}
              </Box>
              <Typography variant="h3" className="feature-title">
                {feature.title}
              </Typography>
              <Typography className="feature-description">
                {feature.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default Features;
