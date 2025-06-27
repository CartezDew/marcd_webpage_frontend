import React, { useState, useEffect, useRef } from 'react';
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
  const [showConfetti, setShowConfetti] = useState(false);
  const [isRewardsCardVisible, setIsRewardsCardVisible] = useState(false);
  const rewardsCardRef = useRef(null);
  const confettiIntervalRef = useRef(null);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Intersection Observer for the rewards card
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsRewardsCardVisible(entry.isIntersecting);
      },
      {
        threshold: 0.3, // Trigger when 30% of the card is visible
        rootMargin: '0px'
      }
    );

    if (rewardsCardRef.current) {
      observer.observe(rewardsCardRef.current);
    }

    return () => {
      if (rewardsCardRef.current) {
        observer.unobserve(rewardsCardRef.current);
      }
    };
  }, []);

  // Confetti animation management
  useEffect(() => {
    if (isRewardsCardVisible) {
      // Start confetti after 1 second when card becomes visible
      const initialDelay = setTimeout(() => {
        setShowConfetti(true);
        
        // Set up interval to repeat every 15 seconds
        confettiIntervalRef.current = setInterval(() => {
          setShowConfetti(false);
          // Brief delay to reset animation
          setTimeout(() => {
            setShowConfetti(true);
          }, 100);
        }, 7000);
      }, 1000);

      return () => {
        clearTimeout(initialDelay);
        if (confettiIntervalRef.current) {
          clearInterval(confettiIntervalRef.current);
        }
      };
    } else {
      // Stop confetti when card is not visible
      setShowConfetti(false);
      if (confettiIntervalRef.current) {
        clearInterval(confettiIntervalRef.current);
        confettiIntervalRef.current = null;
      }
    }
  }, [isRewardsCardVisible]);

  const features = [
    {
      id: 1,
      icon: <StarIcon />,
      title: "Top Marc'er Rewards",
      route: '#rewards',
      description: "Rack up rewards, earn real cash, and get the recognition you deserve for making the road better for everyone."
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

  // Generate confetti elements that appear to pop from the icon
  const generateConfetti = () => {
    const confettiElements = [];
    for (let i = 0; i < 15; i++) {
      const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#a29bfe', '#fd79a8', '#fdcb6e', '#55a3ff'];
      confettiElements.push(
        <div 
          key={i} 
          className="confetti-particle" 
          style={{
            backgroundColor: colors[i % colors.length],
            left: `${45 + Math.random() * 10}%`, // Center around icon position
            animationDelay: `${Math.random() * 0.3}s`,
            animationDuration: `${1.5 + Math.random() * 0.8}s`
          }}
        />
      );
    }
    return confettiElements;
  };

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
              ref={feature.id === 1 ? rewardsCardRef : null}
            >
              {/* Confetti Container for Top Marc'er Rewards */}
              {feature.id === 1 && showConfetti && (
                <div className="confetti-container">
                  {generateConfetti()}
                </div>
              )}
              
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
