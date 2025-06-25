// src/pages/OurStory.jsx
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, CardMedia, Divider } from '@mui/material';
import { FaFlag, FaBullseye } from 'react-icons/fa';
import '../styles/ourstory.css';
import cartezImg from '../assets/CartezPitchDeck.jpg';
import bethImg from '../assets/BethPitchDeck.png';

function OurStory() {
  const navigate = useNavigate();

  const leaders = [
    {
      name: 'Cartez Dewberry',
      title: 'Founder & CEO',
      image: cartezImg,
      route: '/leadership/cartez'
    },
    {
      name: 'Beth Crosby',
      title: 'Co-Founder',
      image: bethImg,
      route: '/leadership/beth'
    }
  ];

  return (
    <Box className="our-story-container">
      {/* Hero Section */}
      <Box className="our-story-hero">
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

      {/* Mission & Vision Section */}
      <Box className="mv-row-section">
        <Box className="mv-card">
          <Box className="mv-header">
          <FaFlag className="mv-icon" />
          <Typography className="mv-title">Vision</Typography>
          </Box>
          <Typography className="mv-desc">
            To be the technology platform that eliminates inefficiencies in the transportation industry—enhancing driver well-being, reducing safety risks, and improving efficiency.
          </Typography>
        </Box>
        <Box className="mv-card">
          <Box className="mv-header">
          <FaBullseye className="mv-icon" />
          <Typography className="mv-title">Mission</Typography>
          </Box>
          <Typography className="mv-desc">
            Marc'd empowers commercial drivers with real-time navigation, safe parking, and a supportive community—putting their well-being, safety, and success first.
          </Typography>
        </Box>
      </Box>

      {/* Origin Section */}
      <Box className="our-story-section">
        <Typography variant="h4" className="section-heading">Our Origin</Typography>
        <Typography className="section-text">
          Marc'd was built from lived experience and a generational connection to the trucking industry. Its founder, Cartez Dewberry, carries the legacy of his late father, Marcus Dewberry—a commercial truck driver with more than 30 years behind the wheel. For decades, Marcus shared stories of the challenges truckers face on the road: limited access to safe parking, healthy food, clean facilities, and long periods of isolation.
        </Typography>
        <Typography className="section-text">
          Those stories became reality when Cartez joined the road himself. The struggles weren't exaggerated—they were systemic. A lack of real-time tools left drivers disconnected, underserved, and unseen. What started as frustration became fuel for change.
        </Typography>
        <Typography className="section-text">
          Marc'd was created to bridge those gaps. Named in honor of Marcus Dewberry, the platform is a living tribute—one that carries his name, his mission, and the mark he left on the industry. It's not just a tech solution; it's a commitment to making life on the road safer, healthier, and more connected for the drivers who keep America moving.
        </Typography>
      </Box>

      {/* Leadership Section */}
      <Box className="leadership-section">
        <Typography variant="h3" className="leadership-heading">Leadership</Typography>
        <Grid container spacing={4} justifyContent="center" className="leaders-row">
          {leaders.map((leader) => (
            <Grid item xs={12} sm={6} md={4} key={leader.name}>
              <Box className="leader-card" onClick={() => navigate(leader.route)}>
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
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default OurStory;
