// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/home.css';
import mainPageImage from '../assets/App_Marc-d_Main_Page.png';

const actionWords = ["Reward", "Empower", "Appreciate", "Respect", "Support", "Listen to", "Understand", "Value"];

function Home() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    // Store original styles
    const originalBackground = document.body.style.background;
    const mainContent = document.querySelector('.main-content');
    const originalMainContentStyles = mainContent ? {
      padding: mainContent.style.padding,
      maxWidth: mainContent.style.maxWidth,
      margin: mainContent.style.margin,
      width: mainContent.style.width
    } : null;
    
    // Set custom background
    document.body.style.background = 'linear-gradient(to right, rgba(10, 10, 10, 0.96) 0%, rgba(0, 0, 0, 1) 30%, rgb(109, 2, 2) 70%, rgb(212, 2, 9) 100%)';
    
    // Override main-content margins/padding for home page
    if (mainContent) {
      mainContent.style.padding = '0.5rem';
      mainContent.style.maxWidth = '1600px';
      mainContent.style.margin = '0 auto';
      mainContent.style.width = '100%';
    }

    // Word animation interval
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % actionWords.length);
    }, 2000);

    // Cleanup function
    return () => {
      document.body.style.background = originalBackground;
      
      // Restore original main-content styles
      if (mainContent && originalMainContentStyles) {
        mainContent.style.padding = originalMainContentStyles.padding;
        mainContent.style.maxWidth = originalMainContentStyles.maxWidth;
        mainContent.style.margin = originalMainContentStyles.margin;
        mainContent.style.width = originalMainContentStyles.width;
      }
      
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="hero">
      {/* Left Column - Content */}
      <div className="hero-content">
        <h1 className="hero-title">
          Marc'd is built to&nbsp;
          <span className="action-word-container">
            <AnimatePresence mode="wait">
              <motion.span
                key={actionWords[currentWordIndex]}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.30 }}
                className="action-word"
              >
                {actionWords[currentWordIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
          &nbsp;truckers.
        </h1>
        <p className="hero-description">
          From parking solutions to real-time updates and a supportive driver community, Marc'd stands beside you on every mile. 
          Because trucking isn't just work — it's a way of life. It keeps this country moving, and you deserve a partner that moves with you.
        </p>
        <button className="hero-button">
          Join Waitlist
        </button>
      </div>

      {/* Right Column - Image */}
      <div className="hero-image-container">
        <img 
          src={mainPageImage} 
          alt="Marc'd Main Page" 
          className="hero-image"
        />
      </div>
    </div>
  );
}

export default Home;
