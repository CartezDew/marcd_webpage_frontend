// src/pages/OurStory.jsx
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Box, Typography, Grid, CardMedia } from '@mui/material';
import { FaFlag, FaBullseye } from 'react-icons/fa';
import '../styles/ourstory.css';
import cartezImg from '../assets/CartezPitchDeck.jpg';
import bethImg from '../assets/BethPitchDeck.png';
import truckersImg from '../assets/truckers.jpeg';
import sisterAndDadImg from '../assets/Sister and Dad.jpg';
import personIcon from '../assets/person_icon.svg';
import linkedinIcon from '../assets/linkedin_icon.png';

function OurStory() {
  const navigate = useNavigate();
  const storyRef = useRef(null);
  const leadershipRef = useRef(null);
  const [isStoryVisible, setIsStoryVisible] = useState(false);
  const [isLeadershipVisible, setIsLeadershipVisible] = useState(false);

  const leaders = [
    {
      name: 'Cartez Dewberry',
      title: 'Founder & CEO',
      image: cartezImg,
      route: '/leadership/cartez',
      followRoute: 'https://www.linkedin.com/in/cartez-dewberry/',
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

    // Leadership section observer
    const leadershipObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLeadershipVisible(true);
          }
        });
      },
      observerOptions
    );

    // Observe both sections
    if (storyRef.current) {
      storyObserver.observe(storyRef.current);
    }
    if (leadershipRef.current) {
      leadershipObserver.observe(leadershipRef.current);
    }

    return () => {
      if (storyRef.current) {
        storyObserver.unobserve(storyRef.current);
      }
      if (leadershipRef.current) {
        leadershipObserver.unobserve(leadershipRef.current);
      }
    };
  }, []);

  return (
    <Box className="our-story-container">
      {/* About Us Section */}
      <Box className="about-us-hero">
        <Box className="about-hero-content">
          <Box className="about-hero-text">
            <Typography variant="h2" className="about-hero-headline">
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
              className="hero-image"
            />
          </Box>
        </Box>
      </Box>

      {/* Mission & Vision Section */}
      <Box className="mv-section">
        <Box className="mv-row">
          <Box className="mv-card">
            <Box className="mv-header">
              <FaBullseye className="mv-icon" />
              <Typography className="mv-title">Our Mission</Typography>
            </Box>
            <Typography className="mv-desc">
              Marc'd empowers commercial drivers with real-time navigation, safe parking, and a supportive community—putting their well-being, safety, and success first.
            </Typography>
          </Box>
          <Box className="mv-card">
            <Box className="mv-header">
              <FaFlag className="mv-icon" />
              <Typography className="mv-title">Our Vision</Typography>
            </Box>
            <Typography className="mv-desc">
              To be the technology platform that eliminates inefficiencies in the transportation industry—enhancing driver well-being, reducing safety risks, and improving efficiency.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Our Story Section */}
      <Box className="story-section" ref={storyRef}>
        <Box className={`our-story-hero ${isStoryVisible ? 'animate' : ''}`}>
          <Typography variant="h3" className="hero-headline">
            Empowering the Backbone of America
          </Typography>
          <Typography className="hero-highlight">
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
            <Box className="story-hero-image">
              <img 
                src={sisterAndDadImg} 
                alt="Family legacy in trucking industry" 
                className="story-image"
              />
            </Box>
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
        <Grid container spacing={4} justifyContent="center" className="leaders-grid">
          {leaders.map((leader) => (
            <Grid item xs={12} sm={6} md={4} key={leader.name}>
              <Box className="leader-card">
                <CardMedia
                  component="img"
                  image={leader.image}
                  alt={leader.name}
                  className="leader-image"
                />
                <Box className="leader-overlay">
                  <Typography className="leader-name">{leader.name}</Typography>
                  <Typography className="leader-title">{leader.title}</Typography>
                </Box>
                <Box className="leader-hover-overlay">
                  <Box className="hover-actions">
                    <Box className="hover-button" onClick={() => navigate(leader.route)}>
                      <Box className="button-icon">
                        <img src={personIcon} alt="Person" style={{ width: '32px', height: '32px' }} />
                      </Box>
                      <Typography className="button-label">ABOUT</Typography>
                    </Box>
                    <Box className="hover-button" onClick={() => handleFollowClick(leader)}>
                      <Box className="button-icon">
                        <img src={linkedinIcon} alt="LinkedIn" style={{ width: '32px', height: '32px' }} />
                      </Box>
                      <Typography className="button-label">FOLLOW</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default OurStory;
