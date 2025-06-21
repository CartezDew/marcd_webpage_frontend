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
        'https://widget.surveymonkey.com/collect/website/js/tRaiETqnLgj758hTBazgd_2BL7H_2BDXEdJr0wzAqNIv4r9JKR7NDCPD0oBkrm4qpCDg.js';

      script.onload = () => {
        // Slight delay to ensure widget is visible
        setTimeout(() => setIsLoading(false), 1000);
      };

      widgetRef.current.appendChild(script);
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <Container maxWidth="md" className="survey-embed-container">
      <Box
        className={`survey-loading ${!isLoading ? 'fade-out' : ''}`}
        style={{ display: isLoading ? 'flex' : 'none' }}
      >
        <CircularProgress
          size={48}
          style={{ color: '#1976d2' }} // Your brand color
        />
        <Typography variant="body2" className="survey-loading-text">
          Loading survey, please wait...
        </Typography>
      </Box>

      <Box ref={widgetRef} className="survey-widget-box" />
    </Container>
  );
}

export default Survey;
