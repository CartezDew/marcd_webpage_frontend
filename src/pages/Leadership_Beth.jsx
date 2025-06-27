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
import bethImg from '../assets/BethPitchDeck.png';
import linkedinIcon from '../assets/linkedin_icon.png';
import '../styles/leadership_beth.css';

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
              <Typography variant="h3" className="bio-subtitle">
                Meet Beth
              </Typography>
              <Typography 
                variant="subtitle1" 
                className={`bio-tagline ${showBold ? 'bold-effect' : ''}`}
              >
                {displayedText}
                {!isTypingComplete && <span className="typing-cursor">|</span>}
              </Typography>

              <Typography className="bio-paragraph">
                Beth Corbley is a seasoned tech leader with over 15 years of experience driving growth and building relationships at the intersection of technology, education, and impact. Currently serving as Director of Strategic Growth for Higher Education at Hootsuite, Beth partners with universities across the U.S. and Canada to amplify their digital presence, enhance community engagement, and drive institutional success through innovative social media strategies.
              </Typography>

              <Typography className="bio-paragraph">
                Before joining Hootsuite, Beth held senior roles at industry leaders like Autodesk and RSMeans, as well as fast-scaling startups like Samsara and CostCenter. Throughout her career, she’s led high-performing sales teams and developed go-to-market strategies focused on consultative, value-based selling—particularly within public sector and government spaces.
              </Typography>

              <Typography className="bio-paragraph">
                Beth met the founder, Cartez Dewberry, while pursuing an MBA at Georgia State University. Their shared belief in entrepreneurship as a force for good, combined with Beth’s passion for digital storytelling and Cartez’s mission to uplift the trucking community, led them to team up and build Marc’d. As Cofounder, Beth leads marketing, sales, and strategic partnerships—bringing the Marc’d brand to life and helping to scale its reach across the logistics and transportation sector.
              </Typography>

              <Typography className="bio-paragraph">
                A Florida native turned Atlanta local by way of Seattle and San Francisco, Beth is also a champion of social mobility, enrollment equity, and innovation in education. Outside of work, she’s an avid Peloton rider and enjoys life with her husband Eric and their rescue pup, Coco.
              </Typography>
            </Box>

            {/* Back Button */}
            <Box className="action-section">
              <Button 
                variant="contained" 
                className="back-button-main"
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