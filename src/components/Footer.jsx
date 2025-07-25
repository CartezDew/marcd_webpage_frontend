import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Add your desired background color here
        py: 3,
        mt: 'auto'
      }}
    >
      <Container maxWidth="xl">
        <Typography
          variant="body2"
          sx={{
            color: '#a1a1aa',
            textAlign: 'center',
            fontSize: '0.875rem'
          }}
        >
          © 2025 Marc'd Group LLC. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 