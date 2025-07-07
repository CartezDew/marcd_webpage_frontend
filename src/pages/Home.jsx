// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import '../styles/leadership_cartez.css';
import mainPageImage from '../assets/App_Marc-d_Main_Page.png';

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
    <div className="hero" style={{
      display: 'flex',
      minHeight: '100vh',
      alignItems: 'center',
      padding: '2rem',
      gap: '3rem',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Left Column - Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <h1 style={{ 
          fontSize: '3.5rem', 
          fontWeight: 'bold', 
          marginBottom: '1.5rem',
          color: '#ffffff',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          Marc'd
        </h1>
        <p style={{ 
          fontSize: '1.3rem', 
          lineHeight: '1.6',
          color: '#f0f0f0',
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
          marginBottom: '2rem'
        }}>
          The revolutionary mobile application designed specifically for truck drivers. 
          Connecting drivers with essential services, real-time information, and a supportive community.
        </p>
        <button style={{
          backgroundColor: '#d32f2f',
          color: 'white',
          padding: '1rem 2rem',
          fontSize: '1.1rem',
          border: 'none',
          borderRadius: '50px',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(211, 47, 47, 0.3)',
          transition: 'all 0.3s ease'
        }}>
          Join Waitlist
        </button>
      </div>

      {/* Right Column - Image */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <img 
          src={mainPageImage} 
          alt="Marc'd Main Page" 
          style={{ 
            maxWidth: '85%', 
            maxHeight: '75vh', 
            borderRadius: 15,
            transition: 'transform 0.3s ease'
          }}
        />
      </div>
    </div>
  );
}

export default Home;

