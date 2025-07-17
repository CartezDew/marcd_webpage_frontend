import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Container, CircularProgress, IconButton, Tooltip } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/survey.css';
// Import social proof image
import socialProofImage from '../assets/Social_Proof.png';

// Animation variants for cards
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  })
};

function Survey() {
  const [isLoading, setIsLoading] = useState(true);
  const [isIntroVisible, setIsIntroVisible] = useState(false);
  const [isResponsesVisible, setIsResponsesVisible] = useState(false);
  const [isFirstViewport, setIsFirstViewport] = useState(true);
  const [currentResponseSet, setCurrentResponseSet] = useState(0);
  const [expandedCard, setExpandedCard] = useState(null);
  const [hasIntroAnimated, setHasIntroAnimated] = useState(false);
  const [hasResponsesAnimated, setHasResponsesAnimated] = useState(false);
  const widgetRef = useRef(null);
  const introRef = useRef(null);
  const responsesRef = useRef(null);

  // Survey responses data
  const surveyResponses = [
    [
      {
        name: "Kenneth M.",
        title: "Company Driver",
        type: "comment",
        content: "Less paid parking since 90% of drivers spend 1000's of dollars every week at these truck stops."
      },
      {
        name: "Jato Trucking",
        title: "Owner Operator",
        type: "comment",
        content: "Truck stop are there to provide truckers a place to rest. It should always be free parking FCFS. No reserved parking."
      },
      {
        name: "Nathan B.",
        title: "Owner Operator",
        type: "comment",
        content: "I don't feel that truckers should be responsible for paying for any apps to help with parking. Government should extend parking spots at rest areas. Most rest areas have limited spaces."
      }
    ],
    [
      {
        name: "Kenneth M.",
        title: "Company Driver",
        type: "qa",
        question: "If searching for parking affects your sleep or alertness, can you describe how it impacts your driving experience?",
        response: "Uncomfortable"
      },
      {
        name: "Andre G.",
        title: "Independent Contractor",
        type: "qa",
        question: "How does the difficulty in finding parking affect your daily schedule and earnings?",
        response: "It really affects us as the time I take to find parking I’m either late for the next delivery or I don’t make it at all."
      },
      {
        name: "Gift M.",
        title: "Company Driver",
        type: "qa",
        question: "What are the safety concerns you face when parking in unauthorized areas?",
        response: "Theft"
      }
    ],
    [
      {
        name: "Kelvin M.",
        title: "Company Driver",
        type: "qa",
        question: "How often do you need to take significant detours to find safe parking?",
        response: "Three or more times a week"
      },
      {
        name: "Chad L.",
        title: "Owner Operator",
        type: "qa",
        question: "How often do you need to take significant detours to find safe parking?",
        response: "Three or more times a week"
      },
      {
        name: "Clederson M.",
        title: "Company Driver",
        type: "qa",
        question: "If searching for parking affects your sleep or alertness, can you describe how it impacts your driving experience?",
        response: "Not really affected sleep or alertness trying to find a safe place to pull over. If the delivery location or shipper needs you to move out the way that’s when it gets difficult."
      }
    ],
    [
      {
        name: "Roger M.",
        title: "Company Driver",
        type: "qa",
        question: "Do you have any other comments or suggestions regarding finding truck parking or features for a parking app?",
        response: "I think it would give a lot of truckers peace of mind knowing they will have a place to park instead of driving around looking for a spot."
      },
      {
        name: "Nathan B.",
        title: "Owner Operator",
        type: "qa",
        question: "If searching for parking affects your sleep or alertness, can you describe how it impacts your driving experience?",
        response: "If I’m unable to find parking, you get into the red and lose hours of service (HOS) which could impact sleep."
      },
      {
        name: "Brian V.",
        title: "Company Driver",
        type: "qa",
        question: "How often do you park in an unsafe area due to lack of available parking?",
        response: "Twice a week"
      }
    ],
    [
      {
        name: "Don A.",
        title: "Company Driver",
        type: "qa",
        question: "What are the safety concerns you face when parking in unauthorized areas?",
        response: "Theft, people knocking on doors"
      },
      {
        name: "Will H.",
        title: "Owner Operator",
        type: "qa",
        question: "How does the difficulty in finding parking affect your daily schedule and earnings?",
        response: "Loses money, sometimes have to pay to park"
      }
    ]
  ];

  // Intersection Observer for intro section (first viewport)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasIntroAnimated) {
          setIsIntroVisible(true);
          setHasIntroAnimated(true);
        }
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
  }, [hasIntroAnimated]);

  // Intersection Observer for responses section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasResponsesAnimated) {
          setIsResponsesVisible(true);
          setHasResponsesAnimated(true);
        }
        if (entry.isIntersecting) {
          setIsFirstViewport(false);
        }
      },
      {
        threshold: 0.7,
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
  }, [hasResponsesAnimated]);

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
        import.meta.env.VITE_SURVEY_MONKEY_WIDGET_URL;

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

  // Dynamic scroll function - scrolls to responses section or back to top
  const handleScrollAction = () => {
    if (isFirstViewport) {
      // If we're in the first viewport, scroll to responses section
      if (responsesRef.current) {
        responsesRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else {
      // If we're in the responses section, scroll back to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {/* Dynamic Scroll Button */}
      <Box 
        className={`scroll-to-top-button ${isFirstViewport ? 'first-viewport' : 'other-viewport'}`}
        onClick={handleScrollAction}
      >
        {isFirstViewport ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
      </Box>

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
      <Container maxWidth="lg" className="survey-embed-container">
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
          <Typography variant="h3" className={`responses-title ${isResponsesVisible ? 'animate' : ''}`}>
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
              className="survey-social-proof-image"
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
                className={`nav-arrow nav-arrow-left${currentResponseSet === surveyResponses.length - 1 ? ' nav-arrow-animate' : ''}`}
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
                className={`nav-arrow nav-arrow-right${currentResponseSet < surveyResponses.length - 1 ? ' nav-arrow-animate' : ''}`}
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
                <motion.div
                  key={`${currentResponseSet}-${index}-${isResponsesVisible}`}
                  className={`response-card ${expandedCard === index ? 'expanded' : ''}`}
                  onClick={() => isTruncated && toggleCard(index)}
                  title={isTruncated ? (expandedCard === index ? "" : "Click for full response") : undefined}
                  style={{ cursor: isTruncated ? 'pointer' : 'default' }}
                  variants={cardVariants}
                  initial="hidden"
                  animate={isResponsesVisible ? "visible" : "hidden"}
                  custom={index + 1}
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
                </motion.div>
              );
            })}
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default Survey;