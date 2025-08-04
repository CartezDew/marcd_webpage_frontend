import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
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
  AttachMoney as CashIcon,
  KeyboardArrowUp as ArrowUpIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import '../styles/features.css';
// Import images
import navigationImage from '../assets/App_Navigation.png';
import parkingImage from '../assets/App_Parking.png';
// import alertsVideo from './public/videos/Alerts_Demo.mp4';
// import spotterVideo from './public/videos/Requesting_Spotter_Demo.mp4';
// import statisticsVideo from './public/videos/Statistics_Demo.mp4';
// import featureRequestVideo from './public/videos/Feature_Request_Demo.mp4';

function Features() {
  const [isVisible, setIsVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isRewardsCardVisible, setIsRewardsCardVisible] = useState(false);
  const [isRewardsSectionVisible, setIsRewardsSectionVisible] = useState(false);
  const [isNavigationVisible, setIsNavigationVisible] = useState(false);
  const [isParkingVisible, setIsParkingVisible] = useState(false);
  const [isPoliceAlertsVisible, setIsPoliceAlertsVisible] = useState(false);
  const [isSpotterVisible, setIsSpotterVisible] = useState(false);
  const [isVoiceControlsVisible, setIsVoiceControlsVisible] = useState(false);
  const [isSpeedAlertsVisible, setIsSpeedAlertsVisible] = useState(false);
  const [isFavoritePlacesVisible, setIsFavoritePlacesVisible] = useState(false);
  const [isFeatureRequestVisible, setIsFeatureRequestVisible] = useState(false);
  const [isVideoEnlarged, setIsVideoEnlarged] = useState(false);
  const [isSpotterVideoEnlarged, setIsSpotterVideoEnlarged] = useState(false);
  const [isStatisticsVideoEnlarged, setIsStatisticsVideoEnlarged] = useState(false);
  const [isFeatureRequestVideoEnlarged, setIsFeatureRequestVideoEnlarged] = useState(false);
  const [isNavigationImageEnlarged, setIsNavigationImageEnlarged] = useState(false);
  const [isFirstViewport, setIsFirstViewport] = useState(true);
  const [animatedCards, setAnimatedCards] = useState(new Set());
  const [isGridInView, setIsGridInView] = useState(false);
  const featuresGridRef = useRef(null);
  const rewardsCardRef = useRef(null);
  const rewardsSectionRef = useRef(null);
  const navigationSectionRef = useRef(null);
  const parkingSectionRef = useRef(null);
  const policeAlertsSectionRef = useRef(null);
  const spotterSectionRef = useRef(null);
  const voiceControlsSectionRef = useRef(null);
  const speedAlertsSectionRef = useRef(null);
  const favoritePlacesSectionRef = useRef(null);
  const featureRequestSectionRef = useRef(null);
  const alertsVideoRef = useRef(null);
  const spotterVideoRef = useRef(null);
  const statisticsVideoRef = useRef(null);
  const featureRequestVideoRef = useRef(null);
  const confettiIntervalRef = useRef(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Intersection Observer for the features grid (first viewport)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFirstViewport(entry.isIntersecting);
        if (entry.isIntersecting && !isGridInView) {
          setIsGridInView(true);
          // Start sequential animation after header animations complete
          // Header animation is 0.8s + grid animation delay of 0.3s = 1.1s total
          setTimeout(() => {
            startSequentialAnimation();
          }, 1100);
        }
      },
      {
        threshold: 0.05, // Trigger when 5% of the grid is visible
        rootMargin: '0px'
      }
    );

    if (featuresGridRef.current) {
      observer.observe(featuresGridRef.current);
    }

    return () => {
      if (featuresGridRef.current) {
        observer.unobserve(featuresGridRef.current);
      }
    };
  }, [isGridInView])

  // Sequential animation function
  const startSequentialAnimation = () => {
    const animationDelay = 300; // 300ms between each card
    const features = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // Feature IDs in order
    
    features.forEach((featureId, index) => {
      setTimeout(() => {
        setAnimatedCards(prev => new Set([...prev, featureId]));
      }, index * animationDelay);
    });
  };

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

  // Intersection Observer for the rewards section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsRewardsSectionVisible(entry.isIntersecting);
        // Control video playback based on visibility
        if (statisticsVideoRef.current) {
          if (entry.isIntersecting) {
            statisticsVideoRef.current.play();
          } else {
            statisticsVideoRef.current.pause();
          }
        }
      },
      {
        threshold: 0.3,
        rootMargin: '0px'
      }
    );

    if (rewardsSectionRef.current) {
      observer.observe(rewardsSectionRef.current);
    }

    return () => {
      if (rewardsSectionRef.current) {
        observer.unobserve(rewardsSectionRef.current);
      }
    };
  }, []);

  // Intersection Observer for the navigation section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNavigationVisible(entry.isIntersecting);
      },
      {
        threshold: 0.3,
        rootMargin: '0px'
      }
    );

    if (navigationSectionRef.current) {
      observer.observe(navigationSectionRef.current);
    }

    return () => {
      if (navigationSectionRef.current) {
        observer.unobserve(navigationSectionRef.current);
      }
    };
  }, []);

  // Intersection Observer for the parking section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsParkingVisible(entry.isIntersecting);
      },
      {
        threshold: 0.3,
        rootMargin: '0px'
      }
    );

    if (parkingSectionRef.current) {
      observer.observe(parkingSectionRef.current);
    }

    return () => {
      if (parkingSectionRef.current) {
        observer.unobserve(parkingSectionRef.current);
      }
    };
  }, []);

  // Intersection Observer for the police alerts section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPoliceAlertsVisible(entry.isIntersecting);
        // Control video playback based on visibility
        if (alertsVideoRef.current) {
          if (entry.isIntersecting) {
            alertsVideoRef.current.play();
          } else {
            alertsVideoRef.current.pause();
          }
        }
      },
      {
        threshold: 0.3,
        rootMargin: '0px'
      }
    );

    if (policeAlertsSectionRef.current) {
      observer.observe(policeAlertsSectionRef.current);
    }

    return () => {
      if (policeAlertsSectionRef.current) {
        observer.unobserve(policeAlertsSectionRef.current);
      }
    };
  }, []);

  // Intersection Observer for the spotter section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSpotterVisible(entry.isIntersecting);
        // Control video playback based on visibility
        if (spotterVideoRef.current) {
          if (entry.isIntersecting) {
            spotterVideoRef.current.play();
          } else {
            spotterVideoRef.current.pause();
          }
        }
      },
      {
        threshold: 0.3,
        rootMargin: '0px'
      }
    );

    if (spotterSectionRef.current) {
      observer.observe(spotterSectionRef.current);
    }

    return () => {
      if (spotterSectionRef.current) {
        observer.unobserve(spotterSectionRef.current);
      }
    };
  }, []);

  // Intersection Observer for the voice controls section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVoiceControlsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.3,
        rootMargin: '0px'
      }
    );

    if (voiceControlsSectionRef.current) {
      observer.observe(voiceControlsSectionRef.current);
    }

    return () => {
      if (voiceControlsSectionRef.current) {
        observer.unobserve(voiceControlsSectionRef.current);
      }
    };
  }, []);

  // Intersection Observer for the speed alerts section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSpeedAlertsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.3,
        rootMargin: '0px'
      }
    );

    if (speedAlertsSectionRef.current) {
      observer.observe(speedAlertsSectionRef.current);
    }

    return () => {
      if (speedAlertsSectionRef.current) {
        observer.unobserve(speedAlertsSectionRef.current);
      }
    };
  }, []);

  // Intersection Observer for the favorite places section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFavoritePlacesVisible(entry.isIntersecting);
      },
      {
        threshold: 0.3,
        rootMargin: '0px'
      }
    );

    if (favoritePlacesSectionRef.current) {
      observer.observe(favoritePlacesSectionRef.current);
    }

    return () => {
      if (favoritePlacesSectionRef.current) {
        observer.unobserve(favoritePlacesSectionRef.current);
      }
    };
  }, []);

  // Intersection Observer for the feature request section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFeatureRequestVisible(entry.isIntersecting);
        // Control video playback based on visibility
        if (featureRequestVideoRef.current) {
          if (entry.isIntersecting) {
            featureRequestVideoRef.current.play();
          } else {
            featureRequestVideoRef.current.pause();
          }
        }
      },
      {
        threshold: 0.3,
        rootMargin: '0px'
      }
    );

    if (featureRequestSectionRef.current) {
      observer.observe(featureRequestSectionRef.current);
    }

    return () => {
      if (featureRequestSectionRef.current) {
        observer.unobserve(featureRequestSectionRef.current);
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

  // Handle smooth scrolling to sections
  const handleCardClick = (route) => {
    if (route === '#rewards') {
      // Get the rewards section element and its position
      const element = rewardsSectionRef.current;
      if (element) {
        // Calculate the offset from the top of the page
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        // Add a larger offset to ensure we scroll to the very beginning of the section
        const offsetPosition = elementPosition - 100; // 100px offset from top to show the start
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else if (route === '#navigation') {
      // Get the navigation section element and its position
      const element = navigationSectionRef.current;
      if (element) {
        // Calculate the offset from the top of the page
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        // Add a larger offset to ensure we scroll to the very beginning of the section
        const offsetPosition = elementPosition - 100; // 100px offset from top to show the start
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else if (route === '#parking') {
      // Get the parking section element and its position
      const element = parkingSectionRef.current;
      if (element) {
        // Calculate the offset from the top of the page
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        // Add a larger offset to ensure we scroll to the very beginning of the section
        const offsetPosition = elementPosition - 100; // 100px offset from top to show the start
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else if (route === '#dot-police-alerts') {
      // Get the police alerts section element and its position
      const element = policeAlertsSectionRef.current;
      if (element) {
        // Calculate the offset from the top of the page
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        // Add a larger offset to ensure we scroll to the very beginning of the section
        const offsetPosition = elementPosition - 100; // 100px offset from top to show the start
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else if (route === '#spotter-request') {
      // Get the spotter request section element and its position
      const element = spotterSectionRef.current;
      if (element) {
        // Calculate the offset from the top of the page
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        // Add a larger offset to ensure we scroll to the very beginning of the section
        const offsetPosition = elementPosition - 100; // 100px offset from top to show the start
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else if (route === '#voice-controls') {
      // Get the voice controls section element and its position
      const element = voiceControlsSectionRef.current;
      if (element) {
        // Calculate the offset from the top of the page
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        // Add a larger offset to ensure we scroll to the very beginning of the section
        const offsetPosition = elementPosition - 100; // 100px offset from top to show the start
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else if (route === '#speed-alerts') {
      // Get the speed alerts section element and its position
      const element = speedAlertsSectionRef.current;
      if (element) {
        // Calculate the offset from the top of the page
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        // Add a larger offset to ensure we scroll to the very beginning of the section
        const offsetPosition = elementPosition - 100; // 100px offset from top to show the start
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else if (route === '#favorite-places') {
      // Get the favorite places section element and its position
      const element = favoritePlacesSectionRef.current;
      if (element) {
        // Calculate the offset from the top of the page
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        // Add a larger offset to ensure we scroll to the very beginning of the section
        const offsetPosition = elementPosition - 100; // 100px offset from top to show the start
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else if (route === '#feature-request') {
      // Get the feature request section element and its position
      const element = featureRequestSectionRef.current;
      if (element) {
        // Calculate the offset from the top of the page
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        // Add a larger offset to ensure we scroll to the very beginning of the section
        const offsetPosition = elementPosition - 100; // 100px offset from top to show the start
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
    // Add other route handlers as needed
  };

  // Handle video click to enlarge/shrink
  const handleVideoClick = () => {
    setIsVideoEnlarged(!isVideoEnlarged);
  };

  const handleSpotterVideoClick = () => {
    setIsSpotterVideoEnlarged(!isSpotterVideoEnlarged);
  };

  const handleStatisticsVideoClick = () => {
    setIsStatisticsVideoEnlarged(!isStatisticsVideoEnlarged);
  };

  const handleFeatureRequestVideoClick = () => {
    setIsFeatureRequestVideoEnlarged(!isFeatureRequestVideoEnlarged);
  };

  const handleNavigationImageClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const newState = !isNavigationImageEnlarged;
    setIsNavigationImageEnlarged(newState);
  };

  // Check if user is on mobile device
  const isMobile = () => {
    return window.innerWidth <= 768;
  };

  // Handle clicks outside of videos to shrink them
  useEffect(() => {
    const handleDocumentClick = (event) => {
      // Check if click is outside of any video element or navigation image
      const isVideoClick = event.target.closest('.alerts-video, .spotter-video, .statistics-video, .feature-request-video');
      const isNavigationImageClick = event.target.closest('.navigation-image');
      
      if (!isVideoClick && !isNavigationImageClick) {
        // Reset all video and image enlargement states
        setIsVideoEnlarged(false);
        setIsSpotterVideoEnlarged(false);
        setIsStatisticsVideoEnlarged(false);
        setIsFeatureRequestVideoEnlarged(false);
        setIsNavigationImageEnlarged(false);
      }
    };

    // Add event listener when any video or image is enlarged
    if (isVideoEnlarged || isSpotterVideoEnlarged || isStatisticsVideoEnlarged || isFeatureRequestVideoEnlarged || isNavigationImageEnlarged) {
      document.addEventListener('click', handleDocumentClick);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [isVideoEnlarged, isSpotterVideoEnlarged, isStatisticsVideoEnlarged, isFeatureRequestVideoEnlarged, isNavigationImageEnlarged]);



  // Scroll function - scrolls to next section if in first viewport, otherwise scrolls to top
  const handleScrollAction = () => {
    if (isFirstViewport) {
      // Scroll to the first feature detail section (rewards section)
      const rewardsSection = document.getElementById('rewards');
      if (rewardsSection) {
        rewardsSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else {
      // Scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

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
    {
      id: 9,
      icon: <AddIcon />,
      title: "Feature Request",
      route: '#feature-request',
      description: "Request a new feature or improvement for the app."
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
        <Box ref={featuresGridRef} className={`features-grid ${isVisible ? 'animate' : ''}`}>
          {features.map((feature, index) => (
            <Box 
              key={feature.id} 
              className={`feature-card feature-card-${feature.id} ${animatedCards.has(feature.id) ? 'card-animate-in' : ''}`}
              ref={feature.id === 1 ? rewardsCardRef : null}
              onClick={() => handleCardClick(feature.route)}
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

        {/* Top Marc'er Rewards Feature Detail Section */}
        <Box 
          id="rewards"
          ref={rewardsSectionRef}
          className={`navigation-feature-section animate ${isStatisticsVideoEnlarged ? 'video-enlarged' : ''}`}
        >
          <Container maxWidth="lg" className="navigation-content">
            <Box className="navigation-grid">
              <Box className="navigation-text-content">
                <Typography variant="h2" className="navigation-title">
                  Top Marc'er Rewards
                </Typography>
                
                <Typography className="navigation-description">
                  Truckers are the quiet heroes of our daily lives.
                  <br />
                  At Marc'd, we believe it's time their contributions are truly recognized.
                  <br />
                  <br />
                </Typography>

                <Typography className="navigation-description">
                  <strong>What It Is</strong>
                  <br />
                  <Box className="section-content-indent">
                    Top Marc'er Rewards celebrates drivers who go the extra mile, sharing updates that protect fellow truckers and keep roads safer.
                  </Box>
                  <br />
                  <br />
                </Typography>

                <Typography className="navigation-description">
                  <strong>How It Works</strong>
                  <ul className="rewards-list">
                    <li><strong>Posting real-time parking updates</strong> helps others find safe spots faster.</li>
                    <li><strong>Reporting road hazards and closures</strong> keeps the community safe and informed.</li>
                    <li><strong>Sharing helpful tips</strong> improves life on the road for everyone.</li>
                  </ul>
                  <p className="rewards-note">
                    Points = cash in your pocket. <br />
                    The more you contribute, the more you earn.
                  </p>
                </Typography>

                <Typography className="navigation-description">
                  <strong>Monthly Regional Winners</strong>
                  <br />
                  <Box className="section-content-indent">
                    Each month, the top Marc'er in every U.S. region — NW, West, SW, SE, Mid-Atlantic, and NE — wins
                    <Box component="span" className="cash-reward-container">
                      <CashIcon className="floating-cash-icon" />
                      <strong className="floating-cash-amount">$200</strong>
                    </Box> in cash rewards.
                  </Box>
                </Typography>

                <Box sx={{ height: '2rem' }} />

                <Typography className="navigation-description">
                  <strong>Why It Matters</strong>
                  <br />
                  <Box className="section-content-indent">
                    Every update helps another driver travel with more confidence.
                    <br />
                    Together, we're building a community where truckers look out for one another, and get rewarded for it.
                  </Box>
                </Typography>
              </Box>
              <Box className="navigation-image-content">
                <div className="statistics-video-container">
                  <video 
                    ref={statisticsVideoRef}
                    className={`statistics-video ${isStatisticsVideoEnlarged ? 'enlarged' : ''}`}
                    loop
                    muted
                    autoPlay
                    playsInline
                    onClick={handleStatisticsVideoClick}
                    onMouseEnter={() => !isMobile() && setIsStatisticsVideoEnlarged(true)}
                    onMouseLeave={() => !isMobile() && setIsStatisticsVideoEnlarged(false)}
                  >
                    <source src="/videos/Statistics_Demo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  {isMobile() && !isStatisticsVideoEnlarged && (
                    <Typography className="video-instruction">
                      <em>(Click to enlarge)</em>
                    </Typography>
                  )}
                </div>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Navigation Feature Detail Section */}
        <Box 
          id="navigation"
          ref={navigationSectionRef}
          className={`navigation-feature-section ${isNavigationVisible ? 'animate' : ''}`}
        >
          <Container maxWidth="lg" className="navigation-content">
            <Box className="navigation-grid">
              <Box className="navigation-text-content">
                <Typography variant="h2" className="navigation-title">
                  Navigate with Confidence
                </Typography>
                <Typography className="navigation-description">
                  Marc'd puts powerful, truck-optimized GPS and trip planning right at your fingertips.
                  <br />
                  <br />
                </Typography>

                                  <Typography className="navigation-description">
                    <strong>Easily find:</strong>
                    <ul className="rewards-list">
                      <li><strong>Parking</strong></li>
                      <li><strong>Hazards</strong></li>
                      <li><strong>Weigh stations</strong></li>
                      <li><strong>Truck stops</strong></li>
                      <li><strong>Fuel stations</strong></li>
                      <li><strong>Repair shops</strong></li>
                    </ul>
                    <p className="rewards-note">
                      Wherever you are, whenever you need them.
                    </p>
                  </Typography>

                <Typography className="navigation-description">
                  Our smart navigation keeps you on safe, efficient routes—saving time, money, and stress on every trip.
                </Typography>
              </Box>
              <Box className="navigation-image-content">
                <img 
                  src={navigationImage} 
                  alt="Marc'd Navigation App Interface showing truck-optimized GPS with weigh stations, truck stops, and route planning"
                  className={`navigation-image ${isNavigationImageEnlarged ? 'enlarged' : ''}`}
                  onClick={handleNavigationImageClick}
                  style={{ cursor: 'pointer' }}
                />
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Real-time Parking Feature Detail Section */}
        <Box 
          id="parking"
          ref={parkingSectionRef}
          className={`navigation-feature-section ${isParkingVisible ? 'animate' : ''}`}
        >
          <Container maxWidth="lg" className="navigation-content">
            <Box className="navigation-grid">
              <Box className="navigation-text-content">
                <Typography variant="h2" className="navigation-title">
                  Real-time Parking Solutions
                </Typography>
                <Typography className="navigation-description">
                  Never waste time searching for parking again.
                </Typography>

                <Typography className="navigation-description">
                  Marc'd delivers <strong className="highlighted-text">live parking updates</strong> from fellow drivers, so you can find open spots <strong className="highlighted-text">before you arrive</strong>. Get the most current information on truck parking at:
                  <ul className="rewards-list">
                    <li><strong>Rest stops</strong></li>
                    <li><strong>Truck stops</strong></li>
                    <li><strong>Designated parking areas nationwide</strong></li>
                  </ul>
                </Typography>

                <Box sx={{ height: '1rem' }} />

                <Typography className="navigation-description">
                  <strong>Share & Earn</strong>
                  <br />
                  <Box className="section-content-indent">
                    Post your own parking updates to help other drivers—and earn Marc'er points along the way.
                    <br />
                    <br />
                    Every spot you report, whether open or full, makes the road better for all of us. Together, we're solving one of trucking's biggest challenges, <strong>one parking space at a time.</strong>
                  </Box>
                </Typography>
              </Box>
              <Box className="navigation-image-content">
                <img 
                  src={parkingImage} 
                  alt="Marc'd Real-time Parking App Interface showing available parking spots and community updates"
                  className={`navigation-image ${isNavigationImageEnlarged ? 'enlarged' : ''}`}
                  onClick={handleNavigationImageClick}
                  style={{ cursor: 'pointer' }}
                />
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Voice-Activated Controls Feature Detail Section */}
        <Box 
          id="voice-controls"
          ref={voiceControlsSectionRef}
          className={`navigation-feature-section ${isVoiceControlsVisible ? 'animate' : ''}`}
        >
          <Container maxWidth="lg" className="navigation-content">
            <Box className="navigation-grid">
              <Box className="navigation-text-content">
                <Typography variant="h2" className="navigation-title">
                  Voice-Activated Controls
                </Typography>
                <Typography className="navigation-description">
                  Stay focused on the road—Marc'd lets you control the app with just your voice.
                </Typography>
                <Typography className="navigation-description">
                  Use natural commands to:
                  <ul className="rewards-list">
                    <li><strong>Check parking availability</strong></li>
                    <li><strong>Report road or DOT activity</strong></li>
                    <li><strong>Request spotter assistance</strong></li>
                    <li><strong>Navigate safely, hands-free</strong></li>
                  </ul>
                </Typography>
                <Typography className="navigation-description">
                  <p className="rewards-note voice-commands-note">
                    <span className="just-say-text">Just say:</span>
                    <div className="command-examples">
                      <strong>"Hey Marc'd, find parking near me"</strong>
                      <br />
                      <div className="command-or">or</div>
                      <strong>"Report DOT activity ahead"</strong>
                    </div>
                  </p>
                </Typography>
                <Typography className="navigation-description">
                  Marc'd understands trucking lingo and works with your truck's audio system—even in noisy cabs—so you can stay connected without touching your phone.
                </Typography>
                <Box sx={{ height: '1rem' }} />
                <Typography className="navigation-description">
                  <strong>Drive smarter with voice controls made for life on the road.</strong>
                </Typography>
              </Box>
              <Box className="navigation-image-content">
                <Box className="voice-controls-icon-container">
                  <KeyboardVoiceIcon className="voice-controls-icon" />
                  <Box className="sound-waves">
                    <Box className="sound-wave wave-1"></Box>
                    <Box className="sound-wave wave-2"></Box>
                    <Box className="sound-wave wave-3"></Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Spotter Request Assistance Feature Detail Section */}
        <Box 
          id="spotter-request"
          ref={spotterSectionRef}
          className={`navigation-feature-section ${isSpotterVisible ? 'animate' : ''} ${isSpotterVideoEnlarged ? 'video-enlarged' : ''}`}
        >
          <Container maxWidth="lg" className="navigation-content">
            <Box className="navigation-grid">
              <Box className="navigation-text-content">
                <Typography variant="h2" className="navigation-title">
                  Spotter Request Assistance
                </Typography>
                <Typography className="navigation-description">
                  Even the best drivers need a second set of eyes!
                  <br />
                  <br />
                </Typography>
                <Typography className="navigation-description">
                  With Marc'd, you can request spotter help directly in the app when:
                  <ul className="rewards-list spotter-bullets">
                    <li><strong>Backing into tight docks</strong></li>
                    <li><strong>Navigating blindside angles</strong></li>
                    <li><strong>Parking in tough spots</strong></li>
                  </ul>
                </Typography>
                <Typography className="navigation-description">
                  Nearby drivers or location staff are alerted in real time and can step in to guide you—<strong>reducing stress and preventing costly mistakes.</strong>
                </Typography>
                <Box sx={{ height: '1rem' }} />
                <Typography className="navigation-description">
                  <strong>Help Others, Earn Rewards</strong>
                  <br />
                  Guide another driver and earn Marc'er points.
                  <br />
                  Get bonus points for spotting and backing assistance—it's our way of recognizing drivers who keep the road safer for everyone.
                </Typography>
              </Box>
              <Box className="navigation-image-content">
                <div className="spotter-video-container">
                  <video 
                    ref={spotterVideoRef}
                    className={`spotter-video ${isSpotterVideoEnlarged ? 'enlarged' : ''}`}
                    loop
                    muted
                    playsInline
                    autoPlay
                    onClick={handleSpotterVideoClick}
                    onMouseEnter={() => !isMobile() && setIsSpotterVideoEnlarged(true)}
                    onMouseLeave={() => !isMobile() && setIsSpotterVideoEnlarged(false)}
                    >
                      <source src="/videos/Requesting_Spotter_Demo.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  {isMobile() && !isSpotterVideoEnlarged && (
                    <Typography className="video-instruction">
                      <em>(Click to enlarge)</em>
                    </Typography>
                  )}
                </div>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Speed Monitoring Alerts Feature Detail Section */}
        <Box 
          id="speed-alerts"
          ref={speedAlertsSectionRef}
          className={`navigation-feature-section ${isSpeedAlertsVisible ? 'animate' : ''}`}
        >
          <Container maxWidth="lg" className="navigation-content">
            <Box className="navigation-grid">
              <Box className="navigation-text-content">
                <Typography variant="h2" className="navigation-title">
                  Smart Speed Monitoring
                </Typography>
                <Typography className="navigation-description">
                  Stay compliant and safe with Marc'd's intelligent speed alerts.
                </Typography>
                <Typography className="navigation-description">
                  Our system tracks speed limits in real time and alerts you when you're:
                  <ul className="rewards-list spotter-bullets">
                    <li><strong>Approaching a speed zone</strong></li>
                    <li><strong>Entering a construction or school zone</strong></li>
                    <li><strong>Exceeding posted limits</strong></li>
                  </ul>
                </Typography>
                <Box sx={{ height: '1rem' }} />
                <Typography className="navigation-description">
                  <strong>Smarter Alerts, Safer Driving</strong>
                  <br />
                  Marc'd syncs with your GPS and factors in:
                  <ul className="rewards-list spotter-bullets">
                    <li><strong>Your truck's specs</strong></li>
                    <li><strong>Your load type</strong></li>
                    <li><strong>Upcoming speed changes</strong></li>
                    <li><strong>Grade restrictions and special zones</strong></li>
                  </ul>
                </Typography>
                <Typography className="navigation-description">
                  Drive confidently, knowing Marc'd is helping you stay compliant—and keeping everyone on the road safer.
                </Typography>
              </Box>
              <Box className="navigation-image-content">
                <Box className="speed-alerts-icon-container">
                  <SpeedIcon className="speed-alerts-icon" />
                  <Box className="speed-waves">
                    <Box className="speed-wave wave-1"></Box>
                    <Box className="speed-wave wave-2"></Box>
                    <Box className="speed-wave wave-3"></Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* DOT/Police Alerts Feature Detail Section */}
        <Box 
          id="dot-police-alerts"
          ref={policeAlertsSectionRef}
          className={`navigation-feature-section ${isPoliceAlertsVisible ? 'animate' : ''} ${isVideoEnlarged ? 'video-enlarged' : ''}`}
        >
          <Container maxWidth="lg" className="navigation-content">
            <Box className="navigation-grid">
              <Box className="navigation-text-content">
                <Typography variant="h2" className="navigation-title">
                  DOT & Police Alerts
                </Typography>
                <Typography className="navigation-description">
                  Stay ahead with real-time updates from fellow drivers.
                </Typography>
                <Typography className="navigation-description">
                  Marc'd alerts you to:
                  <ul className="rewards-list spotter-bullets">
                    <li><strong>DOT inspection stations</strong></li>
                    <li><strong>Weigh station activity</strong></li>
                    <li><strong>Police presence along your route</strong></li>
                  </ul>
                </Typography>
                <Typography className="navigation-description">
                  Be ready for what's ahead—check your logs, secure your load, and avoid surprise delays.
                </Typography>
              </Box>
              <Box className="navigation-image-content">
                <div className="alerts-video-container">
                  <video 
                    ref={alertsVideoRef}
                    className={`alerts-video ${isVideoEnlarged ? 'enlarged' : ''}`}
                    loop
                    muted
                    playsInline
                    autoPlay
                    onClick={handleVideoClick}
                    onMouseEnter={() => !isMobile() && setIsVideoEnlarged(true)}
                    onMouseLeave={() => !isMobile() && setIsVideoEnlarged(false)}
                  >
                    <source src="/videos/Alerts_Demo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  {isMobile() && !isVideoEnlarged && (
                    <Typography className="video-instruction">
                      <em>(Click to enlarge)</em>
                    </Typography>
                  )}
                </div>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Favorite Places Feature Detail Section */}
        <Box 
          id="favorite-places"
          ref={favoritePlacesSectionRef}
          className={`navigation-feature-section ${isFavoritePlacesVisible ? 'animate' : ''}`}
        >
          <Container maxWidth="lg" className="navigation-content">
            <Box className="navigation-grid">
              <Box className="navigation-text-content">
                <Typography variant="h2" className="navigation-title">
                  Favorite Places
                </Typography>
                <Typography className="navigation-description">
                  Save time and streamline your routes with Marc'd's Favorite Places feature. Mark your most 
                  frequently visited locations — from regular pickup and delivery points to preferred truck stops, 
                  fuel stations, and rest areas. With one tap, you can navigate to any saved location without 
                  having to search or remember addresses every time.
                </Typography>
                <Typography className="navigation-description">
                  Organize your favorites by categories like "Fuel Stops," "Customers," "Rest Areas," and "Repair 
                  Shops" for quick access. Share your favorite spots with other drivers in the Marc'd community 
                  and discover new highly-rated locations along your routes. Your favorite places sync across all 
                  your devices, ensuring your essential locations are always at your fingertips.
                </Typography>
              </Box>
              <Box className="navigation-image-content">
                <Box className="favorite-places-icon-container">
                  <FavoriteIcon className="favorite-places-icon" />
                  <Box className="favorite-hearts">
                    <Box className="favorite-heart heart-1"></Box>
                    <Box className="favorite-heart heart-2"></Box>
                    <Box className="favorite-heart heart-3"></Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Feature Request Feature Detail Section */}
        <Box 
          id="feature-request"
          ref={featureRequestSectionRef}
          className={`navigation-feature-section ${isFeatureRequestVisible ? 'animate' : ''} ${isFeatureRequestVideoEnlarged ? 'video-enlarged' : ''}`}
        >
          <Container maxWidth="lg" className="navigation-content">
            <Box className="navigation-grid">
              <Box className="navigation-text-content">
                <Typography variant="h2" className="navigation-title">
                  Feature Request
                </Typography>
                <Typography className="navigation-description">
                  Your voice matters! At Marc'd, we believe the best ideas come from the drivers who live on the road every day. 
                  You're empowered to make suggestions and recommendations for features that would make your trucking experience 
                  safer, more efficient, and more rewarding. Whether it's a new alert system, improved navigation features, or 
                  innovative ways to connect with fellow drivers, we want to hear from you.
                </Typography>
                <Typography className="navigation-description">
                  Marc'd is built by truckers, for truckers. Every feature request is carefully reviewed by our development team, 
                  and the most impactful suggestions become part of our roadmap. Your real-world experience and insights help us 
                  create solutions that truly matter. Together, we're building the ultimate trucking companion app.
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    className="feature-request-button"
                    onClick={() => window.location.href = '/contactus'}
                  >
                    Contact Us
                  </Button>
                </Box>
              </Box>
              <Box className="navigation-image-content">
                <div className="feature-request-video-container">
                  <video 
                    ref={featureRequestVideoRef}
                    className={`feature-request-video ${isFeatureRequestVideoEnlarged ? 'enlarged' : ''}`}
                    loop
                    muted
                    playsInline
                    autoPlay
                    onClick={handleFeatureRequestVideoClick}
                    onMouseEnter={() => !isMobile() && setIsFeatureRequestVideoEnlarged(true)}
                    onMouseLeave={() => !isMobile() && setIsFeatureRequestVideoEnlarged(false)}
                  >
                    <source src="/videos/Feature_Request_Demo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  {isMobile() && !isFeatureRequestVideoEnlarged && (
                    <Typography className="video-instruction">
                      <em>(Click to enlarge)</em>
                    </Typography>
                  )}
                </div>
              </Box>
            </Box>
          </Container>
        </Box>
      </Container>

      {/* Scroll Button */}
      <Box 
        className={`scroll-to-top-button ${isFirstViewport ? 'first-viewport' : 'other-viewport'}`}
        onClick={handleScrollAction}
      >
        {isFirstViewport ? <ArrowDownIcon /> : <ArrowUpIcon />}
      </Box>
    </Box>
  );
}

export default Features;