import React, { useState, useRef, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  style = {},
  placeholder = null,
  onLoad = () => {},
  onError = () => {},
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px' // Start loading 50px before image comes into view
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad();
  };

  const handleError = () => {
    setHasError(true);
    onError();
  };

  return (
    <Box 
      ref={imgRef}
      className={`lazy-image-container ${className}`}
      style={{
        position: 'relative',
        display: 'inline-block',
        ...style
      }}
      {...props}
    >
      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            minHeight: '200px'
          }}
        >
          {placeholder || <CircularProgress size={24} />}
        </Box>
      )}

      {/* Actual image - only load when in view */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: '100%',
            height: 'auto',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            display: hasError ? 'none' : 'block'
          }}
        />
      )}

      {/* Error state */}
      {hasError && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            color: '#666',
            minHeight: '200px',
            fontSize: '14px'
          }}
        >
          Failed to load image
        </Box>
      )}
    </Box>
  );
};

export default LazyImage; 