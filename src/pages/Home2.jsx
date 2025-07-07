// src/pages/Home2.jsx
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { FaChevronDown } from 'react-icons/fa';
import '../styles/home2.css';

import Main_Hero_Img from '../assets/App_Marc-d_Main_Page.png';

function Home2() {
  const navigate = useNavigate();
  const aboutRef = useRef(null);
  const waitlistRef = useRef(null);
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      {/* Home2 Hero Section - Full Viewport */}
      <Box className="home-hero-section" ref={aboutRef}>
        <Box className="home-hero-content">
          <Box className="home-hero-text">
            <Typography 
              variant="h2" 
              className={`home-hero-headline ${isAboutVisible ? 'animate' : ''}`}
            >
              About Us
            </Typography>
            <Typography className="home-hero-description">
              Marc'd is a technology platform built from a son's tribute to his father—and a vision to uplift every trucker with tools, community, and recognition they've long gone without.
            </Typography>
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

export default Home2;
