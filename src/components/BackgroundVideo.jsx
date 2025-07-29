import React, { useState, useRef, useEffect } from 'react';

const BackgroundVideo = ({ 
  src, 
  className = '', 
  style = {},
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  preload = "auto",
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // For background videos, start playing immediately when in view
          if (videoRef.current && autoPlay) {
            videoRef.current.play().catch(console.error);
          }
        } else if (videoRef.current && !videoRef.current.paused) {
          // Pause when out of view to save bandwidth
          videoRef.current.pause();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [autoPlay]);

  const handleLoadedData = () => {
    setIsLoaded(true);
    // Ensure video plays for background videos
    if (autoPlay && videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  };

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      preload={preload}
      onLoadedData={handleLoadedData}
      className={`background-video ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
        ...style
      }}
      {...props}
    />
  );
};

export default BackgroundVideo; 