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
import bethImg from '../assets/BethPitchDeck2.jpg';
import linkedinIcon from '../assets/linkedin_icon.png';
import '../styles/leadership.css';

function Leadership_Beth() {
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

  const fullText = "Chief Marketing Officer | Strategic Partnerships";

  const handleLinkedInClick = () => {
    navigate('/contactus');
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
                  src={bethImg} 
                  alt="Beth Crosby, Co-Founder of Marc'd"
                  className="profile-image"
                />
              </Box>
              
              <Box className="profile-card-content">
                <Typography variant="h1" className="profile-name">
                  Beth Crosby
                </Typography>
                <Typography variant="h3" className="profile-title">
                  Co-Founder
                </Typography>
                
                <Box className="divider-line"></Box>
                
                {/* Contact Button - show on desktop */}
                <IconButton 
                  className="linkedin-button"
                  onClick={handleLinkedInClick}
                  aria-label="Contact Beth Crosby"
                >
                  <img 
                    src={linkedinIcon} 
                    alt="Contact" 
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
                  src={bethImg} 
                  alt="Beth Crosby, Co-Founder of Marc'd"
                  className="mobile-profile-image"
                />
                {/* Mobile Profile Info */}
                <Box className="mobile-profile-info">
                  <Typography variant="h4" className="mobile-profile-title">
                    Co-Founder
                  </Typography>
                  
                  <Box className="mobile-divider-line"></Box>
                </Box>
              </Box>

              <Box className="mobile-bio-header">
                <Typography variant="h3" className="bio-subtitle">
                  Meet Beth
                </Typography>
                <button 
                  className="mobile-linkedin-button"
                  onClick={handleLinkedInClick}
                  aria-label="Contact Beth Crosby"
                >
                  <img 
                    src={linkedinIcon} 
                    alt="Contact" 
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
                Beth Corbley is a seasoned tech leader, strategist, and storyteller with over 15 years of experience helping technology startups and emerging brands accelerate revenue, grow market share, and build authentic connections that last.
              </Typography>

              <Typography className={`bio-paragraph ${isBioVisible ? 'animate' : ''}`}>
                Known for her consultative, relationship-driven style, Beth partners with brands to elevate their digital strategy and social media impact, shaping messaging that resonates, launching products that stick, and building communities that champion the story long after launch day. As Director of Strategic Growth at Hootsuite, Beth works alongside her clients to deliver insights on emerging trends, platform best practices, and social performance strategies that drive real engagement and measurable results. Throughout her career, she has held senior roles with industry innovators like Autodesk and RSMeans and stand out start-ups like Samsara and CostCenter, leading high-performing sales teams and go-to-market strategies focused on unlocking growth in competitive markets.
              </Typography>

              <Typography className={`bio-paragraph ${isBioVisible ? 'animate' : ''}`}>
                She and founder, Cartez Dewberry met while pursuing their Executive MBA at Georgia State University. Their shared belief in entrepreneurship as a force for good, combined with Beth's passion for digital storytelling and Cartez's mission to uplift the trucking community, led them to team up and build Marc'd. As Cofounder, Beth leads marketing, brand storytelling, and strategic partnerships, helping bring the Marc'd brand to life and scale its reach and impact from the ground up.
              </Typography>

              <Typography className={`bio-paragraph ${isBioVisible ? 'animate' : ''}`}>
                Originally from Florida and now an Atlanta local by way of Seattle and San Francisco, Beth is passionate about community building, digital innovation, and championing ideas that make a difference. Outside of work, she's an avid Peloton rider, yogi and loves spending time with her husband Eric and their rescue pup, Coco.
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

export default Leadership_Beth;