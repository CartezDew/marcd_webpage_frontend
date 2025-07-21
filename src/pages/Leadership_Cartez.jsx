// src/pages/Leadership_Cartez.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  IconButton 
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import cartezImg from '../assets/CartezPitchDeck.jpg';
import linkedinIcon from '../assets/linkedin_icon.png';
import '../styles/leadership.css';

function Leadership_Cartez() {
  const navigate = useNavigate();
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showBold, setShowBold] = useState(false);
  const [hasHover, setHasHover] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isBioVisible, setIsBioVisible] = useState(false);
  const [isBackButtonVisible, setIsBackButtonVisible] = useState(false);
  const bioRef = useRef(null);
  const backButtonRef = useRef(null);

  const fullText = "Software Engineer | U.S. Marine Veteran | Former Owner-Operator";

  const handleLinkedInClick = () => {
    window.open(import.meta.env.VITE_CARTEZ_LINKEDIN_URL, '_blank');
  };

  const handleBackClick = () => {
    navigate('/our-story');
  };

  // Detect hover capability and screen size
  useEffect(() => {
    const checkHoverCapability = () => {
      setHasHover(window.matchMedia('(hover: hover)').matches);
    };
    
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkHoverCapability();
    checkScreenSize();
    window.addEventListener('resize', checkHoverCapability);
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkHoverCapability);
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Bio animation observer
  useEffect(() => {
    const bioObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsBioVisible(true);
          }
        });
      },
      {
        threshold: 0.05, // Trigger when 5% of the bio section is visible
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const backButtonObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add a delay to ensure it triggers after the bio animation completes
            setTimeout(() => {
              setIsBackButtonVisible(true);
            }, 800); // 0.8s delay to match the bio animation duration
          }
        });
      },
      {
        threshold: 0.05, // Trigger when 5% of the back button section is visible
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (bioRef.current) {
      bioObserver.observe(bioRef.current);
    }

    if (backButtonRef.current) {
      backButtonObserver.observe(backButtonRef.current);
    }

    return () => {
      if (bioRef.current) {
        bioObserver.unobserve(bioRef.current);
      }
      if (backButtonRef.current) {
        backButtonObserver.unobserve(backButtonRef.current);
      }
    };
  }, []);
  // Typewriter effect - disabled at 960px and below
  useEffect(() => {
    const isSmallScreen = window.innerWidth <= 960;
    
    if (isSmallScreen) {
      // For small screens, show full text immediately
      setDisplayedText(fullText);
      setIsTypingComplete(true);
      setShowBold(false);
    } else {
      // For larger screens, use typewriter effect
    const startTyping = setTimeout(() => {
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex < fullText.length) {
          setDisplayedText(fullText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTypingComplete(true);
          
          // Show bold for 1 second, then revert
          setTimeout(() => {
            setShowBold(true);
            setTimeout(() => {
              setShowBold(false);
            }, 1000);
          }, 200);
        }
      }, 50); // Typing speed (50ms per character)

      return () => clearInterval(typingInterval);
    }, 3000); // Start typing after 3 seconds

    return () => clearTimeout(startTyping);
    }
  }, [fullText]);

  return (
    <Box className="leadership-profile-container">
      {/* Navigation Breadcrumb */}
      <Container maxWidth="lg" className="profile-container">
        <Box className="profile-layout">
          {/* Left Column - Profile Card */}
          <Box className="profile-card-section">
            <Box className="profile-card">
              <Box 
                className="profile-image-container"
                onClick={!hasHover ? handleLinkedInClick : undefined}
                style={{ cursor: !hasHover ? 'pointer' : 'default' }}
              >
                <img 
                  src={cartezImg} 
                  alt="Cartez Dewberry, Founder & CEO of Marc'd"
                  className="profile-image"
                />
              </Box>
              
              <Box className="profile-card-content">
                <Typography variant="h1" className="profile-name">
                  Cartez Dewberry
                </Typography>
                <Typography variant="h3" className="profile-title">
                  Founder & CEO
                </Typography>
                
                <Box className="divider-line"></Box>
                
                {/* LinkedIn Button - show on desktop */}
                <IconButton 
                  className="linkedin-button"
                  onClick={handleLinkedInClick}
                  aria-label="Visit Cartez Dewberry's LinkedIn profile"
                >
                  <img 
                    src={linkedinIcon} 
                    alt="LinkedIn" 
                    className="linkedin-icon"
                  />
                </IconButton>
              </Box>
            </Box>
          </Box>

          {/* Right Column - Bio Content */}
          <Box className="bio-content-section">
            {/* Bio Section */}
            <Box className="bio-section" ref={bioRef}>
              {/* Mobile Profile Wrapper - only visible on small screens */}
              <Box className="mobile-profile-wrapper">
                {/* Mobile Profile Image */}
                <img 
                  src={cartezImg} 
                  alt="Cartez Dewberry, Founder & CEO of Marc'd"
                  className="mobile-profile-image"
                />
                {/* Mobile Profile Info */}
                <Box className="mobile-profile-info">
                  <Typography variant="h4" className="mobile-profile-title">
                    Founder & CEO
                  </Typography>
                  
                  <Box className="mobile-divider-line"></Box>
                </Box>
              </Box>

              <Box className="mobile-bio-header">
              <Typography variant="h3" className="bio-subtitle">
                Meet Cartez Dewberry
              </Typography>
                <button 
                  className="mobile-linkedin-button"
                  onClick={handleLinkedInClick}
                  aria-label="Visit Cartez Dewberry's LinkedIn profile"
                >
                  <img 
                    src={linkedinIcon} 
                    alt="LinkedIn" 
                    className="mobile-linkedin-icon"
                  />
                </button>
              </Box>
              <Typography 
                variant="subtitle1" 
                className={`bio-tagline ${showBold ? 'bold-effect' : ''}`}
              >
                {displayedText}
                {!isTypingComplete && <span className="typing-cursor">|</span>}
              </Typography>

              <Typography className={`bio-paragraph ${isBioVisible ? 'animate' : ''}`}>
                For Cartez Dewberry, Marc'd is more than a mobile app—it's a mission rooted in legacy, service, and innovation.
              </Typography>

              <Typography className={`bio-paragraph ${isBioVisible ? 'animate' : ''}`}>
                Cartez spent over a decade in the U.S. Marine Corps, where he developed grit, discipline, and a deep appreciation for teamwork and logistics. After transitioning out of the military, he became an owner-operator in the trucking industry, driving across the country and managing his own fleet. It was during these long hauls that he experienced firsthand the frustrations and gaps drivers face every day—from unreliable parking to limited access to healthy food and essential amenities.
              </Typography>

              <Typography className={`bio-paragraph ${isBioVisible ? 'animate' : ''}`}>
                As the son of Marcus Dewberry, a commercial truck driver with over 30 years on the road, Cartez grew up understanding the sacrifices drivers make to keep America moving. His father's dedication inspired the name "Marc'd" and fuels the company's commitment to honoring the lifestyle and legacy of truckers.
              </Typography>

              <Typography className={`bio-paragraph ${isBioVisible ? 'animate' : ''}`}>
                Later, Cartez pivoted into corporate America as a finacial analyst, helping companies solve financial and operational challenges using data-driven insights. But it wasn't until he pursued his Executive MBA at Georgia State University that his entrepreneurial path crystallized. Surrounded by seasoned leaders and fueled by a desire to make a broader impact, he discovered a passion for using technology to solve the very problems he once faced behind the wheel.
              </Typography>

              <Typography className={`bio-paragraph ${isBioVisible ? 'animate' : ''}`}>
                Today, Cartez is a software developer and founder of Marc'd—a tech platform built from the ground up for commercial truckers. Marc'd combines GPS-based tools, real-time updates, and community-driven insights to improve life on the road. It's not just a business—it's Cartez's tribute to his father, his fellow drivers, and the future of trucking.
              </Typography>
            </Box>

            {/* Back Button */}
            <Box className="action-section" ref={backButtonRef}>
              <Button 
                variant="contained" 
                className={`back-button-our-story ${isBackButtonVisible ? 'animate' : ''}`}
                onClick={handleBackClick}
                size="large"
              >
                Back to Our Story
              </Button>
            </Box>


          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Leadership_Cartez;
