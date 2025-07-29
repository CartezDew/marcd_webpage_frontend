import React, { useState, useRef, useEffect } from 'react';
import { Box, CircularProgress, IconButton } from '@mui/material';
import { PlayArrow } from '@mui/icons-material';

const LazyVideo = ({ 
  src, 
  poster = null,
  className = '', 
  style = {},
  autoPlay = false,
  loop = false,
  muted = true,
  controls = false,
  playsInline = true,
  preload = "none",
  onLoad = () => {},
  onError = () => {},
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(!autoPlay);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Don't disconnect for videos - we might want to pause when out of view
        } else if (videoRef.current && !videoRef.current.paused) {
          // Pause video when out of view to save bandwidth
          videoRef.current.pause();
          setIsPlaying(false);
        }
      },
      {
        threshold: 0.3,
        rootMargin: '100px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
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

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
      setShowPlayButton(false);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (!autoPlay) {
      setShowPlayButton(true);
    }
  };

  const handleVideoClick = () => {
    if (!isPlaying && showPlayButton) {
      handlePlay();
    }
  };

  return (
    <Box 
      ref={containerRef}
      className={`lazy-video-container ${className}`}
      style={{
        position: 'relative',
        display: 'inline-block',
        cursor: showPlayButton ? 'pointer' : 'default',
        ...style
      }}
      onClick={handleVideoClick}
      {...props}
    >
      {/* Loading placeholder */}
      {isInView && !isLoaded && !hasError && (
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
            backgroundColor: '#000',
            color: '#fff',
            minHeight: '200px',
            zIndex: 2
          }}
        >
          <CircularProgress size={24} sx={{ color: '#fff' }} />
        </Box>
      )}

      {/* Poster image placeholder when video not in view */}
      {!isInView && poster && (
        <img
          src={poster}
          alt="Video thumbnail"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block'
          }}
        />
      )}

      {/* Play button overlay */}
      {showPlayButton && isInView && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 3,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
        >
          <IconButton
            onClick={handlePlay}
            sx={{
              color: '#fff',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <PlayArrow sx={{ fontSize: '2rem' }} />
          </IconButton>
        </Box>
      )}

      {/* Actual video - only load when in view */}
      {isInView && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          controls={controls}
          playsInline={playsInline}
          preload={preload}
          onLoadedData={handleLoad}
          onError={handleError}
          onPlay={() => setIsPlaying(true)}
          onPause={handlePause}
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
          Failed to load video
        </Box>
      )}
    </Box>
  );
};

export default LazyVideo; 