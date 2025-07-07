// src/pages/Home.jsx
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
import mainPageImage from '../assets/app_marc-d_main_page.png';

function Home() {
  useEffect(() => {
    // Store the original background
    const originalBackground = document.body.style.background;
    
    // Set gradient background for home page
    document.body.style.background = 'linear-gradient(to right, rgba(10, 10, 10, 0.96) 0%, rgba(0, 0, 0, 1) 30%, rgb(109, 2, 2) 70%, rgb(212, 2, 9) 100%)';
    
    
    // Cleanup function to restore original background when component unmounts
    return () => {
      document.body.style.background = originalBackground;
    };
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
    }}>
      <img 
        src={mainPageImage} 
        alt="Marc'd Main Page" 
        style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 2 }}
      />
    </div>
  );
}

export default Home;

