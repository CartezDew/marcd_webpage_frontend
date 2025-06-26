// src/pages/Leadership_Cartez.jsx
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
import cartezImg from '../assets/CartezPitchDeck.jpg';
import linkedinIcon from '../assets/linkedin_icon.png';
import '../styles/leadership_cartez.css';

function Leadership_Cartez() {
  const navigate = useNavigate();
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showBold, setShowBold] = useState(false);

  const fullText = "Software Engineer | U.S. Marine Veteran | Former Owner-Operator";

  const handleLinkedInClick = () => {
    window.open('https://www.linkedin.com/in/cartez-dewberry/', '_blank');
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
      {/* Navigation Breadcrumb */}
      <Container maxWidth="lg" className="profile-container">
        <Box className="profile-layout">
          {/* Left Column - Profile Card */}
          <Box className="profile-card-section">
            <Box className="profile-card">
              <Box className="profile-image-container">
                <img 
                  src={cartezImg} 
                  alt="Cartez Dewberry, Founder & CEO of Marc'd"
                  className="profile-image"
                />
              </Box>
              
              <Box className="profile-card-content">
                <Typography variant="h3" className="profile-title">
                  Founder & CEO
                </Typography>
                
                <Box className="divider-line"></Box>
                
                {/* LinkedIn Button */}
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
            <Box className="bio-section">
              <Typography variant="h3" className="bio-subtitle">
                Meet Cartez Dewberry
              </Typography>
              <Typography 
                variant="subtitle1" 
                className={`bio-tagline ${showBold ? 'bold-effect' : ''}`}
              >
                {displayedText}
                {!isTypingComplete && <span className="typing-cursor">|</span>}
              </Typography>

              <Typography className="bio-paragraph">
                For Cartez Dewberry, Marc'd is more than a mobile app—it's a mission rooted in legacy, service, and innovation.
              </Typography>

              <Typography className="bio-paragraph">
                Cartez spent over a decade in the U.S. Marine Corps, where he developed grit, discipline, and a deep appreciation for teamwork and logistics. After transitioning out of the military, he became an owner-operator in the trucking industry, driving across the country and managing his own fleet. It was during these long hauls that he experienced firsthand the frustrations and gaps drivers face every day—from unreliable parking to limited access to healthy food and essential amenities.
              </Typography>

              <Typography className="bio-paragraph">
                As the son of Marcus Dewberry, a commercial truck driver with over 30 years on the road, Cartez grew up understanding the sacrifices drivers make to keep America moving. His father's dedication inspired the name "Marc'd" and fuels the company's commitment to honoring the lifestyle and legacy of truckers.
              </Typography>

              <Typography className="bio-paragraph">
                Later, Cartez pivoted into corporate America as a finacial analyst, helping companies solve financial and operational challenges using data-driven insights. But it wasn't until he pursued his Executive MBA at Georgia State University that his entrepreneurial path crystallized. Surrounded by seasoned leaders and fueled by a desire to make a broader impact, he discovered a passion for using technology to solve the very problems he once faced behind the wheel.
              </Typography>

              <Typography className="bio-paragraph">
                Today, Cartez is a software developer and founder of Marc'd—a tech platform built from the ground up for commercial truckers. Marc'd combines GPS-based tools, real-time updates, and community-driven insights to improve life on the road. It's not just a business—it's Cartez's tribute to his father, his fellow drivers, and the future of trucking.
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

export default Leadership_Cartez;
