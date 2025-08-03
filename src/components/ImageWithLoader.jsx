import React, { useState, useEffect, useRef } from 'react';
import { Box, CircularProgress } from '@mui/material';

const ImageWithLoader = ({ 
  src, 
  alt, 
  className, 
  style, 
  width, 
  height, 
  onLoad, 
  onError,
  priority = false,
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [showSpinner, setShowSpinner] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (src) {
      setIsLoading(true);
      setHasError(false);
      setShowSpinner(false);
      
      // Show spinner after a short delay to avoid flickering for fast loads
      timeoutRef.current = setTimeout(() => {
        setShowSpinner(true);
      }, 100);
      
      // Preload the image with priority
      const img = new Image();
      
      // Set loading priority for critical images
      if (priority) {
        img.loading = 'eager';
      }
      
      img.onload = () => {
        clearTimeout(timeoutRef.current);
        setImageSrc(src);
        setIsLoading(false);
        setShowSpinner(false);
        if (onLoad) onLoad();
      };
      
      img.onerror = () => {
        clearTimeout(timeoutRef.current);
        setHasError(true);
        setIsLoading(false);
        setShowSpinner(false);
        if (onError) onError();
      };
      
      img.src = src;
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [src, onLoad, onError, priority]);

  if (hasError) {
    return (
      <Box 
        className={className}
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          color: '#666',
          fontSize: '0.875rem',
          width: width || '100%',
          height: height || '200px',
          border: '1px dashed #ccc'
        }}
        {...props}
      >
        Failed to load image
      </Box>
    );
  }

  return (
    <Box 
      className={className}
      style={{
        ...style,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: width || '100%',
        height: height || 'auto',
        minHeight: isLoading ? '100px' : 'auto'
      }}
      {...props}
    >
      {isLoading && showSpinner && (
        <Box
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1
          }}
        >
          <CircularProgress size={20} style={{ color: '#be0303' }} />
        </Box>
      )}
      
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.2s ease-in-out'
          }}
        />
      )}
    </Box>
  );
};

export default ImageWithLoader; 