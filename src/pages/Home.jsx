// src/pages/home.jsx
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Box, Typography, TextField, Button, IconButton, Tooltip } from '@mui/material';
import { KeyboardVoice as KeyboardVoiceIcon, Speed as SpeedIcon, LocalParking as ParkingIcon, ExpandMore as ExpandMoreIcon, ChevronLeft, ChevronRight, Update as UpdateIcon, People as PeopleIcon } from '@mui/icons-material';
import { FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence, useTime, useTransform, useSpring } from 'framer-motion';
import '../styles/home.css';

import Main_Hero_Img from '../assets/App_Marc-d_Main_Page.png';
import Landing_Page_Img from '../assets/App_Landing_Page.png';
import Statistics_Img from '../assets/App_Statistics.png';
import Parking_Img from '../assets/App_Parking.png';
import Places_Img from '../assets/App_Marc\'d_Places.png';
import Navigation_Img from '../assets/App_Navigation.png';
import Alerts_Img from '../assets/App_Alerts_Image.png';
import truckParkingVideo from '../assets/Truck_Parking_Home_Page.mp4';
import healthFoodImg from '../assets/Health_Food.png';
import truckIcon from '../assets/Truck_Icon.png';
import launchingSoonImg from '../assets/Launching_Soon.png';
import socialProofImg from '../assets/Social_Proof.png';

function home() {
  const navigate = useNavigate();
  const aboutRef = useRef(null);
  const waitlistRef = useRef(null);
  const didYouKnowRef = useRef(null);
  const solutionsRef = useRef(null);
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [isDidYouKnowVisible, setIsDidYouKnowVisible] = useState(false);
  const [isSolutionsVisible, setIsSolutionsVisible] = useState(false);
  const [isWaitlistVisible, setIsWaitlistVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [currentSection, setCurrentSection] = useState('hero');
  
  // Action words for cycling animation
  const actionWords = ['Reward', 'Empower', 'Support', 'Appreciate', 'Value'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // Hero image cycling animation
  const heroImages = [
    Main_Hero_Img, 
    Landing_Page_Img, 
    Statistics_Img, 
    Alerts_Img,
    Parking_Img, 
    Places_Img, 
    Navigation_Img
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [carouselHovered, setCarouselHovered] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const autoRotateIntervalRef = useRef(null);

  // Animated border setup following tutorial
  const time = useTime();
  const rotate = useTransform(time, [0, 3000], [0, 360], {
    clamp: false,
  });
  const rotatingBg = useTransform(rotate, (r) => {
    return `conic-gradient(from ${r}deg,rgb(222, 3, 3), #ff0000, #be0303d1, #c0c0c0, #a8a8a8, #be0303)`;
  });

  // Add pulsing animation
  const pulse = useSpring(0, { damping: 0, mass: 5, stiffness: 10 });
  const pulsingBg = useTransform(pulse, (r) => {
    return `blur(${r}px)`;
  });

  // Auto-rotate carousel and action words every 8 seconds
  useEffect(() => {
    if (isAutoRotating && !carouselHovered) {
      autoRotateIntervalRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % actionWords.length);
      }, 8000);
    } else {
      if (autoRotateIntervalRef.current) {
        clearInterval(autoRotateIntervalRef.current);
        autoRotateIntervalRef.current = null;
      }
    }

    return () => {
      if (autoRotateIntervalRef.current) {
        clearInterval(autoRotateIntervalRef.current);
        autoRotateIntervalRef.current = null;
      }
    };
  }, [isAutoRotating, carouselHovered, heroImages.length, actionWords.length]);

  // Manual image navigation functions
  const goToPrevImage = () => {
    setIsAutoRotating(false);
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1
    );
  };

  const goToNextImage = () => {
    setIsAutoRotating(false);
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % heroImages.length
    );
  };

  // Touch/swipe handling for mobile
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNextImage();
    } else if (isRightSwipe) {
      goToPrevImage();
    }
  };

  // Handle carousel hover events
  const handleCarouselMouseEnter = () => {
    setCarouselHovered(true);
  };

  const handleCarouselMouseLeave = () => {
    setCarouselHovered(false);
  };

  // Handle manual navigation clicks
  const handleManualNavigation = (direction) => {
    setIsAutoRotating(false);
    if (direction === 'next') {
      goToNextImage();
    } else {
      goToPrevImage();
    }
  };

  // Handle indicator clicks
  const handleIndicatorClick = (index) => {
    setIsAutoRotating(false);
    setCurrentImageIndex(index);
  };

  // Get descriptive alt text for each image
  const getImageAltText = (index) => {
    const altTexts = [
      "Marc'd app main page - Dashboard view with trucking features",
      "Marc'd app landing page - Welcome and onboarding screen", 
      "Marc'd app statistics - Performance analytics and tracking data",
      "Marc'd app alerts - DOT alerts and safety notifications",
      "Marc'd app parking - Truck parking finder and availability",
      "Marc'd app places - Recommended truck-friendly locations",
      "Marc'd app navigation - GPS and route planning features"
    ];
    return altTexts[index] || `Marc'd app view ${index + 1}`;
  };

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email input change
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    if (value && !validateEmail(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  // Handle waitlist submission
  const handleWaitlistSubmit = (e) => {
    e.preventDefault();
    
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // TODO: Add API call to submit email to waitlist
    console.log('Submitting email to waitlist:', email);
    setIsSubmitted(true);
    setEmail('');
    setEmailError('');
    
    // Reset success message after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  };

  // Smooth scroll to waitlist section
  const scrollToWaitlist = () => {
    waitlistRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Expose scrollToWaitlist globally for navbar access
  useEffect(() => {
    window.scrollToWaitlist = scrollToWaitlist;
    return () => {
      delete window.scrollToWaitlist;
    };
  }, []);

  // Scroll to waitlist if hash is present on mount
  useEffect(() => {
    if (window.location.hash === '#waitlist') {
      setTimeout(() => {
        waitlistRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100); // Delay to ensure DOM is ready
    }
  }, []);

  // Smooth scroll to next section (Did You Know)
  const scrollToNextSection = () => {
    didYouKnowRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Smooth scroll to top (Hero section)
  const scrollToTop = () => {
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Dynamic scroll function based on current section
  const handleDynamicScroll = () => {
    switch (currentSection) {
      case 'hero':
        didYouKnowRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'didYouKnow':
        solutionsRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'solutions':
        waitlistRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'waitlist':
        aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        didYouKnowRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Toggle card expansion
  const toggleCard = (cardIndex) => {
    setExpandedCard(expandedCard === cardIndex ? null : cardIndex);
  };

  // Handle click outside to collapse cards
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.fact-item') && !event.target.closest('.solution-item')) {
        setExpandedCard(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.3, // Trigger when 30% of the section is visible
      rootMargin: '0px 0px -100px 0px' // Trigger slightly before the section is fully visible
    };

    // About Us section observer
    const aboutObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsAboutVisible(true);
            setCurrentSection('hero');
          }
        });
      },
      observerOptions
    );

    // Did You Know section observer
    const didYouKnowObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsDidYouKnowVisible(true);
            setCurrentSection('didYouKnow');
          }
        });
      },
      observerOptions
    );

    // Solutions section observer
    const solutionsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsSolutionsVisible(true);
            setCurrentSection('solutions');
          }
        });
      },
      observerOptions
    );

    // Waitlist section observer
    const waitlistObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsWaitlistVisible(true);
            setCurrentSection('waitlist');
          }
        });
      },
      observerOptions
    );

    // Observe all sections
    if (aboutRef.current) {
      aboutObserver.observe(aboutRef.current);
    }
    if (didYouKnowRef.current) {
      didYouKnowObserver.observe(didYouKnowRef.current);
    }
    if (solutionsRef.current) {
      solutionsObserver.observe(solutionsRef.current);
    }
    if (waitlistRef.current) {
      waitlistObserver.observe(waitlistRef.current);
    }

    return () => {
      if (aboutRef.current) {
        aboutObserver.unobserve(aboutRef.current);
      }
      if (didYouKnowRef.current) {
        didYouKnowObserver.unobserve(didYouKnowRef.current);
      }
      if (solutionsRef.current) {
        solutionsObserver.unobserve(solutionsRef.current);
      }
      if (waitlistRef.current) {
        waitlistObserver.unobserve(waitlistRef.current);
      }
    };
  }, []);

  // Animation variants for the action words
  const wordVariants = {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.8
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      scale: 0.8,
      transition: {
        duration: 0.4,
        ease: "easeIn"
      }
    }
  };

  // Animation variants for the hero image carousel (no exit animation)
  const imageVariants = {
    initial: {
      opacity: 0,
      x: 50,
      scale: 0.98
    },
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    exit: {
      opacity: 0,
      x: -50,
      scale: 0.98,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <Box className="home-page-container">
      {/* Home Hero Section - Full Viewport */}
      <Box className="home-hero-section" ref={aboutRef}>
        {/* Left Column - Text Content */}
        <Box className="home-hero-text">
          <Typography 
            variant="h1" 
            className={`home-hero-headline ${isAboutVisible ? 'animate' : ''}`}
          >
            Built to
            <br />
            <Box component="span" style={{ display: 'block', minHeight: '1.2em', position: 'relative' }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={actionWords[currentWordIndex]}
                  variants={wordVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  style={{
                    display: 'block',
                    background: 'linear-gradient(to left, rgb(235, 4, 4), rgb(202, 2, 2), rgb(220, 217, 217), rgb(212, 2, 9))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontWeight: 'bold'
                  }}
                >
                  {actionWords[currentWordIndex]}
                </motion.span>
              </AnimatePresence>
            </Box>
            truckers.
          </Typography>
          <Typography className="home-hero-description">
            Wherever the road takes you, Marc'd is there! Trucking isn't just work; it's a way of life. It keeps America moving, and you deserve a partner that moves with you.
          </Typography>
          <motion.div
            className="home-hero-bullets"
            initial={{ opacity: 0, x: -50 }}
            animate={{ 
              opacity: isAboutVisible ? 1 : 0, 
              x: isAboutVisible ? 0 : -50 
            }}
            transition={{ 
              duration: 0.8, 
              ease: "easeOut",
              delay: 0.3
            }}
          >
            <Box className="hero-bullet">
              <ParkingIcon className="hero-bullet-icon" />
              <span>parking</span>
            </Box>
            <Box className="hero-bullet">
              <UpdateIcon className="hero-bullet-icon" />
              <span>updates</span>
            </Box>
            <Box className="hero-bullet">
              <PeopleIcon className="hero-bullet-icon" />
              <span>community</span>
            </Box>
          </motion.div>
          <Box className="hero-button-container" sx={{ position: 'relative' }}>
            <motion.div
              className="absolute -inset-[1.5px] rounded-md"
              style={{
                position: 'absolute',
                inset: '-1px',
                borderRadius: '8px',
                background: rotatingBg,
                zIndex: 0,
                filter: 'blur(5px)',
              }}
            />
            <Button 
              className="hero-button"
              onClick={scrollToWaitlist}
            >
              Join Waitlist
            </Button>
          </Box>
          <motion.div
            className="social-proof-container"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isAboutVisible ? 1 : 0, y: isAboutVisible ? 0 : 30 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.7 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'left', marginTop: '1rem' }}
          >
            <img 
              src={socialProofImg} 
              alt="Social proof - trusted by truckers" 
              className="social-proof-image"
            />
            <Box className="social-proof-text">
              Stephen L. and 200+ others have already joined.
            </Box>
          </motion.div>
        </Box>

        {/* Right Column - Image Carousel */}
        <Box className="home-hero-image-carousel">
          {/* Left Navigation Arrow (Desktop) */}
          <Tooltip title={<span className="carousel-tooltip">Click for Previous Image</span>} placement="left" arrow classes={{ popper: 'carousel-tooltip-popper' }}>
            <IconButton 
              className="carousel-nav-left"
              onClick={() => handleManualNavigation('prev')}
              aria-label="Previous image"
            >
              <ChevronLeft />
            </IconButton>
          </Tooltip>

          {/* Image Container with Swipe Support */}
          <Box 
            className="carousel-image-container"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onClick={() => handleManualNavigation('next')}
            onMouseEnter={handleCarouselMouseEnter}
            onMouseLeave={handleCarouselMouseLeave}
            style={{ cursor: 'pointer' }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={heroImages[currentImageIndex]}
                alt={getImageAltText(currentImageIndex)}
                className={`home-main-image ${isAboutVisible ? 'animate' : ''}`}
                variants={imageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: '100%',
                  objectFit: 'contain'
                }}
              />
            </AnimatePresence>
            {/* Image Indicators */}
            <Box className="carousel-indicators">
              {heroImages.map((_, index) => (
                <Box
                  key={index}
                  className={`carousel-dot ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => handleIndicatorClick(index)}
                />
              ))}
            </Box>
          </Box>

          {/* Right Navigation Arrow (Desktop) */}
          <Tooltip title={<span className="carousel-tooltip">Click for Next Image</span>} placement="right" arrow classes={{ popper: 'carousel-tooltip-popper' }}>
            <IconButton 
              className="carousel-nav-right"
              onClick={() => handleManualNavigation('next')}
              aria-label="Next image"
            >
              <ChevronRight />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Dynamic Scroll Arrow */}
        <Box 
          className={`scroll-down-arrow ${currentSection === 'waitlist' ? 'back-to-top' : ''}`}
          onClick={handleDynamicScroll}
          tabIndex={0}
        >
          <div className="scroll-arrow-message">
            {currentSection === 'waitlist' ? 'Back to top' : 'Next page'}
          </div>
          <FaChevronDown 
            className={`arrow-icon ${currentSection === 'waitlist' ? 'rotated' : ''}`} 
          />
        </Box>
      </Box>

      {/* Did You Know Section */}
      <Box className={`did-you-know-section ${isDidYouKnowVisible ? 'visible' : ''}`} ref={didYouKnowRef}>
        <div className="video-overlay"></div>
        <video 
          src={truckParkingVideo} 
          autoPlay 
          loop 
          muted 
          className="background-video"
        />
        <Box className="did-you-know-content">
          <Typography variant="h3" className="did-you-know-title">
            <img src={truckIcon} alt="Truck" className="truck-icon" />
            Did You Know?
          </Typography>
          
          <Box className="facts-grid">
            {[
              {
                stat: "100%",
                text: "truckers rely on each other.",
                detail: "Helping spot into tight docks or sharing where to park is often all they have."
              },
              {
                stat: "98%",
                text: "struggle to find safe parking.",
                detail: "Only 1 authorized spot exists for every 11 trucks, costing drivers up to $5,500 a year in wasted time and fuel."
              },
              {
                stat: "88%",
                text: "have at least one cardiometabolic risk.",
                detail: "Hypertension, smoking, and obesity are common—jeopardizing health and careers."
              },
              {
                stat: "69%",
                text: "are obese—twice the U.S. average.",
                detail: "Long hours, little exercise, and unhealthy food access drive this crisis."
              },
              {
                stat: "1.7×",
                text: "higher risk of heart disease.",
                detail: "Nearly 50% have cardiovascular conditions, compared to just 30% of the general population."
              },
              {
                stat: "53%",
                text: "of DOT violations are preventable.",
                detail: "Parking illegally or rushing to meet deadlines leads to costly CSA points, insurance hikes, and job risks."
              },
              {
                stat: "image",
                statImage: healthFoodImg,
                text: "healthy or halal-prepared meals are scarce.",
                detail: "Most rely on quick, unhealthy stops simply to keep moving."
              },
              {
                stat: "icon",
                statIcon: SpeedIcon,
                text: "speeding is a top safety violation.",
                detail: "Drivers often exceed limits without realizing, putting safety scores—and lives—at risk."
              }
            ].map((fact, index) => (
              <Box 
                key={index} 
                className={`fact-item ${expandedCard === index ? 'expanded' : ''}`}
                onClick={() => toggleCard(index)}
                title={expandedCard === index ? "" : "Click for more details"}
              >
                <Box className="fact-header">
                  <Box className="fact-main-content">
                    {fact.stat && fact.stat !== "image" && fact.stat !== "icon" && (
                      <Typography className="fact-stat">{fact.stat}</Typography>
                    )}
                    {fact.stat === "image" && fact.statImage && (
                      <img src={fact.statImage} alt="Healthy food" className="fact-stat-image" />
                    )}
                    {fact.stat === "icon" && fact.statIcon && (
                      <fact.statIcon className="fact-stat-icon" />
                    )}
                    <Typography className="fact-text">
                      {fact.text}
                    </Typography>
                  </Box>
                  <motion.div
                    className={`expand-arrow ${expandedCard === index ? 'expanded' : ''}`}
                    animate={{ 
                      rotate: expandedCard === index ? 90 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path 
                        d="M9 18l6-6-6-6" 
                        stroke="currentColor" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                      <path 
                        d="M5 18l6-6-6-6" 
                        stroke="currentColor" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                </Box>
                <AnimatePresence>
                  {expandedCard === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="fact-detail-container"
                    >
                      <Typography className="fact-detail">
                        {fact.detail}
                      </Typography>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
                          ))}
          </Box>
        </Box>
      </Box>

      {/* Marc'd Solutions Section */}
      <Box className={`marcd-solutions-section ${isSolutionsVisible ? 'visible' : ''}`} ref={solutionsRef}>
        <div className="video-overlay"></div>
        <video 
          src={truckParkingVideo} 
          autoPlay 
          loop 
          muted 
          className="background-video"
        />
        <Box className="marcd-solutions-content">
          <Typography variant="h3" className="solutions-title">
            ✅ How Marc'd Solves These Problems
          </Typography>
          
          <Box className="solutions-grid">
            {[
              {
                icon: <ParkingIcon className="solution-stat-icon" />,
                title: "Real-time parking",
                text: "Shows available safe spots right now, so you stop wasting hours hunting.",
                detail: "Our community-driven parking system provides live updates from fellow drivers, helping you find open spots before you even arrive. No more circling truck stops or parking illegally—save time, fuel, and avoid violations."
              },
              {
                icon: <img src={healthFoodImg} alt="Healthy food" className="solution-stat-image" />,
                title: "Wellness support",
                text: "Locates cleaner stops, healthier food—even halal options—so you can take care of yourself on the road.",
                detail: "Find truck stops with healthy meal options, clean facilities, and dietary-specific choices including halal and vegetarian options. Your health matters, and we help you maintain it while on the road."
              },
              {
                icon: <SpeedIcon className="solution-stat-icon" />,
                title: "Speed alerts & compliance tools",
                text: "Helps you avoid CSA violations and protect your safety record.",
                detail: "Real-time speed monitoring and DOT compliance alerts help you maintain a clean driving record. Avoid costly violations, insurance hikes, and protect your livelihood with proactive safety tools."
              },
              {
                icon: <KeyboardVoiceIcon className="solution-stat-icon" />,
                title: "Voice-activated & hands-free",
                text: "Keep eyes on the road while updating parking or checking conditions.",
                detail: "Complete hands-free operation means you can report conditions, check parking, and get navigation updates without ever taking your hands off the wheel or eyes off the road."
              },
              {
                icon: <Typography className="solution-stat-emoji">🤝</Typography>,
                title: "Community updates",
                text: "Drivers help each other with parking, hazards, or spotting—and earn rewards for it.",
                detail: "Join a supportive community where drivers look out for each other. Share parking updates, road conditions, and spotting assistance while earning Marc'er points that convert to real cash rewards."
              }
            ].map((solution, index) => (
              <Box 
                key={index} 
                className={`solution-item ${expandedCard === index + 8 ? 'expanded' : ''}`}
                onClick={() => toggleCard(index + 8)}
                title={expandedCard === index + 8 ? "" : "Click for more details"}
              >
                <Box className="solution-header">
                  <Box className="solution-main-content">
                    {solution.icon}
                    <Typography className="solution-text">
                      {solution.text}
                    </Typography>
                  </Box>
                  <motion.div
                    className={`expand-arrow ${expandedCard === index + 8 ? 'expanded' : ''}`}
                    animate={{ 
                      rotate: expandedCard === index + 8 ? 90 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path 
                        d="M9 18l6-6-6-6" 
                        stroke="currentColor" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                      <path 
                        d="M5 18l6-6-6-6" 
                        stroke="currentColor" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                </Box>
                <AnimatePresence>
                  {expandedCard === index + 8 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="solution-detail-container"
                    >
                      <Typography className="solution-detail">
                        {solution.detail}
                      </Typography>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
                          ))}
          </Box>

          <Typography className="tagline">
            Because "The journey is easier when it's Marc'd."
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Button
              variant="outlined"
              size="small"
              sx={{
                mt: 2,
                color: '#be0303',
                borderColor: '#be0303',
                fontWeight: 600,
                borderRadius: '20px',
                textTransform: 'none',
                background: 'rgba(255, 255, 255, 0.48)',
                '&:hover': {
                  background: 'rgba(190,3,3,0.08)',
                  borderColor: '#be0303',
                  color: '#be0303',
                },
              }}
              onClick={() => navigate('/features')}
            >
              See Features
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Join Waitlist Section - Different Background */}
      <Box id="waitlist" className={`waitlist-section ${isWaitlistVisible ? 'visible' : ''}`} ref={waitlistRef}>
        <Box className="waitlist-content">
          <Typography variant="h3" className="waitlist-title">
            Join the Waitlist
          </Typography>
          <Box className="launching-soon-container">
            <img 
              src={launchingSoonImg} 
              alt="Launching Soon" 
              className="launching-soon-image"
            />
          </Box>
          <Box className="perks-section">
            <div className="perks-title-container">
              <h2 className="perks-title">
                Get early access, exclusive perks, and special launch rewards.
              </h2>
              <span className="confetti-container">
                <span className="confetti">🎉</span>
                <span className="confetti">✨</span>
                <span className="confetti">🎊</span>
                <span className="confetti">⭐</span>
                <span className="confetti">🎁</span>
              </span>
            </div>
          </Box>
          <Typography className="waitlist-description">
            Be the first to experience Marc'd when we launch. Enter your email to get notified and receive the latest updates.
          </Typography>
          
          <Box component="form" onSubmit={handleWaitlistSubmit} className="waitlist-form">
            <Box className="email-input-wrapper">
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email address"
                className="email-input-field"
              />
              <button
                type="submit"
                className="join-button"
                disabled={!email || !!emailError}
              >
                Join
              </button>
            </Box>
            {emailError && (
              <Typography className="error-message">
                {emailError}
              </Typography>
            )}
            
            {isSubmitted && (
              <Typography className="success-message">
                🎉 Thank you! You've been added to our waitlist.
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default home;