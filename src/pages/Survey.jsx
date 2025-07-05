import { useEffect, useRef, useState } from 'react';
import { Container, Box, CircularProgress, Typography } from '@mui/material';
import '../styles/survey.css';

function Survey() {
  const widgetRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

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
      <Box className="survey-intro-container">
        <Typography
          variant="h6"
          align="center"
          className="survey-intro-heading"
          style={{ fontWeight: 'bold' }}
        >
          We'd love your feedback
        </Typography>

        <Typography variant="body1" align="center" className="survey-intro-text">
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
