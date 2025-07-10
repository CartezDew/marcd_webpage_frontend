import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Container, CircularProgress, IconButton, Tooltip } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/survey.css';
// Import social proof image
import socialProofImage from '../assets/Social_Proof.png';

function Survey() {
  const [isLoading, setIsLoading] = useState(true);
  const [isIntroVisible, setIsIntroVisible] = useState(false);
  const [isResponsesVisible, setIsResponsesVisible] = useState(false);
  const [isFirstViewport, setIsFirstViewport] = useState(true);
  const [currentResponseSet, setCurrentResponseSet] = useState(0);
  const [expandedCard, setExpandedCard] = useState(null);
  const widgetRef = useRef(null);
  const introRef = useRef(null);
  const responsesRef = useRef(null);

  // Survey responses data
  const surveyResponses = [
    [
      {
        name: "Mike Johnson",
        title: "Owner-Operator",
        type: "comment",
        content: "This app has completely changed how I plan my routes. The real-time parking updates from other drivers are a game-changer. No more driving around for hours looking for a spot!"
      },
      {
        name: "Sarah Chen",
        title: "Fleet Manager",
        type: "qa",
        question: "What's the most valuable feature for your drivers?",
        response: "The DOT/Police alerts have been incredibly helpful. Our drivers feel much more prepared and confident on the road knowing what's ahead."
      },
      {
        name: "David Rodriguez",
        title: "Long-haul Driver",
        type: "comment",
        content: "The voice controls are fantastic. I can keep my hands on the wheel and still get all the information I need. Safety first!"
      }
    ],
    [
      {
        name: "Lisa Thompson",
        title: "Regional Hauler",
        type: "qa",
        question: "How has Marc'd improved your daily routine?",
        response: "The favorite places feature saves me so much time. I have all my regular stops saved and can navigate to them instantly."
      },
      {
        name: "James Wilson",
        title: "Owner-Operator",
        type: "comment",
        content: "The community aspect is what makes this special. We're all looking out for each other out here. It's like having thousands of eyes on the road."
      },
      {
        name: "Amanda Foster",
        title: "Fleet Driver",
        type: "qa",
        question: "What would you tell other drivers about Marc'd?",
        response: "Don't wait to download this app. The parking updates alone have saved me hours of frustration. Plus, you can earn rewards just by helping other drivers!"
      }
    ],
    [
      {
        name: "Robert Kim",
        title: "Owner-Operator",
        type: "comment",
        content: "The speed monitoring alerts are spot-on. I always know when speed limits change, especially in construction zones. It's like having a co-pilot."
      },
      {
        name: "Jennifer Martinez",
        title: "Regional Driver",
        type: "qa",
        question: "How reliable are the community updates?",
        response: "Very reliable! The community is active and updates come in real-time. I've learned to trust the information from other Marc'd users."
      },
      {
        name: "Thomas Brown",
        title: "Long-haul Driver",
        type: "comment",
        content: "The spotter request feature is brilliant. When I'm backing into a tight dock, having someone guide me makes all the difference. Safety and efficiency!"
      }
    ]
  ];

  // Intersection Observer for intro section (first viewport)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntroVisible(entry.isIntersecting);
        setIsFirstViewport(entry.isIntersecting);
      },
      {
        threshold: 0.3,
        rootMargin: '0px'
      }
    );

    if (introRef.current) {
      observer.observe(introRef.current);
    }

    return () => {
      if (introRef.current) {
        observer.unobserve(introRef.current);
      }
    };
  }, []);

  // Intersection Observer for responses section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsResponsesVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          setIsFirstViewport(false);
        }
      },
      {
        threshold: 0.3,
        rootMargin: '0px'
      }
    );

    if (responsesRef.current) {
      observer.observe(responsesRef.current);
    }

    return () => {
      if (responsesRef.current) {
        observer.unobserve(responsesRef.current);
      }
    };
  }, []);

  // Close expanded cards when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.response-card') && !event.target.closest('.fact-item')) {
        setExpandedCard(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
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

  const toggleCard = (cardIndex) => {
    setExpandedCard(expandedCard === cardIndex ? null : cardIndex);
  };

  const nextResponseSet = () => {
    setCurrentResponseSet((prev) => (prev + 1) % surveyResponses.length);
  };

  const prevResponseSet = () => {
    setCurrentResponseSet((prev) => (prev - 1 + surveyResponses.length) % surveyResponses.length);
  };

  // Dynamic scroll function - scrolls to responses if in first viewport, otherwise scrolls to top
  const handleScrollAction = () => {
    if (isFirstViewport) {
      // Scroll to the responses section
      if (responsesRef.current) {
        responsesRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else {
      // Scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {/* Dynamic Scroll Button */}
      <Tooltip title={isFirstViewport ? "See what our community is saying" : "Back to Top"} placement="left">
        <IconButton
          className="scroll-to-community-button"
          onClick={handleScrollAction}
          sx={{
            position: 'fixed',
            bottom: { xs: 24, md: 40 },
            right: { xs: 24, md: 40 },
            zIndex: 1200,
            background: 'rgba(190,3,3,0.9)',
            color: 'white',
            boxShadow: 3,
            '&:hover': {
              background: 'rgba(190,3,3,1)',
              transform: 'scale(1.08) translateY(-2px)',
              boxShadow: 6,
            },
            transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
          }}
        >
          {isFirstViewport ? <KeyboardArrowDownIcon fontSize="large" /> : <KeyboardArrowUpIcon fontSize="large" />}
        </IconButton>
      </Tooltip>

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

      {/* Survey Responses Section */}
      <Box 
        ref={responsesRef}
        className={`survey-responses-section ${isResponsesVisible ? 'visible' : ''}`}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" className="responses-title">
            What Our Community is Saying
          </Typography>
          
          <Typography variant="body1" className="responses-subtitle">
            Real feedback from truckers who understand the challenges you face every day.
          </Typography>

          {/* Social Proof Image */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            marginBottom: '2rem',
            opacity: 0.8
          }}>
            <img 
              src={socialProofImage} 
              alt="Social proof - community feedback" 
              style={{
                maxWidth: '300px',
                height: 'auto',
              }}
            />
          </Box>

          {/* Navigation Controls */}
          <Box className="response-navigation">
            <Tooltip title="Back page" placement="left">
              <IconButton
                onClick={prevResponseSet}
                className="nav-arrow nav-arrow-left"
                aria-label="Previous responses"
              >
                ‹
              </IconButton>
            </Tooltip>
            
            <Typography className="response-counter">
              {currentResponseSet + 1} of {surveyResponses.length}
            </Typography>
            
            <Tooltip title="Next page" placement="right">
              <IconButton
                onClick={nextResponseSet}
                className="nav-arrow nav-arrow-right"
                aria-label="Next responses"
              >
                ›
              </IconButton>
            </Tooltip>
          </Box>

          {/* Response Cards Grid */}
          <Box className="responses-grid">
            {surveyResponses[currentResponseSet].map((response, index) => {
              // Determine if preview is truncated
              let isTruncated = false;
              if (response.type === 'comment') {
                isTruncated = response.content.length > 80;
              } else if (response.type === 'qa') {
                isTruncated = response.question.length > 60 || response.response.length > 60;
              }
              return (
                <Box 
                  key={`${currentResponseSet}-${index}`}
                  className={`response-card ${expandedCard === index ? 'expanded' : ''}`}
                  onClick={() => isTruncated && toggleCard(index)}
                  title={isTruncated ? (expandedCard === index ? "" : "Click for full response") : undefined}
                  style={{ cursor: isTruncated ? 'pointer' : 'default' }}
                >
                  <Box className="response-header">
                    <Box className="response-main-content">
                      <Typography className="response-name">
                        {response.name}
                      </Typography>
                      <Typography className="response-title">
                        {response.title}
                      </Typography>
                      {/* Only show preview if not expanded */}
                      {expandedCard !== index && (
                        response.type === 'comment' ? (
                          <Typography className="response-content">
                            "{response.content.length > 80
                              ? response.content.substring(0, 80) + "..."
                              : response.content}"
                          </Typography>
                        ) : (
                          <Box className="response-qa">
                            <Typography className="response-question">
                              Q: {response.question.length > 60
                                ? response.question.substring(0, 60) + "..."
                                : response.question}
                            </Typography>
                            <Typography className="response-answer">
                              A: {response.response.length > 60
                                ? response.response.substring(0, 60) + "..."
                                : response.response}
                            </Typography>
                          </Box>
                        )
                      )}
                    </Box>
                    {/* Only show expand button if truncated */}
                    {isTruncated && (
                      <Tooltip title="More information" placement="left">
                        <motion.div
                          className={`expand-arrow ${expandedCard === index ? 'expanded' : ''}`}
                          animate={{ 
                            rotate: expandedCard === index ? 90 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path 
                              d="M9 18l6-6-6-6" 
                              stroke="currentColor" 
                              strokeWidth="2.5" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            />
                            <path 
                              d="M5 18l6-6-6-6" 
                              stroke="currentColor" 
                              strokeWidth="2.5" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            />
                          </svg>
                        </motion.div>
                      </Tooltip>
                    )}
                  </Box>
                  <AnimatePresence>
                    {expandedCard === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="response-detail-container"
                      >
                        <Typography className="response-detail">
                          {response.type === 'comment' ? (
                            `"${response.content}"`
                          ) : (
                            <>
                              <Typography className="response-detail-question">
                                Q: {response.question}
                              </Typography>
                              <Typography className="response-detail-answer">
                                A: {response.response}
                              </Typography>
                            </>
                          )}
                        </Typography>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Box>
              );
            })}
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default Survey;
