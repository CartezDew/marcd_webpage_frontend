import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWaitlist } from '../context/WaitlistContext';
import '../styles/landing/landing.css';

// Import Landing Page Components
import Hero from '../components/landing/Hero';
import ValueProps from '../components/landing/ValueProps';
import Story from '../components/landing/Story';
import Showcase from '../components/landing/Showcase';
import Features from '../components/landing/Features';
import Facilitators from '../components/landing/Facilitators';
import Providers from '../components/landing/Providers';
import Founder from '../components/landing/Founder';
import SocialProof from '../components/landing/SocialProof';
import JoinMovement from '../components/landing/JoinMovement';
import Footer from '../components/landing/Footer';
import NearbyFacilities from '../components/landing/NearbyFacilities';

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showWaitlist, hideWaitlist, triggerWaitlist } = useWaitlist();

  // Handle waitlist from URL parameters and context
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const showWaitlistParam = urlParams.get('waitlist');

    if (showWaitlistParam === 'true') {
      // Clear the URL parameter
      navigate(location.pathname, { replace: true });
      // Trigger waitlist modal (assuming context handles it)
      triggerWaitlist();
    }
  }, [location.search, navigate, triggerWaitlist]);

  // Expose scrollToWaitlist globally for components to use
  useEffect(() => {
    window.scrollToWaitlist = triggerWaitlist;
    return () => {
      delete window.scrollToWaitlist;
    };
  }, [triggerWaitlist]);

  return (
    <div className="landing-page-wrapper">
      <Hero />
      <ValueProps />
      <Story />
      <Showcase />
      <NearbyFacilities />
      <Features />
      <Facilitators />
      <Providers />
      <Founder />
      <SocialProof />
      <JoinMovement />
      <Footer />
    </div>
  );
}

export default Home;