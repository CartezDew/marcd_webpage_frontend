// src/pages/OurStory.jsx
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../styles/ourstory.css';

const leaders = [
  {
    name: 'Cartez Dewberry',
    title: 'Founder & CEO',
    image: 'https://i.postimg.cc/L8P8VYnV/Cartez-Pitch-Deck.jpg',
    link: '/leadership/cartez'
  },
  {
    name: 'Beth Crosby',
    title: 'Co-Founder',
    image: 'https://i.postimg.cc/d08Xnv2X/Beth-Pitch-Deck.png',
    link: '/leadership/beth'
  }
];

export default function OurStory() {
  const navigate = useNavigate();

  return (
    <Box className="our-story-container">
      <section className="origin-section">
        <Typography variant="h4" className="section-title">Origin Story</Typography>
        <Typography className="section-body">
          Marc’d was born from personal experience and a deep-rooted connection to the trucking industry...
        </Typography>
      </section>
      <section className="mission-section">
        <Typography variant="h4" className="section-title">Mission</Typography>
        <Typography className="section-body">
          Marc’d’s mission is to empower and support commercial drivers by providing innovative, driver-centered solutions...
        </Typography>
      </section>
      <section className="vision-section">
        <Typography variant="h4" className="section-title">Vision</Typography>
        <Typography className="section-body">
          Our Vision is to be the leading mobile app for commercial truck drivers, empowering them to find and ‘Marc’ essential resources...
        </Typography>
      </section>

      <section className="leadership-preview">
        <Typography variant="h4" className="section-title">Leadership</Typography>
        <Box className="leader-cards">
          {leaders.map((leader) => (
            <Card
              key={leader.name}
              className="leader-card"
              onClick={() => navigate(leader.link)}
              elevation={3}
            >
              <img src={leader.image} alt={leader.name} className="leader-img" />
              <CardContent className="overlay">
                <Typography variant="h6" className="leader-name">{leader.name}</Typography>
                <Typography variant="body2" className="leader-title">{leader.title}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </section>
    </Box>
  );
}
