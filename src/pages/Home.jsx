// src/pages/home.jsx
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Box, Typography, TextField, Button, IconButton, Tooltip } from '@mui/material';
import { KeyboardVoice as KeyboardVoiceIcon, Speed as SpeedIcon, LocalParking as ParkingIcon, ExpandMore as ExpandMoreIcon, ChevronLeft, ChevronRight, Update as UpdateIcon, People as PeopleIcon } from '@mui/icons-material';
import { FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence, useTime, useTransform, useSpring } from 'framer-motion';
import { validateWaitlistEmail, validateEmailRealTime, validateEmailOnSubmit } from '../utils/emailValidation';
import { useWaitlist } from '../context/WaitlistContext';
import { addToWaitlist } from '../services/users';
import '../styles/home.css';

import Main_Hero_Img from '../assets/App_Marc-d_Main_Page.png';
import Landing_Page_Img from '../assets/App_Landing_Page.png';
import Statistics_Img from '../assets/App_Statistics.png';
import Parking_Img from '../assets/App_Parking.png';
import Places_Img from '../assets/App_Marc\'d_Places.png';
import Navigation_Img from '../assets/App_Navigation.png';
import Alerts_Img from '../assets/App_Alerts_Image.png';
import healthFoodImg from '../assets/Health_Food.png';
import truckIcon from '../assets/Truck_Icon.png';
import launchingSoonImg from '../assets/Launching_Soon.png';
import socialProofImg from '../assets/Social_Proof.png';

// Video imports
const truckParkingVideo = '/videos/Truck_Parking_Home_Page.mp4';

// Import scroll images
import scrollImage1 from '../assets/Scroll Images/Image- 1.png';
import scrollImage2 from '../assets/Scroll Images/Image-2.png';
import scrollImage3 from '../assets/Scroll Images/Image-3.png';
import scrollImage4 from '../assets/Scroll Images/Image-4.png';
import scrollImage5 from '../assets/Scroll Images/Image-5.png';
import scrollImage6 from '../assets/Scroll Images/Image-6.png';
import scrollImage7 from '../assets/Scroll Images/Image-7.png';
import scrollImage8 from '../assets/Scroll Images/Image-8.png';
import scrollImage9 from '../assets/Scroll Images/Image-9.png';
import scrollImage10 from '../assets/Scroll Images/Image-10.png';
import scrollImage11 from '../assets/Scroll Images/Image-11.png';
import scrollImage12 from '../assets/Scroll Images/Image-12.png';
import scrollImage13 from '../assets/Scroll Images/Image-13.png';
import scrollImage14 from '../assets/Scroll Images/Image-14.png';
import scrollImage15 from '../assets/Scroll Images/Image-15.png';
import scrollImage16 from '../assets/Scroll Images/Image-16.png';



function home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showWaitlist, hideWaitlist, triggerWaitlist } = useWaitlist();
  const aboutRef = useRef(null);
  const waitlistRef = useRef(null);
  const didYouKnowRef = useRef(null);
  const solutionsRef = useRef(null);
  const marcItRef = useRef(null);
  const carouselRef = useRef(null);
  

  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [isDidYouKnowVisible, setIsDidYouKnowVisible] = useState(false);
  const [isSolutionsVisible, setIsSolutionsVisible] = useState(false);
  const [isWaitlistVisible, setIsWaitlistVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isMarcItVisible, setIsMarcItVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [currentSection, setCurrentSection] = useState('hero');
  const [arrowLeft, setArrowLeft] = useState('50%');
  const [showScrollTooltip, setShowScrollTooltip] = useState(false);
  const [isScrollingToTop, setIsScrollingToTop] = useState(false);
  const [firstArrowClicked, setFirstArrowClicked] = useState(false);
  const [firstSolutionArrowClicked, setFirstSolutionArrowClicked] = useState(false);
  const [isManualScrolling, setIsManualScrolling] = useState(false);
  
  // Action words for cycling animation
  const actionWords = ['Reward', 'Recognize', 'Uplift', 'Unite', 'Support', 'Thank', 'Value', 'Connect', 'Celebrate', 'Empower', 'Engage', 'Respect', 'Serve'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // Scroll words for Marc It! section
  const scrollWords = [
    { id: 1, text: 'DOT', image: scrollImage1 },
    { id: 2, text: 'Parking', image: scrollImage2 },
    { id: 3, text: 'Crime', image: scrollImage3 },
    { id: 4, text: 'Traffic', image: scrollImage4 },
    { id: 5, text: 'Police', image: scrollImage5 },
    { id: 6, text: 'Accident', image: scrollImage6 },
    { id: 7, text: 'Hazard', image: scrollImage7 },
    { id: 8, text: 'No Trucks', image: scrollImage8 },
    { id: 9, text: 'Bad Weather', image: scrollImage9 },
    { id: 10, text: 'Vegetarian', image: scrollImage10 },
    { id: 11, text: 'Clean Restrooms', image: scrollImage11 },
    { id: 12, text: 'Clean Showers', image: scrollImage12 },
    { id: 13, text: 'Healthy Food', image: scrollImage13 },
    { id: 14, text: 'Gym', image: scrollImage14 },
    { id: 15, text: 'Trucker Lounge', image: scrollImage15 },
    { id: 16, text: 'Halal Prepared Meals', image: scrollImage16 },
  ];

  // Hero image cycling animation - separated by size
  const smallHeroImages = [
    Main_Hero_Img, 
    Landing_Page_Img
  ];
  
  const largeHeroImages = [
    Statistics_Img, 
    Alerts_Img,
    Parking_Img, 
    Places_Img, 
    Navigation_Img
  ];
  
  // Combined array for cycling
  const heroImages = [...smallHeroImages, ...largeHeroImages];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [carouselHovered, setCarouselHovered] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const autoRotateIntervalRef = useRef(null);

  // Animated border setup following tutorial
  const time = useTime();
  const rotate = useTransform(time, [0, 3000], [0, 360], {
    clamp: false,
  });
  const rotatingBg = useTransform(rotate, (r) => {
    return `conic-gradient(from ${r}deg,rgb(222, 3, 3), #ff0000, #be0303d1, #c0c0c0, #a8a8a8, #be0303)`;
  });

  // Add pulsing animation
  const pulse = useSpring(0, { damping: 0, mass: 3, stiffness: 10 });
  const pulsingBg = useTransform(pulse, (r) => {
    // return `blur(${r * 2}px)`;
  });

  // Auto-rotate carousel every 8 seconds
  useEffect(() => {
    if (isAutoRotating && !carouselHovered) {
      autoRotateIntervalRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
      }, 8000);
    } else {
      if (autoRotateIntervalRef.current) {
        clearInterval(autoRotateIntervalRef.current);
        autoRotateIntervalRef.current = null;
      }
    }

    return () => {
      if (autoRotateIntervalRef.current) {
        clearInterval(autoRotateIntervalRef.current);
        autoRotateIntervalRef.current = null;
      }
    };
  }, [isAutoRotating, carouselHovered, heroImages.length]);

  // Auto-rotate action words every 4 seconds (independent of carousel)
  useEffect(() => {
    const actionWordInterval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % actionWords.length);
    }, 4000);

    return () => {
      clearInterval(actionWordInterval);
    };
  }, [actionWords.length]);

  // Infinite scroll animation for Marc It! section
  useEffect(() => {
    const scrollers = document.querySelectorAll(".scroller");

    // If a user hasn't opted in for reduced motion, then we add the animation
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      addAnimation();
    }

    function addAnimation() {
      scrollers.forEach((scroller) => {
        // add data-animated="true" to every `.scroller` on the page
        scroller.setAttribute("data-animated", true);

        // Make an array from the elements within `.scroller-inner`
        const scrollerInner = scroller.querySelector(".scroller__inner");
        const scrollerContent = Array.from(scrollerInner.children);

        // For each item in the array, clone it
        // add aria-hidden to it
        // add it into the `.scroller-inner`
        scrollerContent.forEach((item) => {
          const duplicatedItem = item.cloneNode(true);
          duplicatedItem.setAttribute("aria-hidden", true);
          scrollerInner.appendChild(duplicatedItem);
        });
      });
    }
  }, []);

  // Calculate arrow position based on carousel container center
  useEffect(() => {
    const updateArrowPosition = () => {
      if (carouselRef.current) {
        const carouselRect = carouselRef.current.getBoundingClientRect();
        // Get the true center of the carousel container
        const carouselCenter = carouselRect.left + carouselRect.width / 2;
        const viewportWidth = window.innerWidth;
        
        // Calculate the arrow's actual width
        const arrowElement = document.querySelector('.scroll-down-arrow');
        const arrowWidth = arrowElement ? arrowElement.offsetWidth : 60;
        
        // Center the arrow on the carousel container
        const arrowLeftPercent = ((carouselCenter - arrowWidth / 4) / viewportWidth) * 100;
        setArrowLeft(`${arrowLeftPercent}%`);
      }
    };

    // Update position on mount and resize
    updateArrowPosition();
    window.addEventListener('resize', updateArrowPosition);

    return () => {
      window.removeEventListener('resize', updateArrowPosition);
    };
  }, []);

  // Manual image navigation functions
  const goToPrevImage = () => {
    setIsAutoRotating(false);
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1
    );
  };

  const goToNextImage = () => {
    setIsAutoRotating(false);
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % heroImages.length
    );
  };

  // Touch/swipe handling for mobile
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNextImage();
    } else if (isRightSwipe) {
      goToPrevImage();
    }
  };

  // Handle carousel hover events
  const handleCarouselMouseEnter = () => {
    setCarouselHovered(true);
  };

  const handleCarouselMouseLeave = () => {
    setCarouselHovered(false);
  };

  // Handle manual navigation clicks
  const handleManualNavigation = (direction) => {
    setIsAutoRotating(false);
    if (direction === 'next') {
      goToNextImage();
    } else {
      goToPrevImage();
    }
  };

  // Handle indicator clicks
  const handleIndicatorClick = (index) => {
    setIsAutoRotating(false);
    setCurrentImageIndex(index);
  };

  // Get descriptive alt text for each image
  const getImageAltText = (index) => {
    const altTexts = [
      "Marc'd app main page - Dashboard view with trucking features",
      "Marc'd app landing page - Welcome and onboarding screen", 
      "Marc'd app statistics - Performance analytics and tracking data",
      "Marc'd app alerts - DOT alerts and safety notifications",
      "Marc'd app parking - Truck parking finder and availability",
      "Marc'd app places - Recommended truck-friendly locations",
      "Marc'd app navigation - GPS and route planning features"
    ];
    return altTexts[index] || `Marc'd app view ${index + 1}`;
  };

  // Function to determine if current image is small or large
  const isCurrentImageSmall = () => {
    return currentImageIndex < smallHeroImages.length;
  };

  // Handle email input change with comprehensive validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    // Clear any existing error when user starts typing
    if (emailError) {
      setEmailError('');
    }
  };

  // Handle waitlist submission
  const handleCloseWaitlist = () => {
    setIsClosing(true);
    hideWaitlist();
    // Wait for animation to complete, then hide
    setTimeout(() => {
      setIsWaitlistVisible(false);
      setIsClosing(false);
    }, 500);
  };

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email only when submit button is clicked
    const validation = validateEmailOnSubmit(email, 'waitlist');
    if (!validation.isValid) {
      setEmailError(validation.error);
      return;
    }

    try {
      // Submit email to waitlist API
      await addToWaitlist({ email: email.trim() });
      
      // Show success message
      setIsSubmitted(true);
      setEmail('');
      setEmailError('');
    } catch (error) {
      // Handle API errors
      console.error('Error adding to waitlist:', error);
      setEmailError('Failed to add to waitlist. Please try again.');
    }
  };

  // Smooth scroll to waitlist section
  const scrollToWaitlist = () => {
    waitlistRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Expose scrollToWaitlist globally for navbar access
  useEffect(() => {
    window.scrollToWaitlist = scrollToWaitlist;
    return () => {
      delete window.scrollToWaitlist;
    };
  }, []);

  // Scroll to waitlist if hash is present on mount
  useEffect(() => {
    if (window.location.hash === '#waitlist') {
      setTimeout(() => {
        waitlistRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100); // Delay to ensure DOM is ready
    }
  }, []);

  // Smooth scroll to top (Hero section)
  const scrollToTop = () => {
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Dynamic scroll function based on current section
  const handleDynamicScroll = () => {
    // Show tooltip when clicked
    setShowScrollTooltip(true);
    

    
    // Set manual scrolling flag to prevent intersection observer interference
    setIsManualScrolling(true);
    
    // Force trigger animations for the target section
    const triggerAnimations = (sectionRef, sectionClass) => {
      if (sectionRef.current) {
        const container = sectionRef.current;
        container.classList.add('animate');
        
        // Special handling for hero section
        if (sectionClass === 'home-hero-section') {
          const title = container.querySelector('.home-hero-headline');
          const description = container.querySelector('.home-hero-description');
          const button = container.querySelector('.hero-button-container');
          
          if (title) title.classList.add('animate');
          setTimeout(() => {
            if (description) description.classList.add('animate');
          }, 200);
          setTimeout(() => {
            if (button) button.classList.add('animate');
          }, 400);
        } else {
          // Trigger all child animations for other sections
          const animatedElements = container.querySelectorAll('[class*="animate"]');
          animatedElements.forEach(el => {
            if (!el.classList.contains('animate')) {
              el.classList.add('animate');
            }
          });
        }
      }
    };
    
    switch (currentSection) {
      case 'hero':
        setCurrentSection('marcIt');
        // Single smooth scroll to bottom of Marc It section
        const element = marcItRef.current;
        if (element) {
          const elementBottom = element.offsetTop + element.offsetHeight;
          const scrollTop = elementBottom - window.innerHeight + 170; // 170px buffer from bottom
          window.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
          });
          // Trigger Marc It! animations
          triggerAnimations(marcItRef, 'marc-it-outer-container');
        }
        // Hide tooltip after 2 seconds for forward navigation
        setTimeout(() => {
          setShowScrollTooltip(false);
          setIsManualScrolling(false);
        }, 2000);
        break;
      case 'marcIt':
        setCurrentSection('didYouKnow');
        didYouKnowRef.current?.scrollIntoView({ behavior: 'smooth' });
        // Hide tooltip after 2 seconds for forward navigation
        setTimeout(() => {
          setShowScrollTooltip(false);
          setIsManualScrolling(false);
        }, 2000);
        break;
      case 'didYouKnow':
        setCurrentSection('solutions');
        solutionsRef.current?.scrollIntoView({ behavior: 'smooth' });
        // Hide tooltip after 2 seconds for forward navigation
        setTimeout(() => {
          setShowScrollTooltip(false);
          setIsManualScrolling(false);
        }, 2000);
        break;
      case 'solutions':
        setCurrentSection('hero');
        setIsScrollingToTop(true);
        // Hide tooltip immediately when scrolling back to top
        setShowScrollTooltip(false);
        // Scroll to top of viewport to show entire Hero section
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        // Trigger hero animations
        setTimeout(() => {
          triggerAnimations(aboutRef, 'home-hero-section');
        }, 100);
        // Reset scrolling state after reaching top
        setTimeout(() => {
          setIsScrollingToTop(false);
          setIsManualScrolling(false);
        }, 2000);
        break;
      default:
        setCurrentSection('marcIt');
        marcItRef.current?.scrollIntoView({ behavior: 'smooth' });
        // Hide tooltip after 2 seconds for forward navigation
        setTimeout(() => {
          setShowScrollTooltip(false);
          setIsManualScrolling(false);
        }, 2000);
    }
  };

  // Toggle card expansion
  const toggleCard = (cardIndex) => {
    setExpandedCard(expandedCard === cardIndex ? null : cardIndex);
    // Stop the first arrow animation when it's clicked
    if (cardIndex === 0) {
      setFirstArrowClicked(true);
    }
    // Stop the first solution arrow animation when it's clicked
    if (cardIndex === 8) {
      setFirstSolutionArrowClicked(true);
    }
  };

  // Handle click outside to collapse cards
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.fact-item') && !event.target.closest('.solution-item')) {
        setExpandedCard(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Effect to handle waitlist from URL parameters and context
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const showWaitlistParam = urlParams.get('waitlist');
    
    if (showWaitlistParam === 'true') {
      setIsWaitlistVisible(true);
      // Clear the URL parameter
      navigate(location.pathname, { replace: true });
    } else if (showWaitlist) {
      // Handle context trigger
      setIsWaitlistVisible(true);
      hideWaitlist();
    }
  }, [location.search, navigate, showWaitlist, hideWaitlist]);

  // Effect to trigger animation when waitlist becomes visible
  useEffect(() => {
    if (isWaitlistVisible && waitlistRef.current) {
      // Small delay to ensure DOM is ready, then add visible class for animation
      setTimeout(() => {
        if (waitlistRef.current) {
          waitlistRef.current.classList.add('visible');
        }
      }, 50);
    } else if (!isWaitlistVisible && waitlistRef.current) {
      // Remove visible class immediately when hiding
      waitlistRef.current.classList.remove('visible');
    }
  }, [isWaitlistVisible]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.3, // Trigger when 30% of the section is visible
      rootMargin: '0px 0px -100px 0px' // Trigger slightly before the section is fully visible
    };

    // About Us section observer
    const aboutObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsAboutVisible(true);
            if (!isScrollingToTop && !isManualScrolling) {
              setCurrentSection('hero');
            }
            
            // Trigger hero animations when section is 5% visible
            if (entry.intersectionRatio >= 0.05) {
              const container = entry.target;
              const title = container.querySelector('.home-hero-headline');
              const description = container.querySelector('.home-hero-description');
              const button = container.querySelector('.hero-button-container');
              
              // Animate title
              if (title) title.classList.add('animate');
              
              // Animate description after title
              setTimeout(() => {
                if (description) description.classList.add('animate');
              }, 200);
              
              // Animate button after description
              setTimeout(() => {
                if (button) button.classList.add('animate');
              }, 400);
            }
          }
        });
      },
      { threshold: [0.05, 0.3], rootMargin: '0px 0px -100px 0px' }
    );

    // Did You Know section observer
    const didYouKnowObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsDidYouKnowVisible(true);
            if (!isScrollingToTop && !isManualScrolling) {
              setCurrentSection('didYouKnow');
            }
          }
        });
      },
      observerOptions
    );

    // Solutions section observer
    const solutionsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsSolutionsVisible(true);
            if (!isScrollingToTop && !isManualScrolling) {
              setCurrentSection('solutions');
            }
          }
        });
      },
      observerOptions
    );

    // Marc It! section observer
    const marcItObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
                      if (entry.isIntersecting) {
          
              setIsMarcItVisible(true);
              if (!isScrollingToTop && !isManualScrolling) {
            
                setCurrentSection('marcIt');
              }
            
            // Trigger animations when section is 5% visible
            if (entry.intersectionRatio >= 0.05) {
          
              const container = entry.target;
              const title = container.querySelector('.marc-it-title');
              const scrollItems = container.querySelectorAll('.scroll-item');
              
              // Animate container
              container.classList.add('animate');
              
              // Animate title after container animation
              setTimeout(() => {
                if (title) title.classList.add('animate');
              }, 400);
              
              // Animate scroll items after title animation
              setTimeout(() => {
                scrollItems.forEach((item, index) => {
                  setTimeout(() => {
                    item.classList.add('animate');
                  }, index * 50); // 50ms stagger between each item
                });
              }, 600);
            }
          }
        });
      },
      { threshold: [0.05, 0.3], rootMargin: '0px 0px -100px 0px' }
    );

    // Waitlist section observer
    const waitlistObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
                      if (entry.isIntersecting) {
          
              setIsWaitlistVisible(true);
              if (!isScrollingToTop && !isManualScrolling) {
                setCurrentSection('waitlist');
              }
            
            // Trigger animations when section is 5% visible
            if (entry.intersectionRatio >= 0.05) {
          
              const container = entry.target;
              const title = container.querySelector('.waitlist-title');
              const launchingSoon = container.querySelector('.launching-soon-container');
              const perks = container.querySelector('.perks-section');
              const description = container.querySelector('.waitlist-description');
              const form = container.querySelector('.waitlist-form');
              
              // Animate container
              container.classList.add('animate');
              
              // Animate title after container animation
              setTimeout(() => {
                if (title) title.classList.add('animate');
              }, 200);
              
              // Animate launching soon image
              setTimeout(() => {
                if (launchingSoon) launchingSoon.classList.add('animate');
              }, 400);
              
              // Animate perks section
              setTimeout(() => {
                if (perks) perks.classList.add('animate');
              }, 600);
              
              // Animate description
              setTimeout(() => {
                if (description) description.classList.add('animate');
              }, 800);
              
              // Animate form
              setTimeout(() => {
                if (form) form.classList.add('animate');
              }, 1000);
            }
          }
        });
      },
      { threshold: [0.05, 0.3], rootMargin: '0px 0px -100px 0px' }
    );

    // Observe all sections
    if (aboutRef.current) {
      aboutObserver.observe(aboutRef.current);
    }
    if (marcItRef.current) {
      marcItObserver.observe(marcItRef.current);
    }
    if (didYouKnowRef.current) {
      didYouKnowObserver.observe(didYouKnowRef.current);
    }
    if (solutionsRef.current) {
      solutionsObserver.observe(solutionsRef.current);
    }
    if (waitlistRef.current) {
      waitlistObserver.observe(waitlistRef.current);
    }

    return () => {
      if (aboutRef.current) {
        aboutObserver.unobserve(aboutRef.current);
      }
      if (marcItRef.current) {
        marcItObserver.unobserve(marcItRef.current);
      }
      if (didYouKnowRef.current) {
        didYouKnowObserver.unobserve(didYouKnowRef.current);
      }
      if (solutionsRef.current) {
        solutionsObserver.unobserve(solutionsRef.current);
      }
      if (waitlistRef.current) {
        waitlistObserver.unobserve(waitlistRef.current);
      }
    };
  }, [isScrollingToTop, isManualScrolling]);

  // Animation variants for the action words
  const wordVariants = {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.8
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      scale: 0.8,
      transition: {
        duration: 0.4,
        ease: "easeIn"
      }
    }
  };

  // Animation variants for the hero image carousel (no exit animation)
  const imageVariants = {
    initial: {
      opacity: 0,
      x: 50,
      scale: 0.98
    },
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    exit: {
      opacity: 0,
      x: -50,
      scale: 0.98,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <Box className="home-page-container">
      {/* Home Hero Section - Full Viewport */}
      <Box className="home-hero-section" ref={aboutRef}>
        {/* Left Column - Text Content */}
        <Box className="home-hero-text">
          <Typography 
            variant="h1" 
            className={`home-hero-headline ${isAboutVisible ? 'animate' : ''}`}
          >
            Built to
            <br />
            <Box component="span" style={{ display: 'block', minHeight: '1.2em', position: 'relative' }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={actionWords[currentWordIndex]}
                  variants={wordVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  style={{
                    display: 'block',
                    background: 'linear-gradient(to left, rgb(235, 4, 4), rgb(202, 2, 2), rgb(220, 217, 217), rgb(212, 2, 9))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontWeight: 'bold'
                  }}
                >
                  {actionWords[currentWordIndex]}
                </motion.span>
              </AnimatePresence>
            </Box>
            truckers.
          </Typography>
          <Typography className={`home-hero-description ${isAboutVisible ? 'animate' : ''}`}>
            Wherever the road takes you, Marc'd is there! Trucking isn't just work; it's a way of life. It keeps America moving, and you deserve a partner that moves with you.
          </Typography>
          <motion.div
            className="home-hero-bullets"
            initial={{ opacity: 0, x: -50 }}
            animate={{ 
              opacity: isAboutVisible ? 1 : 0, 
              x: isAboutVisible ? 0 : -50 
            }}
            transition={{ 
              duration: 0.8, 
              ease: "easeOut",
              delay: 0.3
            }}
          >
            <Box className="hero-bullet">
              <ParkingIcon className="hero-bullet-icon" />
              <span>parking</span>
            </Box>
            <Box className="hero-bullet">
              <UpdateIcon className="hero-bullet-icon" />
              <span>updates</span>
            </Box>
            <Box className="hero-bullet">
              <PeopleIcon className="hero-bullet-icon" />
              <span>community</span>
            </Box>
          </motion.div>
          <Box className={`hero-button-container ${isAboutVisible ? 'animate' : ''}`} sx={{ position: 'relative' }}>
            <motion.div
              className="absolute -inset-[1.5px] rounded-md"
              style={{
                position: 'absolute',
                inset: '-1px',
                borderRadius: '8px',
                background: rotatingBg,
                zIndex: 0,
                filter: 'blur(5px)',
              }}
            />
            <Button 
              className="hero-button"
              onClick={() => {
                triggerWaitlist();
              }}
            >
              Join Waitlist
            </Button>
          </Box>
          <motion.div
            className="social-proof-container"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isAboutVisible ? 1 : 0, y: isAboutVisible ? 0 : 30 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.7 }}
            style={{ display: 'flex', alignItems: 'left', justifyContent: 'left', marginTop: '1rem' }}
          >
            <img 
              src={socialProofImg} 
              alt="Social proof - trusted by truckers" 
              className="social-proof-image"
            />
            <Box className="social-proof-text">
              Stephen L. and 200+ others have already joined.
            </Box>
          </motion.div>
        </Box>

        {/* Right Column - Image Carousel */}
        <Box className="home-hero-image-carousel">
          {/* Left Navigation Arrow (Desktop) */}
          <Tooltip title={<span className="carousel-tooltip">Click for Previous Image</span>} placement="left" arrow classes={{ popper: 'carousel-tooltip-popper' }}>
            <IconButton 
              className="carousel-nav-left"
              onClick={() => handleManualNavigation('prev')}
              aria-label="Previous image"
            >
              <ChevronLeft />
            </IconButton>
          </Tooltip>

          {/* Image Container with Swipe Support */}
          <Box 
            ref={carouselRef}
            className="carousel-image-container"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onClick={() => handleManualNavigation('next')}
            onMouseEnter={handleCarouselMouseEnter}
            onMouseLeave={handleCarouselMouseLeave}
            style={{ cursor: 'pointer', position: 'relative' }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={heroImages[currentImageIndex]}
                alt={getImageAltText(currentImageIndex)}
                className={`home-main-image ${isAboutVisible ? 'animate' : ''} ${isCurrentImageSmall() ? 'small-image' : 'large-image'}`}
                variants={imageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{
                  width: isCurrentImageSmall() ? '100%' : '100%',
                  height: isCurrentImageSmall() ? '600px' : '100%',
                  maxWidth: '100%',
                  objectFit: isCurrentImageSmall() ? 'cover' : 'contain',
                  objectPosition: 'center'
                }}
              />
            </AnimatePresence>
            {/* Image Indicators */}
            <Box className="carousel-indicators">
              {heroImages.map((_, index) => (
                <Box
                  key={index}
                  className={`carousel-dot ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => handleIndicatorClick(index)}
                />
              ))}
            </Box>
          </Box>

          {/* Right Navigation Arrow (Desktop) */}
          <Tooltip title={<span className="carousel-tooltip">Click for Next Image</span>} placement="right" arrow classes={{ popper: 'carousel-tooltip-popper' }}>
            <IconButton 
              className="carousel-nav-right"
              onClick={() => handleManualNavigation('next')}
              aria-label="Next image"
            >
              <ChevronRight />
            </IconButton>
          </Tooltip>
                </Box>
      </Box>

      {/* Dynamic Scroll Arrow */}
      <Tooltip 
        title={<span className="scroll-tooltip">{currentSection === 'solutions' ? 'Back to top' : 'Next section'}</span>}
        onMouseEnter={() => setShowScrollTooltip(true)}
        onMouseLeave={() => setShowScrollTooltip(false)} 
        placement="top" 
        arrow 
        open={showScrollTooltip}
        onClose={() => setShowScrollTooltip(false)}
        classes={{ popper: 'scroll-tooltip-popper' }}
      >
                  <Box 
            className={`scroll-down-arrow ${currentSection === 'solutions' ? 'back-to-top' : ''}`}
            onClick={handleDynamicScroll}
            tabIndex={0}
            style={{ left: arrowLeft }}
          >
          <FaChevronDown 
            className={`arrow-icon ${currentSection === 'solutions' ? 'rotated' : ''}`} 
          />
        </Box>
      </Tooltip>

      {/* Join Waitlist Section - Conditionally Rendered */}
      {isWaitlistVisible && (
        <Box 
          id="waitlist" 
          className="waitlist-section visible" 
          ref={waitlistRef}
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            animation: isWaitlistVisible && !isClosing ? 'slideInUp 0.6s ease-out' : isClosing ? 'slideOutDown 0.5s ease-in' : 'none'
          }}
        >
          {/* Overlay background - clickable to close */}
          <div
            onClick={handleCloseWaitlist}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(5px)',
              cursor: 'pointer'
            }}
          />
          {/* Close button */}
          <button
            onClick={handleCloseWaitlist}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '2rem',
              cursor: 'pointer',
              zIndex: 10000,
              padding: '10px',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            ×
          </button>

                      <Box 
              className="waitlist-content"
              style={{
                animation: isWaitlistVisible && !isClosing ? 'contentSlideIn 0.7s ease-out 0.3s both' : isClosing ? 'contentSlideOut 0.5s ease-in both' : 'none'
              }}
            >
              <Typography variant="h3" className="waitlist-title animate">
                Join the Waitlist
              </Typography>
              <Box className="launching-soon-container animate">
              <img 
                src={launchingSoonImg} 
                alt="Launching Soon" 
                className="launching-soon-image"
              />
            </Box>
                          <Box className="perks-section animate">
                <div className="perks-title-container">
                <h2 className="perks-title">
                  Get early access, exclusive perks, and special launch rewards.
                </h2>
                <span className="confetti-container">
                  <span className="confetti">🎉</span>
                  <span className="confetti">✨</span>
                  <span className="confetti">🎊</span>
                  <span className="confetti">⭐</span>
                  <span className="confetti">🎁</span>
                </span>
              </div>
            </Box>
                          <Typography className="waitlist-description animate">
                Be the first to experience Marc'd when we launch. Enter your email to get notified and receive the latest updates.
              </Typography>
              
              <Box component="form" onSubmit={handleWaitlistSubmit} className="waitlist-form animate">
              <Box className="email-input-wrapper">
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email address"
                  className="email-input-field"
                />
                <button
                  type="submit"
                  className="join-button"
                  disabled={!email}
                >
                  Join
                </button>
              </Box>
              {emailError && (
                <Typography className="error-message">
                  {emailError}
                </Typography>
              )}
              
              {isSubmitted && (
                <Typography className="success-message">
                  🎉 Thank you! You've been added to our waitlist.
                </Typography>
              )}
              
              <Typography className="privacy-message">
                We respect your privacy. Your email will only be used to notify you about Marc'd updates.
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Marc It! Infinite Scroll Section */}
      <Box className="marc-it-outer-container" ref={marcItRef}>
        <Box className="marc-it-inner-container">
          <Typography variant="h2" className="marc-it-title">
            You have helpful information to share.
            <br />
            <br />
            We have a place to Marc It!
          </Typography>
          
          {/* Words scrolling to the right */}
          <div className="scroller" data-direction="right" data-speed="slow">
            <ul className="tag-list scroller__inner">
              {scrollWords.map((word) => (
                <li key={`word-${word.id}`} className="scroll-item word-item">
                  <span className="scroll-text">{word.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Images scrolling to the left */}
          <div className="scroller" data-direction="left" data-speed="slow">
            <ul className="tag-list scroller__inner">
              {scrollWords.map((word) => (
                <li key={`image-${word.id}`} className="scroll-item image-item">
                  <div className="scroll-content">
                    <img 
                      src={word.image} 
                      alt={word.text}
                      className="scroll-image"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Box>
      </Box>

      {/* Did You Know Section */}
      <Box className={`did-you-know-section ${isDidYouKnowVisible ? 'visible' : ''}`} ref={didYouKnowRef}>
        <div className="video-overlay"></div>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          preload="metadata"
          className="background-video"
        >
          <source src={truckParkingVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <Box className="did-you-know-content">
          <Typography variant="h3" className="did-you-know-title">
            <img src={truckIcon} alt="Truck" className="truck-icon" />
            Did You Know?
          </Typography>
          
          <Box className="facts-grid">
            {[
              {
                stat: "100%",
                text: "truckers rely on each other.",
                detail: "Helping spot into tight docks or sharing where to park is often all they have."
              },
              {
                stat: "98%",
                text: "struggle to find safe parking.",
                detail: "Only 1 authorized spot exists for every 11 trucks, costing drivers up to $5,500 a year in wasted time and fuel."
              },
              {
                stat: "88%",
                text: "have at least one cardiometabolic risk.",
                detail: "Hypertension, smoking, and obesity are common—jeopardizing health and careers."
              },
              {
                stat: "69%",
                text: "are obese—twice the U.S. average.",
                detail: "Long hours, little exercise, and unhealthy food access drive this crisis."
              },
              {
                stat: "1.7×",
                text: "higher risk of heart disease.",
                detail: "Nearly 50% have cardiovascular conditions, compared to just 30% of the general population."
              },
              {
                stat: "53%",
                text: "of DOT violations are preventable.",
                detail: "Parking illegally or rushing to meet deadlines leads to costly CSA points, insurance hikes, and job risks."
              },
              {
                stat: "image",
                statImage: healthFoodImg,
                text: "healthy or halal-prepared meals are scarce.",
                detail: "Most rely on quick, unhealthy stops simply to keep moving."
              },
              {
                stat: "icon",
                statIcon: SpeedIcon,
                text: "speeding is a top safety violation.",
                detail: "Drivers often exceed limits without realizing, putting safety scores—and lives—at risk."
              }
            ].map((fact, index) => (
              <Box 
                key={index} 
                className={`fact-item ${expandedCard === index ? 'expanded' : ''} ${index === 0 && firstArrowClicked ? 'arrow-clicked' : ''}`}
                onClick={() => toggleCard(index)}
                title={expandedCard === index ? "" : "Click for more details"}
              >
                <Box className="fact-main-content">
                  {fact.stat && fact.stat !== "image" && fact.stat !== "icon" && (
                    <Typography className="fact-stat">{fact.stat}</Typography>
                  )}
                  {fact.stat === "image" && fact.statImage && (
                    <img src={fact.statImage} alt="Healthy food" className="fact-stat-image" />
                  )}
                  {fact.stat === "icon" && fact.statIcon && (
                    <fact.statIcon className="fact-stat-icon" />
                  )}
                  <Typography className="fact-text">
                    {fact.text}
                  </Typography>
                </Box>
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
                <AnimatePresence>
                  {expandedCard === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="fact-detail-container"
                    >
                      <Typography className="fact-detail">
                        {fact.detail}
                      </Typography>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
                          ))}
          </Box>
        </Box>
      </Box>

      {/* Marc'd Solutions Section */}
      <Box className={`marcd-solutions-section ${isSolutionsVisible ? 'visible' : ''}`} ref={solutionsRef}>
        <div className="video-overlay"></div>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          preload="metadata"
          className="background-video"
        >
          <source src={truckParkingVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <Box className="marcd-solutions-content">
          <Typography variant="h3" className="solutions-title">
            ✅ How Marc'd Solves These Problems
          </Typography>
          
          <Box className="solutions-grid">
            {[
              {
                icon: <ParkingIcon className="solution-stat-icon" />,
                title: "Real-time parking",
                text: "Shows available safe spots right now, so you stop wasting hours hunting.",
                detail: "Our community-driven parking system provides live updates from fellow drivers, helping you find open spots before you even arrive. No more circling truck stops or parking illegally, save time, fuel, and avoid violations."
              },
              {
                icon: <img src={healthFoodImg} alt="Healthy food" className="solution-stat-image" />,
                title: "Wellness support",
                text: "Locates cleaner stops, healthier food, even halal options, so you can take care of yourself on the road.",
                detail: "Find truck stops with healthy meal options, clean facilities, and dietary-specific choices including halal and vegetarian options. Your health matters, and we help you maintain it while on the road."
              },
              {
                icon: <SpeedIcon className="solution-stat-icon" />,
                title: "Speed alerts & compliance tools",
                text: "Helps you avoid CSA violations and protect your safety record.",
                detail: "Real-time speed monitoring and DOT compliance alerts help you maintain a clean driving record. Avoid costly violations, insurance hikes, and protect your livelihood with proactive safety tools."
              },
              {
                icon: <KeyboardVoiceIcon className="solution-stat-icon" />,
                title: "Voice-activated & hands-free",
                text: "Keep eyes on the road while updating parking or checking conditions.",
                detail: "Complete hands-free operation means you can report conditions, check parking, and get navigation updates without ever taking your hands off the wheel or eyes off the road."
              },
              {
                icon: <Typography className="solution-stat-emoji">🤝</Typography>,
                title: "Community updates",
                text: "Drivers help each other with parking, hazards, or spotting, and earn rewards for it.",
                detail: "Join a supportive community where drivers look out for each other. Share parking updates, road conditions, and spotting assistance while earning Marc'er points that convert to real cash rewards."
              }
            ].map((solution, index) => (
              <Box 
                key={index} 
                className={`solution-item ${expandedCard === index + 8 ? 'expanded' : ''} ${index === 0 && firstSolutionArrowClicked ? 'arrow-clicked' : ''}`}
                onClick={() => toggleCard(index + 8)}
                title={expandedCard === index + 8 ? "" : "Click for more details"}
              >
                <Box className="solution-main-content">
                  {solution.icon}
                  <Typography className="solution-text">
                    {solution.text}
                  </Typography>
                </Box>
                <motion.div
                  className={`expand-arrow ${expandedCard === index + 8 ? 'expanded' : ''}`}
                  animate={{ 
                    rotate: expandedCard === index + 8 ? 90 : 0,
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
                <AnimatePresence>
                  {expandedCard === index + 8 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="solution-detail-container"
                    >
                      <Typography className="solution-detail">
                        {solution.detail}
                      </Typography>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
                          ))}
          </Box>

          <Typography className="tagline">
            Because "The journey is easier when it's Marc'd."
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Button
              variant="outlined"
              size="small"
              sx={{
                mt: 2,
                color: '#be0303',
                borderColor: '#be0303',
                fontWeight: 600,
                borderRadius: '20px',
                textTransform: 'none',
                background: 'rgba(255, 255, 255, 0.48)',
                '&:hover': {
                  background: 'rgba(190,3,3,0.08)',
                  borderColor: '#be0303',
                  color: '#be0303',
                },
              }}
              onClick={() => navigate('/features')}
            >
              See Features
            </Button>
          </Box>
        </Box>
      </Box>

    </Box>
  );
}

export default home;