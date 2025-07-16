// src/pages/OurStory.jsx
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Box, Typography, Grid, CardMedia } from '@mui/material';
import { FaFlag, FaBullseye } from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../styles/ourstory.css';
import cartezImg from '../assets/CartezPitchDeck.jpg';
import bethImg from '../assets/BethPitchDeck2.jpg';
import truckersImg from '../assets/truckers.jpeg';
import sisterAndDadImg from '../assets/Sister and Dad.jpg';
import personIcon from '../assets/person_icon.svg';
import linkedinIcon from '../assets/linkedin_icon.png';



function OurStory() {
  const navigate = useNavigate();
  const aboutRef = useRef(null);
  const storyRef = useRef(null);
  const storyImageRef = useRef(null);
  const leadershipRef = useRef(null);
  const mvRef = useRef(null); // <-- Add this line
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [isStoryVisible, setIsStoryVisible] = useState(false);
  const [isStoryImageVisible, setIsStoryImageVisible] = useState(false);
  const [isLeadershipVisible, setIsLeadershipVisible] = useState(false);
  const [isMVVisible, setIsMVVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [hasHover, setHasHover] = useState(true);
  const [showHoverNote, setShowHoverNote] = useState(false);

  const leaders = [
    {
      name: 'Cartez Dewberry',
      title: 'Founder & CEO',
      image: cartezImg,
      route: '/leadership/cartez',
      followRoute: import.meta.env.VITE_CARTEZ_LINKEDIN_URL,
      isExternal: true
    },
    {
      name: 'Beth Crosby',
      title: 'Co-Founder',
      image: bethImg,
      route: '/leadership/beth',
      followRoute: '/contactus',
      isExternal: false
    }
  ];

  const handleFollowClick = (leader) => {
    if (leader.isExternal) {
      window.open(leader.followRoute, '_blank');
    } else {
      navigate(leader.followRoute);
    }
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

    // Story section observer
    const storyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsStoryVisible(true);
          }
        });
      },
      observerOptions
    );

    // Story image observer
    const storyImageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsStoryImageVisible(true);
          }
        });
      },
      observerOptions
    );

    // Leadership section observer
    const leadershipObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLeadershipVisible(true);
            // Show hover note when leadership section becomes visible
            if (!hasHover) {
              setShowHoverNote(true);
              // Hide the note after 3 seconds
              setTimeout(() => {
                setShowHoverNote(false);
              }, 3000);
            }
          } else {
            // Reset the note visibility when section is not visible
            setShowHoverNote(false);
          }
        });
      },
      observerOptions
    );

    // Mission & Vision section observer
    const mvObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsMVVisible(true);
          }
        });
      },
      observerOptions
    );

    // Observe all sections
    if (aboutRef.current) {
      aboutObserver.observe(aboutRef.current);
    }
    if (storyRef.current) {
      storyObserver.observe(storyRef.current);
    }
    if (storyImageRef.current) {
      storyImageObserver.observe(storyImageRef.current);
    }
    if (leadershipRef.current) {
      leadershipObserver.observe(leadershipRef.current);
    }
    if (mvRef.current) {
      mvObserver.observe(mvRef.current);
    }

    return () => {
      if (aboutRef.current) {
        aboutObserver.unobserve(aboutRef.current);
      }
      if (storyRef.current) {
        storyObserver.unobserve(storyRef.current);
      }
      if (storyImageRef.current) {
        storyImageObserver.unobserve(storyImageRef.current);
      }
      if (leadershipRef.current) {
        leadershipObserver.unobserve(leadershipRef.current);
      }
      if (mvRef.current) {
        mvObserver.unobserve(mvRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Detect hover capability
  useEffect(() => {
    const checkHoverCapability = () => {
      setHasHover(window.matchMedia('(hover: hover)').matches);
    };
    
    checkHoverCapability();
    window.addEventListener('resize', checkHoverCapability);
    
    return () => window.removeEventListener('resize', checkHoverCapability);
  }, []);

  return (
    <Box className="our-story-container">
      {/* About Us Section */}
      <Box className="about-us-hero" ref={aboutRef}>
        <Box className="about-hero-content">
          <Box className="about-hero-text">
            <Typography 
              variant="h2" 
              className={`about-hero-headline ${isAboutVisible ? 'animate' : ''}`}
            >
              About Us
            </Typography>
            <Typography className="about-hero-description">
            Marc'd is a technology platform built from a son's tribute to his father—and a vision to uplift every trucker with tools, community, and recognition they've long gone without.
            </Typography>
          </Box>
          <Box className="about-hero-image">
            <img 
              src={truckersImg} 
              alt="Happy truck drivers using Marc'd platform" 
              className={`hero-image ${isAboutVisible ? 'animate' : ''}`}
            />
          </Box>
        </Box>
      </Box>

      {/* Mission & Vision Section */}
      <Box className="mv-section" ref={mvRef}>
        <Box className="mv-row">
          <motion.div
            className="mv-card"
            initial={{ opacity: 0, y: 50 }}
            animate={isMVVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          >
            <Box className="mv-header">
              <FaBullseye className="mv-icon" />
              <Typography className="mv-title">Our Mission</Typography>
            </Box>
            <Typography className="mv-desc">
              Marc'd empowers commercial drivers with real-time navigation, safe parking, and a supportive community—putting their well-being, safety, and success first.
            </Typography>
          </motion.div>

          <motion.div
            className="mv-card"
            initial={{ opacity: 0, y: 50 }}
            animate={isMVVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          >
            <Box className="mv-header">
              <FaFlag className="mv-icon" />
              <Typography className="mv-title">Our Vision</Typography>
            </Box>
            <Typography className="mv-desc">
              To be the technology platform that eliminates inefficiencies in the transportation industry—enhancing driver well-being, reducing safety risks, and improving efficiency.
            </Typography>
          </motion.div>
        </Box>
      </Box>



      {/* Our Story Section */}
      <Box className="story-section" ref={storyRef}>
        <Box className={`our-story-hero ${isStoryVisible ? 'animate' : ''}`}>
          <Typography variant="h3" className="hero-headline">
            Empowering the Backbone of America
          </Typography>
          <Typography className="hero-highlight" sx={{ fontStyle: 'italic' }}>
            Delivering real tools for real drivers, built from lived experience and lasting respect.
          </Typography>
          <Typography className="hero-subheadline">
            At Marc'd, truckers earn rewards for more than just driving—they're celebrated for helping others. Whether marking available parking, clean rest stops, or healthy food options, each contribution fuels a real-time, community-powered navigation experience.
          </Typography>
        </Box>
        
        {/* Our Story Two-Column Layout */}
        <Box className="story-hero-section">
          <Box className="story-hero-content">
            <Box className="story-hero-text">
              <Typography 
                variant="h3" 
                className={`story-hero-headline ${isStoryVisible ? 'animate' : ''}`}
              >
                Our Story
              </Typography>
              {/* Conditionally render image inside text for mobile */}
              {windowWidth <= 800 && (
                <img 
                  src={sisterAndDadImg} 
                  alt="Family legacy in trucking industry" 
                  className="story-image animate"
                  style={{ float: 'right', margin: '0 0 1rem 1rem', maxWidth: '60%', height: 'auto', display: 'block' }}
                />
              )}
              <Typography className="story-hero-description">
                Marc'd was built from lived experience and a generational connection to the trucking industry. Its founder, Cartez Dewberry, carries the legacy of his late father, Marcus Dewberry—a commercial truck driver with more than 30 years behind the wheel. For decades, Marcus shared stories of the challenges truckers face on the road: limited access to safe parking, healthy food, clean facilities, and long periods of isolation.
              </Typography>
              <br/>
              <Typography className="story-hero-description">
                Those stories became reality when Cartez joined the road himself. The struggles weren't exaggerated—they were systemic. A lack of real-time tools left drivers disconnected, underserved, and unseen. What started as frustration became fuel for change.
              </Typography>
              <br/>
              <Typography className="story-hero-description">
                Marc'd was created to bridge those gaps. Named in honor of Marcus Dewberry, the platform is a living tribute—one that carries his name, his mission, and the mark he left on the industry. It's not just a tech solution; it's a commitment to making life on the road safer, healthier, and more connected for the drivers who keep America moving.
              </Typography>
            </Box>
            {/* Only show image in side column for desktop */}
            {windowWidth > 800 && (
              <Box className="story-hero-image" ref={storyImageRef}>
                <img 
                  src={sisterAndDadImg} 
                  alt="Family legacy in trucking industry" 
                  className={`story-image${isStoryVisible ? ' animate' : ''}`}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Leadership Section */}
        <Box className="leadership-section" ref={leadershipRef}>
          <Typography 
            variant="h3" 
            className={`leadership-heading ${isLeadershipVisible ? 'animate' : ''}`}
          >
            Leadership
          </Typography>

          <div className="leaders-grid">
            {leaders.map((leader, index) => (
              <motion.div
              key={leader.name}
              className="leader-card"
              initial={{ 
                opacity: 0, 
                x: index === 0 ? -60 : 60, 
                rotate: index === 0 ? -4 : 4,
                scale: 0.98
              }}
              animate={isLeadershipVisible ? { 
                opacity: 1, 
                x: 0, 
                rotate: 0,
                scale: 1 
              } : {}}
              transition={{ 
                duration: 1.2, 
                ease: [0.25, 0.8, 0.25, 1], 
                delay: index * 0.10 
              }}
              >
                <div className="leader-image-wrapper">
                  <img
                    src={leader.image}
                    alt={leader.name}
                  />
                </div>
                <div className="leader-overlay">
                  <Typography className="leader-name">{leader.name}</Typography>
                  <Typography className="leader-title">{leader.title}</Typography>
                </div>
                <div className="leader-hover-overlay">
                  <div className="hover-actions">
                    <div 
                      className="hover-button" 
                      onClick={() => navigate(leader.route)}
                    >
                      <div className="button-icon">
                        <img src={personIcon} alt="Person" width="32" height="32" />
                      </div>
                      <Typography className="button-label">ABOUT</Typography>
                    </div>
                    <div 
                      className="hover-button" 
                      onClick={() => handleFollowClick(leader)}
                    >
                      <div className="button-icon">
                        <img src={linkedinIcon} alt="LinkedIn" width="32" height="32" />
                      </div>
                      <Typography className="button-label">FOLLOW</Typography>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Note for devices without hover */}
          {!hasHover && showHoverNote && (
            <Box className="leadership-hover-note flash-animation">
              <Typography variant="body2" className="leadership-hover-note-text">
                (Click leader's image to view their bio)
              </Typography>
            </Box>
          )}
        </Box>





</Box>

  );
}

export default OurStory;