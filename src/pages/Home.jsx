// src/pages/home.jsx
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { KeyboardVoice as KeyboardVoiceIcon, Speed as SpeedIcon, LocalParking as ParkingIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence, useTime, useTransform, useSpring } from 'framer-motion';
import '../styles/home.css';

import Main_Hero_Img from '../assets/App_Marc-d_Main_Page.png';
import truckParkingVideo from '../assets/Truck_Parking_Home_Page.mp4';
import healthFoodImg from '../assets/Health_Food.png';
import truckIcon from '../assets/Truck_Icon.png';

function home() {
  const navigate = useNavigate();
  const aboutRef = useRef(null);
  const waitlistRef = useRef(null);
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  
  // Action words for cycling animation
  const actionWords = ['Reward', 'Empower', 'Support', 'Appreciate', 'Value'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

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

  // Cycle through action words every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % actionWords.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [actionWords.length]);

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

  // Toggle card expansion
  const toggleCard = (cardIndex) => {
    setExpandedCard(expandedCard === cardIndex ? null : cardIndex);
  };

  // Handle click outside to collapse cards
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.fact-item')) {
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
          }
        });
      },
      observerOptions
    );

    // Observe all sections
    if (aboutRef.current) {
      aboutObserver.observe(aboutRef.current);
    }

    return () => {
      if (aboutRef.current) {
        aboutObserver.unobserve(aboutRef.current);
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

  return (
    <Box className="home-page-container">
      {/* home Hero Section - Full Viewport */}
      <Box className="home-hero-section" ref={aboutRef}>
        <Box className="home-hero-content">
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
              From parking solutions to real-time updates and a supportive driver community, Marc'd stands beside you on every mile. 
              Because trucking isn't just work — it's a way of life. It keeps this country moving, and you deserve a partner that moves with you.
            </Typography>
            <Box className="hero-button-container" sx={{ position: 'relative' }}>
              <motion.div
                className="absolute -inset-[1.5px] rounded-md"
                style={{
                  position: 'absolute',
                  inset: '-1px',
                  borderRadius: '8px',
                  background: rotatingBg,
                  filter: pulsingBg,
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
          </Box>
          <Box className="home-hero-image">
            <img 
              src={Main_Hero_Img} 
              alt="Image of Marc'd app" 
              className={`home-main-image ${isAboutVisible ? 'animate' : ''}`}
            />
          </Box>
        </Box>
        
        {/* Down Arrow to Scroll to Waitlist */}
        <Box className="scroll-down-arrow" onClick={scrollToWaitlist}>
          <FaChevronDown className="arrow-icon" />
        </Box>
      </Box>

      {/* Did You Know Section */}
      <Box className="did-you-know-section">
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
      <Box className="marcd-solutions-section">
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
            <Box className="solution-item">
              <ParkingIcon className="solution-icon" />
              <Typography className="solution-title">Real-time parking</Typography>
              <Typography className="solution-text">
                Shows available safe spots right now, so you stop wasting hours hunting.
              </Typography>
            </Box>

            <Box className="solution-item">
              <Typography className="solution-icon">🥗</Typography>
              <Typography className="solution-title">Wellness support</Typography>
              <Typography className="solution-text">
                Locates cleaner stops, healthier food—even halal options—so you can take care of yourself on the road.
              </Typography>
            </Box>

            <Box className="solution-item">
              <SpeedIcon className="solution-icon" />
              <Typography className="solution-title">Speed alerts & compliance tools</Typography>
              <Typography className="solution-text">
                Helps you avoid CSA violations and protect your safety record.
              </Typography>
            </Box>

            <Box className="solution-item">
              <KeyboardVoiceIcon className="solution-icon" />
              <Typography className="solution-title">Voice-activated & hands-free</Typography>
              <Typography className="solution-text">
                Keep eyes on the road while updating parking or checking conditions.
              </Typography>
            </Box>

            <Box className="solution-item">
              <Typography className="solution-icon">🤝</Typography>
              <Typography className="solution-title">Community updates</Typography>
              <Typography className="solution-text">
                Drivers help each other with parking, hazards, or spotting—and earn rewards for it.
              </Typography>
            </Box>
          </Box>

          <Typography className="tagline">
            Because "The journey is easier when it's Marc'd."
          </Typography>
        </Box>
      </Box>

      {/* Join Waitlist Section - Different Background */}
      <Box className="waitlist-section" ref={waitlistRef}>
        <Box className="waitlist-content">
          <Typography variant="h3" className="waitlist-title">
            Join the Waitlist
          </Typography>
          <Typography className="waitlist-description">
            Be the first to experience Marc'd when we launch. Enter your email to get notified.
          </Typography>
          
          <Box component="form" onSubmit={handleWaitlistSubmit} className="waitlist-form">
            <Box className="email-input-container">
              <TextField
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email address"
                variant="outlined"
                error={!!emailError}
                helperText={emailError}
                className="email-input"
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                className="join-button"
                disabled={!email || !!emailError}
              >
                Join
              </Button>
            </Box>
            
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
