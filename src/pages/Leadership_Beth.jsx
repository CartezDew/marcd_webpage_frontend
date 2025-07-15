import React, { useState, useEffect } from 'react';
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

  const fullText = "Chief Marketing Officer | Strategic Partnerships";

  const handleLinkedInClick = () => {
    navigate('/contactus');
  };

  const handleBackClick = () => {
    navigate('/our-story');
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Typewriter effect
  useEffect(() => {
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
  }, [fullText]);

  return (
    <Box className="leadership-profile-container">
      <Container maxWidth="lg" className="profile-container">
        <Box className="profile-layout">
          {/* Left Column - Profile Card */}
          <Box className="profile-card-section">
            <Box className="profile-card">
              <Box className="profile-image-container">
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
                
                {/* Contact Button */}
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
            <Box className="bio-section">
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

              <Typography className="bio-paragraph">
                Beth Corbley is a seasoned tech leader, strategist, and storyteller with over 15 years of experience helping technology startups and emerging brands accelerate revenue, grow market share, and build authentic connections that last.
              </Typography>

              <Typography className="bio-paragraph">
                Known for her consultative, relationship-driven style, Beth partners with brands to elevate their digital strategy and social media impact, shaping messaging that resonates, launching products that stick, and building communities that champion the story long after launch day. As Director of Strategic Growth at Hootsuite, Beth works alongside her clients to deliver insights on emerging trends, platform best practices, and social performance strategies that drive real engagement and measurable results. Throughout her career, she has held senior roles with industry innovators like Autodesk and RSMeans and stand out start-ups like Samsara and CostCenter, leading high-performing sales teams and go-to-market strategies focused on unlocking growth in competitive markets.
              </Typography>

              <Typography className="bio-paragraph">
                She and founder, Cartez Dewberry met while pursuing their Executive MBA at Georgia State University. Their shared belief in entrepreneurship as a force for good, combined with Beth’s passion for digital storytelling and Cartez’s mission to uplift the trucking community, led them to team up and build Marc’d. As Cofounder, Beth leads marketing, brand storytelling, and strategic partnerships, helping bring the Marc’d brand to life and scale its reach and impact from the ground up.
              </Typography>

              <Typography className="bio-paragraph">
                Originally from Florida and now an Atlanta local by way of Seattle and San Francisco, Beth is passionate about community building, digital innovation, and championing ideas that make a difference. Outside of work, she’s an avid Peloton rider, yogi and loves spending time with her husband Eric and their rescue pup, Coco.
              </Typography>
            </Box>

            {/* Back Button */}
            <Box className="action-section">
              <Button 
                variant="contained" 
                className="back-button-our-story"
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