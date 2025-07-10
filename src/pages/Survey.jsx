import { useEffect, useRef, useState } from 'react';
import { Container, Box, CircularProgress, Typography } from '@mui/material';
import '../styles/survey.css';

function Survey() {
  const widgetRef = useRef(null);
  const introRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isIntroVisible, setIsIntroVisible] = useState(false);

  // Intersection Observer for intro section animation
  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px 0px -50px 0px'
    };

    const introObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntroVisible(true);
          }
        });
      },
      observerOptions
    );

    if (introRef.current) {
      introObserver.observe(introRef.current);
    }

    return () => {
      if (introRef.current) {
        introObserver.unobserve(introRef.current);
      }
    };
  }, []);

  // Survey widget loading effect
  useEffect(() => {
    if (!document.getElementById('smcx-sdk')) {
      const script = document.createElement('script');
      script.id = 'smcx-sdk';
      script.type = 'text/javascript';
      script.async = true;
      script.src =
        'https://widget.surveymonkey.com/collect/website/js/tRaiETqnLgj758hTBazgd_2BL7H_2BDXEdJr0wzAqNIv4r_2BHt1k_2Fg4pHvhizXAm9SXN4.js';

      script.onload = () => {
        setTimeout(() => setIsLoading(false), 1000);
      };

      widgetRef.current.appendChild(script);
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      {/* ✅ Intro Section ABOVE the widget */}
      <Box 
        ref={introRef}
        className={`survey-intro-container ${isIntroVisible ? 'animate' : ''}`}
      >
        <Typography
          variant="h6"
          align="center"
          className={`survey-intro-heading ${isIntroVisible ? 'animate' : ''}`}
          style={{ fontWeight: 'bold' }}
        >
          We'd love your feedback
        </Typography>

        <Typography 
          variant="body1" 
          align="center" 
          className={`survey-intro-text ${isIntroVisible ? 'animate' : ''}`}
        >
          This short survey takes approximately 5 minutes to complete. Your insights are incredibly valuable and will directly inform how we improve Marc'd to better serve you. Thank you for your time and input.
        </Typography>
      </Box>

      {/* ✅ Widget + Loader Container */}
      <Container maxWidth="md" className="survey-embed-container">
        <Box className={`survey-loading ${!isLoading ? 'fade-out' : ''}`}>
          <CircularProgress size={48} style={{ color: '#1976d2' }} />
          <Typography variant="body2" className="survey-loading-text">
            Loading survey, please wait...
          </Typography>
        </Box>

        <Box ref={widgetRef} className="survey-widget-box" />
      </Container>
    </>
  );
}

export default Survey;
