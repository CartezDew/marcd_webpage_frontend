// src/pages/home.jsx
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Box, Typography, TextField, Button, IconButton, Tooltip } from '@mui/material';
import { KeyboardVoice as KeyboardVoiceIcon, Speed as SpeedIcon, LocalParking as ParkingIcon, ExpandMore as ExpandMoreIcon, ChevronLeft, ChevronRight, Update as UpdateIcon, People as PeopleIcon, LocalShipping as LocalShippingIcon, Devices as DevicesIcon, TrendingUp as TrendingUpIcon, FitnessCenter as FitnessCenterIcon, Gavel as GavelIcon, Restaurant as RestaurantIcon, AttachMoney as CashIcon } from '@mui/icons-material';
import { FaChevronDown, FaInstagram, FaFacebook } from 'react-icons/fa';
import { motion, AnimatePresence, useTime, useTransform, useSpring, useInView } from 'framer-motion';
import { validateWaitlistEmail, validateEmailRealTime, validateEmailOnSubmit } from '../utils/emailValidation';
import { useWaitlist } from '../context/WaitlistContext';
import { addToWaitlist } from '../services/users';
import AppLoading from '../components/AppLoading';
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
import truckerWithFamilyImg from '../assets/Trucker_with_family.jpg';
import truckerOnPhoneImg from '../assets/Trucker_on_phone.jpg';
import happyTrucker1Img from '../assets/Happy_Truckers_1.jpg';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';

// Video imports - will be loaded lazily
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
import scrollImage16 from '../assets/Scroll Images/Image-16.jpg';



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
  const [currentFactPage, setCurrentFactPage] = useState(0);
  const [currentSolutionPage, setCurrentSolutionPage] = useState(0);
  
  // Progressive loading states
  const [shouldLoadVideos, setShouldLoadVideos] = useState(false);
  const [shouldLoadImages, setShouldLoadImages] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Show loading screen initially
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const [videosLoaded, setVideosLoaded] = useState({
    didYouKnow: false,
    solutions: false
  });
  
  // Video auto-play refs
  const didYouKnowVideoRef = useRef(null);
  const solutionsVideoRef = useRef(null);
  
  // Trucker images animation
  const truckerImagesRef = useRef(null);
  const isTruckerImagesInView = useInView(truckerImagesRef, { 
    amount: 0.05, // 5% of the element must be visible
    once: true 
  });
  
  // Footer social media icons animation
  const footerSocialRef = useRef(null);
  const isFooterSocialInView = useInView(footerSocialRef, { 
    threshold: 0.05, // Trigger when 5% visible
    rootMargin: '0px 0px -50px 0px'
  });

  // Title animations
  const didYouKnowTitleRef = useRef(null);
  const isDidYouKnowTitleInView = useInView(didYouKnowTitleRef, {
    amount: 0.05, // 5% of the element must be visible
    once: true
  });

  const solutionsTitleRef = useRef(null);
  const isSolutionsTitleInView = useInView(solutionsTitleRef, {
    amount: 0.05, // 5% of the element must be visible
    once: true
  });
  
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

  // Progressive loading effect
  useEffect(() => {
    // Count critical images (carousel images and main hero images)
    const criticalImages = [
      Main_Hero_Img,
      Landing_Page_Img,
      Statistics_Img,
      Parking_Img,
      Places_Img,
      Navigation_Img,
      Alerts_Img,
      socialProofImg,
      launchingSoonImg
    ];

    setTotalImages(criticalImages.length);

    // Check if content is already cached/ready
    const checkIfImagesAreCached = () => {
      let cachedCount = 0;
      
      criticalImages.forEach((imageSrc) => {
        const img = new Image();
        img.onload = () => {
          cachedCount++;
          if (cachedCount === criticalImages.length) {
            // All images are cached, content is ready
            setContentReady(true);
            setImagesLoaded(criticalImages.length);
            setIsLoading(false);
          }
        };
        img.onerror = () => {
          cachedCount++;
          if (cachedCount === criticalImages.length) {
            setContentReady(true);
            setImagesLoaded(criticalImages.length);
            setIsLoading(false);
          }
        };
        img.src = imageSrc;
      });
    };

    // Start loading images immediately
    setShouldLoadImages(true);

    // Check if images are already cached
    checkIfImagesAreCached();

    // If not cached, show loading with minimum time
    if (!contentReady) {
      // Minimum 1-second timer (reduced since we're being smarter)
      const minTimeTimer = setTimeout(() => {
        setMinTimeElapsed(true);
      }, 1000);

      // Preload critical images if not cached
      let loadedCount = 0;
      let allImagesLoaded = false;
      
      const checkIfCanHideLoading = () => {
        // Only hide loading if all conditions are met and content isn't already ready
        if (allImagesLoaded && minTimeElapsed && !isWaitlistVisible && !contentReady) {
          setTimeout(() => {
            setIsLoading(false);
            setContentReady(true);
          }, 200);
        }
      };
      
      criticalImages.forEach((imageSrc) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          setImagesLoaded(loadedCount);
          
          if (loadedCount >= criticalImages.length) {
            allImagesLoaded = true;
            checkIfCanHideLoading();
          }
        };
        img.onerror = () => {
          loadedCount++;
          setImagesLoaded(loadedCount);
          
          if (loadedCount >= criticalImages.length) {
            allImagesLoaded = true;
            checkIfCanHideLoading();
          }
        };
        img.src = imageSrc;
      });

      // Fallback: hide loading after maximum 3 seconds (unless waitlist is visible)
      const fallbackTimer = setTimeout(() => {
        if (!isWaitlistVisible) {
          setIsLoading(false);
          setContentReady(true);
        }
      }, 3000);

      return () => {
        clearTimeout(minTimeTimer);
        clearTimeout(fallbackTimer);
      };
    }

    // Start loading videos independently after content is ready (don't wait for them)
    const videoTimer = setTimeout(() => {
      setShouldLoadVideos(true);
    }, 2000); // Start videos later, after main content loads

    return () => {
      clearTimeout(videoTimer);
    };
  }, [minTimeElapsed, isWaitlistVisible, contentReady]);

  // Hide loading overlay immediately when waitlist becomes visible
  useEffect(() => {
    if (isWaitlistVisible) {
      setIsLoading(false);
    }
  }, [isWaitlistVisible]);

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
      
      // Auto-close waitlist screen after 5 seconds
      setTimeout(() => {
        handleCloseWaitlist();
      }, 5000);
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

  // Force scroll to top on page refresh/initial load
  useEffect(() => {
    // Only scroll to top if there's no hash in the URL
    if (!window.location.hash) {
      // Force immediate scroll to top to override browser scroll restoration
      window.history.scrollRestoration = 'manual'; // Disable automatic scroll restoration
      
      const forceScrollToTop = () => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      };
      
      // Execute immediately
      forceScrollToTop();
      
      // Execute again after DOM is ready
      setTimeout(forceScrollToTop, 10);
      setTimeout(forceScrollToTop, 50);
    }
  }, []); // Only run once on mount

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
          const scrollTop = elementBottom - window.innerHeight + 45; // 170px buffer from bottom
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

  // Synchronized pagination functions for both sections
  const nextPage = () => {
    const totalPages = window.innerWidth >= 650 ? 2 : 3; // 6 items per page above 650px, 4 per page below
    const nextPageIndex = (currentFactPage + 1) % totalPages;
    setCurrentFactPage(nextPageIndex);
    setCurrentSolutionPage(nextPageIndex);
  };

  const prevPage = () => {
    const totalPages = window.innerWidth >= 650 ? 2 : 3; // 6 items per page above 650px, 4 per page below
    const prevPageIndex = (currentFactPage - 1 + totalPages) % totalPages;
    setCurrentFactPage(prevPageIndex);
    setCurrentSolutionPage(prevPageIndex);
  };

  // Keep individual functions for backwards compatibility (but they now sync both sections)
  const nextFactPage = nextPage;
  const prevFactPage = prevPage;
  const nextSolutionPage = nextPage;
  const prevSolutionPage = prevPage;

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

  // Video auto-play intersection observer
  useEffect(() => {
    const videoObserverOptions = {
      threshold: 0.01 // Trigger when 1% visible
    };

    const didYouKnowVideoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && didYouKnowVideoRef.current) {
            // Auto-play first video when 1% visible
            didYouKnowVideoRef.current.play().catch(e => console.log('Did You Know video autoplay failed:', e));
            
            // Simultaneously start the second video
            if (solutionsVideoRef.current) {
              solutionsVideoRef.current.play().catch(e => console.log('Solutions video autoplay failed:', e));
            }
          }
        });
      },
      videoObserverOptions
    );

    // Only observe the first video (Did You Know section)
    if (didYouKnowVideoRef.current) {
      didYouKnowVideoObserver.observe(didYouKnowVideoRef.current);
    }

    return () => {
      if (didYouKnowVideoRef.current) {
        didYouKnowVideoObserver.unobserve(didYouKnowVideoRef.current);
      }
    };
  }, [shouldLoadVideos]);

  // Animation variants for the action words - no y movement to prevent layout shifts
  const wordVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.9
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: {
        duration: 0.3,
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
      {/* Loading Overlay - Only show if waitlist is not visible */}
      {isLoading && !isWaitlistVisible && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <AppLoading />
          {totalImages > 0 && (
            <Typography
              variant="body2"
              sx={{
                mt: 2,
                color: 'text.secondary',
                textAlign: 'center'
              }}
            >
              Loading images... {imagesLoaded}/{totalImages}
            </Typography>
          )}
        </Box>
      )}
      {/* Home Hero Section - Full Viewport */}
      <Box className="home-hero-section" ref={aboutRef}>
        
        {/* Trucker Images - Positioned absolutely relative to hero section */}
        <motion.div 
          ref={truckerImagesRef}
          className="trucker-images-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: isTruckerImagesInView ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 1.2 }} // Delay after headline and social proof
        >
          <div className="trucker-images-overlay"></div>
          <motion.img 
            src={truckerOnPhoneImg} 
            alt="Trucker on phone" 
            className="trucker-image trucker-phone"
            style={{ 
              imageRendering: 'auto',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
            initial={{ 
              opacity: 0, 
              y: -100, 
              rotate: -180,
              scale: 0.8 
            }}
            animate={{ 
              opacity: isTruckerImagesInView ? 1 : 0, 
              y: isTruckerImagesInView ? 0 : -100, 
              rotate: isTruckerImagesInView ? 0 : -180,
              scale: isTruckerImagesInView ? 1 : 0.8 
            }}
            transition={{ 
              duration: 1.2, 
              ease: "easeOut",
              delay: 1.4 // First card
            }}
          />
          <motion.img 
            src={happyTrucker1Img} 
            alt="Happy trucker" 
            className="trucker-image trucker-happy"
            style={{ 
              imageRendering: 'auto',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
            initial={{ 
              opacity: 0, 
              y: -100, 
              rotate: 180,
              scale: 0.8 
            }}
            animate={{ 
              opacity: isTruckerImagesInView ? 1 : 0, 
              y: isTruckerImagesInView ? 0 : -100, 
              rotate: isTruckerImagesInView ? 0 : 180,
              scale: isTruckerImagesInView ? 1 : 0.8 
            }}
            transition={{ 
              duration: 1.2, 
              ease: "easeOut",
              delay: 1.6 // Second card
            }}
          />
          <motion.div
            style={{
              position: 'absolute',
              top: '50%',
              left: '-20px',
              width: '130px',
              height: '130px',
              zIndex: 1,
              transform: 'translateY(-50%)'
            }}
            initial={{ 
              opacity: 0, 
              y: -100, 
              rotate: 270,
              scale: 0.8 
            }}
            animate={{ 
              opacity: isTruckerImagesInView ? 1 : 0, 
              y: isTruckerImagesInView ? 0 : -100, 
              rotate: isTruckerImagesInView ? 0 : 270,
              scale: isTruckerImagesInView ? 1 : 0.8 
            }}
            transition={{ 
              duration: 2.0, 
              ease: "easeOut",
              delay: 1.8 // Third card
            }}
          >
            <img 
              src={truckerWithFamilyImg} 
              alt="Trucker with family" 
              className="trucker-image trucker-family"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease'
              }}
            />

          </motion.div>
        </motion.div>
        {/* Left Column - Text Content */}
        <Box className="home-hero-text">
          <Typography 
            variant="h1" 
            className={`home-hero-headline ${isAboutVisible ? 'animate' : ''}`}
          >
            Built to
            <br />
            <Box component="span" style={{ 
              display: 'block', 
              minHeight: '1.2em', 
              position: 'relative',
              width: '100%' // Full width to match parent
            }}>
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
            truckers!
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
          
          {/* Social Media Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isAboutVisible ? 1 : 0, y: isAboutVisible ? 0 : 20 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.9 }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'left', 
              marginTop: '1.5rem',
              gap: '1rem'
            }}
          >
            <motion.a 
              href="https://www.instagram.com/marcdtheapp/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                color: '#be0303',
                fontSize: '1.5rem',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center'
              }}
              animate={{
                y: [0, -8, 0],
                transition: {
                  y: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.5
                  }
                }
              }}
              whileHover={{ 
                scale: 1.1,
                transition: { duration: 0.2 }
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#8b0000';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#be0303';
              }}
            >
              <FaInstagram />
            </motion.a>
            <motion.a 
              href="https://www.facebook.com/profile.php?id=61579151007527" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                color: '#be0303',
                fontSize: '1.5rem',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center'
              }}
              animate={{
                y: [0, -8, 0],
                transition: {
                  y: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.7
                  }
                }
              }}
              whileHover={{ 
                scale: 1.1,
                transition: { duration: 0.2 }
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#8b0000';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#be0303';
              }}
            >
              <FaFacebook />
            </motion.a>
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
                  Thank you! You've been added to our waitlist.
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
            We have a place to Marc' It!
            <GpsFixedIcon style={{ color: '#2E0000', marginLeft: '0.8rem' }} />
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
          
          {/* Button Divider */}
          <div className="marc-it-button-divider"></div>
          
          {/* See Features Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 3 }}>
            <Button
              variant="outlined"
              size="small"
              className="marc-it-features-button"
              onClick={() => navigate('/features')}
            >
              See Features
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Did You Know Section */}
      <Box className={`did-you-know-section ${isDidYouKnowVisible ? 'visible' : ''}`} ref={didYouKnowRef}>
        <div className="video-overlay"></div>
        
        {/* Video background placeholder */}
        {!videosLoaded.didYouKnow && (
          <div className="video-placeholder-background" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
            zIndex: 0,
            borderRadius: '12px'
          }}></div>
        )}
        
        {shouldLoadVideos && (
          <video 
            ref={didYouKnowVideoRef}
            autoPlay 
            loop 
            muted 
            playsInline
            controls={false}
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            preload="metadata"
            className="background-video"
            loading="lazy"
            onLoadedData={() => setVideosLoaded(prev => ({ ...prev, didYouKnow: true }))}
            onError={() => console.log('Did You Know video failed to load')}
            onCanPlay={() => {
              // Force play when video can play
              if (didYouKnowVideoRef.current) {
                didYouKnowVideoRef.current.play().catch(e => console.log('Video autoplay failed:', e));
              }
            }}
            style={{
              opacity: videosLoaded.didYouKnow ? 1 : 0,
              transition: 'opacity 1s ease-in-out'
            }}
          >
            <source src={truckParkingVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        <Box className="did-you-know-content">
          <motion.div
            ref={didYouKnowTitleRef}
            initial={{ 
              opacity: 0, 
              x: -100, 
              scale: 0.8,
              rotate: -15
            }}
            animate={{ 
              opacity: isDidYouKnowTitleInView ? 1 : 0, 
              x: isDidYouKnowTitleInView ? 0 : -100, 
              scale: isDidYouKnowTitleInView ? 1 : 0.8,
              rotate: isDidYouKnowTitleInView ? 0 : -15
            }}
            transition={{ 
              duration: 1.2, 
              ease: "easeOut",
              type: "spring",
              stiffness: 60,
              damping: 15
            }}
          >
            <Typography variant="h3" className="did-you-know-title">
              {shouldLoadImages && <img src={truckIcon} alt="Truck" className="truck-icon" loading="lazy" />}
              Did You Know?
            </Typography>
          </motion.div>
          
          {/* Facts data */}
          {(() => {
            const allFacts = [
              {
                stat: "100%",
                text: "truckers rely on each other.",
                detail: "Helping spot into tight docks or sharing where to park is often all they have."
              },
              {
                stat: "98%",
                text: "truckers struggle to find safe parking.",
                detail: "Only 1 authorized spot exists for every 11 trucks, costing drivers up to $5,500 a year in wasted time and fuel."
              },
              {
                stat: "96%",
                text: "of fleets operate 10 or fewer trucks.",
                detail: "Small fleets dominate the industry."
              },
              {
                stat: "88%",
                text: "have at least one cardiometabolic risk.",
                detail: "Hypertension, smoking, and obesity are common—jeopardizing health and careers."
              },
              {
                stat: "70%",
                text: "of all freight in the U.S. is moved by truck.",
                detail: ""
              },
              {
                stat: "69%",
                text: "are obese—twice the U.S. average.",
                detail: "Long hours, little exercise, and unhealthy food access drive this crisis."
              },
              {
                stat: "53%",
                text: "of DOT violations are preventable.",
                detail: "Parking illegally or rushing to meet deadlines leads to costly CSA points, insurance hikes, and job risks."
              },
              {
                stat: "40%",
                text: "of truckers spend over an hour a day searching for parking.",
                detail: "According to the USDOT, 40% of truckers spend over an hour a day searching for parking – costing our national economy billions in wasted time. It's also a safety issue – forcing truckers to park in harm's way."
              },
              {
                stat: "$275M+",
                text: "USDOT is investing to expand truck parking access nationwide.",
                detail: ""
              },
              {
                stat: "1.7×",
                text: "higher risk of heart disease.",
                detail: "Nearly 50% have cardiovascular conditions, compared to just 30% of the general population."
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
            ];

            // Show all facts on larger screens, paginated on smaller screens
            const isLargeScreen = window.innerWidth > 1200;
            const factsPerPage = window.innerWidth >= 650 ? 6 : 4; // 6 facts per page above 650px, 4 per page below
            const currentFacts = isLargeScreen 
              ? allFacts 
              : allFacts.slice(
                  currentFactPage * factsPerPage, 
                  (currentFactPage + 1) * factsPerPage
                );

            return (
              <>
                {/* Navigation Controls - Only show on smaller screens */}
                {!isLargeScreen && (
                  <Box className="fact-navigation">
                  <Tooltip title="Previous facts" placement="left">
                    <IconButton
                      onClick={prevFactPage}
                      className="nav-arrow nav-arrow-left"
                      aria-label="Previous facts"
                    >
                      ‹
                    </IconButton>
                  </Tooltip>
                  
                  <Typography className="fact-counter">
                    {currentFactPage + 1} of {window.innerWidth >= 650 ? 2 : 3}
                  </Typography>
                  
                  <Tooltip title="Next facts" placement="right">
                    <IconButton
                      onClick={nextFactPage}
                      className="nav-arrow nav-arrow-right"
                      aria-label="Next facts"
                    >
                      ›
                    </IconButton>
                  </Tooltip>
                </Box>
                )}

                <Box className="facts-grid">
                  {currentFacts.map((fact, index) => (
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
                  {fact.stat === "image" && fact.statImage && shouldLoadImages && (
                    <img src={fact.statImage} alt="Healthy food" className="fact-stat-image" loading="lazy" />
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
              </>
            );
          })()}
        </Box>
      </Box>

      {/* Marc'd Solutions Section */}
      <Box className={`marcd-solutions-section ${isSolutionsVisible ? 'visible' : ''}`} ref={solutionsRef}>
        <div className="video-overlay"></div>
        
        {/* Video background placeholder */}
        {!videosLoaded.solutions && (
          <div className="video-placeholder-background" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
            zIndex: 0,
            borderRadius: '12px'
          }}></div>
        )}
        
        {shouldLoadVideos && (
          <video 
            ref={solutionsVideoRef}
            autoPlay 
            loop 
            muted 
            playsInline
            controls={false}
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            preload="metadata"
            className="background-video"
            loading="lazy"
            onLoadedData={() => setVideosLoaded(prev => ({ ...prev, solutions: true }))}
            onError={() => console.log('Solutions video failed to load')}
            onCanPlay={() => {
              // Force play when video can play
              if (solutionsVideoRef.current) {
                solutionsVideoRef.current.play().catch(e => console.log('Video autoplay failed:', e));
              }
            }}
            style={{
              opacity: videosLoaded.solutions ? 1 : 0,
              transition: 'opacity 1s ease-in-out'
            }}
          >
            <source src={truckParkingVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        <Box className="marcd-solutions-content">
          <motion.div
            ref={solutionsTitleRef}
            initial={{ 
              opacity: 0, 
              x: 100, 
              scale: 0.8,
              rotate: 15
            }}
            animate={{ 
              opacity: isSolutionsTitleInView ? 1 : 0, 
              x: isSolutionsTitleInView ? 0 : 100, 
              scale: isSolutionsTitleInView ? 1 : 0.8,
              rotate: isSolutionsTitleInView ? 0 : 15
            }}
            transition={{ 
              duration: 1.2, 
              ease: "easeOut",
              type: "spring",
              stiffness: 60,
              damping: 15
            }}
          >
            <Typography variant="h3" className="solutions-title">
              ✅ How Marc'd Solves These Problems
            </Typography>
          </motion.div>
          
          {/* Solutions data */}
          {(() => {
            const allSolutions = [
              {
                icon: <PeopleIcon className="solution-stat-icon" />,
                title: "Stronger Together",
                text: "Driver support when and where it counts.",
                detail: "Marc'd fosters a peer-to-peer support network where truckers share tips, updates, and alerts in real time."
              },
              {
                icon: <ParkingIcon className="solution-stat-icon" />,
                title: "Real-time Parking",
                text: "Shows available safe spots right now, so you stop wasting hours hunting.",
                detail: "Our community-driven parking system provides live updates from fellow drivers, helping you find open spots before you even arrive. No more circling truck stops or parking illegally—save time, fuel, and avoid violations."
              },
              {
                icon: <LocalShippingIcon className="solution-stat-icon" />,
                title: "Tech for 95%",
                text: "Built for small fleets and owner-operators.",
                detail: "Marc'd is tailored for small fleets and owner-operators who need low-cost, high-impact tools to stay competitive."
              },
              {
                icon: shouldLoadImages ? <img src={healthFoodImg} alt="Healthy food" className="solution-stat-image" loading="lazy" /> : <div className="solution-stat-image-placeholder" />,
                title: "Wellness Support",
                text: "Locates cleaner stops, healthier food, even halal options.",
                detail: "Find truck stops with healthy meals, clean facilities, and dietary-specific choices including halal and vegetarian options. Your health matters, and we help you maintain it on the road."
              },
              {
                icon: <TrendingUpIcon className="solution-stat-icon" />,
                title: "Maximize Your Miles",
                text: "Keeping freight moving efficiently.",
                detail: "By reducing downtime and boosting driver efficiency, Marc'd supports the backbone of the economy."
              },
              {
                icon: <FitnessCenterIcon className="solution-stat-icon" />,
                title: "Park & Pump",
                text: "Find gyms with truck parking and showers.",
                detail: "Locate gyms with truck parking, clean showers, and day-pass access so you can stay fit on the road."
              },
              {
                icon: <GavelIcon className="solution-stat-icon" />,
                title: "Compliance Alerts",
                text: "Avoid costly violations.",
                detail: "Marc'd offers speed zone alerts, weigh station updates, and inspection reminders to help avoid costly violations."
              },
              {
                icon: <KeyboardVoiceIcon className="solution-stat-icon" />,
                title: "Voice Parking Search",
                text: "Find and update parking hands-free.",
                detail: "Find and update parking availability without taking your hands off the wheel—saving time and improving safety."
              },
              {
                icon: <PeopleIcon className="solution-stat-icon" />,
                title: "Partnering with USDOT",
                text: "Helping drivers benefit from new infrastructure.",
                detail: "Marc'd is designed to complement infrastructure growth by helping drivers locate new USDOT-funded parking zones."
              },
              {
                icon: <RestaurantIcon className="solution-stat-icon" />,
                title: "Community Updates",
                text: "Truckers share stops and tips for healthier living.",
                detail: "Truckers share healthy meal stops, safe rest areas, and fitness-friendly locations through community updates."
              },
              {
                icon: <DevicesIcon className="solution-stat-icon" />,
                title: "Affordable Tech",
                text: "Solutions that level the playing field.",
                detail: "We empower independent drivers with big-fleet technology—without the high cost."
              },
              {
                icon: <SpeedIcon className="solution-stat-icon" />,
                title: "Speed Alerts & Compliance Tools",
                text: "Helps you avoid CSA violations and protect your safety record.",
                detail: "Real-time speed monitoring and DOT compliance alerts help you maintain a clean driving record. Avoid costly violations, insurance hikes, and protect your livelihood with proactive safety tools."
              }
            ];

            // Show all solutions on larger screens, paginated on smaller screens
            const isLargeScreen = window.innerWidth > 1200;
            const solutionsPerPage = window.innerWidth >= 650 ? 6 : 4; // 6 solutions per page above 650px, 4 per page below
            const currentSolutions = isLargeScreen 
              ? allSolutions 
              : allSolutions.slice(
                  currentSolutionPage * solutionsPerPage, 
                  (currentSolutionPage + 1) * solutionsPerPage
                );

            return (
              <>
                {/* Navigation Controls - Only show on smaller screens */}
                {!isLargeScreen && (
                  <Box className="solution-navigation">
                    <Tooltip title="Previous solutions" placement="left">
                      <IconButton
                        onClick={prevSolutionPage}
                        className="nav-arrow nav-arrow-left"
                        aria-label="Previous solutions"
                      >
                        ‹
                      </IconButton>
                    </Tooltip>
                    
                    <Typography className="solution-counter">
                      {currentSolutionPage + 1} of {window.innerWidth >= 650 ? 2 : 3}
                    </Typography>
                    
                    <Tooltip title="Next solutions" placement="right">
                      <IconButton
                        onClick={nextSolutionPage}
                        className="nav-arrow nav-arrow-right"
                        aria-label="Next solutions"
                      >
                        ›
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}

                <Box className="solutions-grid">
                  {currentSolutions.map((solution, index) => (
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
              </>
            );
          })()}
        </Box>
      </Box>

      {/* Footer Social Media Icons */}
      <Box 
        ref={footerSocialRef}
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: '3rem 0 2rem 0',
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
          marginTop: '2rem'
        }}
      >
        <Box sx={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ 
              opacity: isFooterSocialInView && shouldLoadImages ? 1 : 0, 
              y: isFooterSocialInView && shouldLoadImages ? 0 : 50,
              scale: isFooterSocialInView && shouldLoadImages ? 1 : 0.8
            }}
            transition={{ 
              duration: 0.6, 
              ease: "easeOut",
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#cccccc',
                marginRight: '1rem',
                fontWeight: 500
              }}
            >
              Follow us:
            </Typography>
          </motion.div>
          
          <motion.a 
            href="https://www.instagram.com/marcdtheapp/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: '#be0303',
              fontSize: '1.8rem',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center'
            }}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={isFooterSocialInView ? {
              opacity: 1,
              y: [0, -10, 0],
              scale: 1,
              transition: {
                opacity: { duration: 0.6, ease: "easeOut", type: "spring", stiffness: 100, damping: 15, delay: 0.1 },
                scale: { duration: 0.6, ease: "easeOut", type: "spring", stiffness: 100, damping: 15, delay: 0.1 },
                y: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.6
                }
              }
            } : {
              opacity: 0,
              y: 50,
              scale: 0.8
            }}
            whileHover={{ 
              scale: 1.15,
              transition: { duration: 0.2 }
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#8b0000';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#be0303';
            }}
          >
            <FaInstagram />
          </motion.a>
          
          <motion.a 
            href="https://www.facebook.com/profile.php?id=61579151007527" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: '#be0303',
              fontSize: '1.8rem',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center'
            }}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={isFooterSocialInView ? {
              opacity: 1,
              y: [0, -10, 0],
              scale: 1,
              transition: {
                opacity: { duration: 0.6, ease: "easeOut", type: "spring", stiffness: 100, damping: 15, delay: 0.2 },
                scale: { duration: 0.6, ease: "easeOut", type: "spring", stiffness: 100, damping: 15, delay: 0.2 },
                y: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.7
                }
              }
            } : {
              opacity: 0,
              y: 50,
              scale: 0.8
            }}
            whileHover={{ 
              scale: 1.15,
              transition: { duration: 0.2 }
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#8b0000';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#be0303';
            }}
          >
            <FaFacebook />
          </motion.a>
        </Box>
      </Box>

    </Box>
  );
}

export default home;