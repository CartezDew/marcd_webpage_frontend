// src/pages/home.jsx
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/home.css';

import Main_Hero_Img from '../assets/App_Marc-d_Main_Page.png';

function home() {
  const navigate = useNavigate();
  const aboutRef = useRef(null);
  const waitlistRef = useRef(null);
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Action words cycling functionality
  const actionWords = ['Reward','Empower', 'Support', 'Acknowledge','Thank', 'Appreciate', 'Value'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % actionWords.length);
    }, 3000);

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
              Marc'd is built to&nbsp;
              <span className="action-word-container">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={actionWords[currentWordIndex]}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.30 }}
                    className="action-word"
                  >
                    {actionWords[currentWordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
              &nbsp;truckers.
            </Typography>
            <Typography className="home-hero-description">
              From parking solutions to real-time updates and a supportive driver community, Marc'd stands beside you on every mile. 
              Because trucking isn't just work — it's a way of life. It keeps this country moving, and you deserve a partner that moves with you.
            </Typography>
            <Button className="hero-button">
              Join Waitlist
            </Button>
          </Box>
          <Box className="home-hero-image">
            <img 
              src={Main_Hero_Img} 
              alt="Happy truck drivers using Marc'd platform" 
              className={`home-main-image ${isAboutVisible ? 'animate' : ''}`}
            />
          </Box>
        </Box>
        
        {/* Down Arrow to Scroll to Waitlist */}
        <Box className="scroll-down-arrow" onClick={scrollToWaitlist}>
          <FaChevronDown className="arrow-icon" />
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
