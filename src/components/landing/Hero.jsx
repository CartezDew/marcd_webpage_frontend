import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaArrowRight, FaParking, FaShieldAlt } from 'react-icons/fa';
import '../../styles/landing/hero.css';
import truckerImage from '../../assets/Trucker_with_family.jpg'; // Using one of the available assets

const Hero = () => {
    const scrollToWaitlist = () => {
        if (window.scrollToWaitlist) {
            window.scrollToWaitlist();
        }
    };

    const scrollToFeatures = () => {
        const featuresSection = document.getElementById('features');
        if (featuresSection) {
            featuresSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="hero-section">
            <div className="hero-bg-overlay"></div>

            <div className="hero-content-wrapper">
                <motion.div
                    className="hero-text-content"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="hero-badge">
                        <span className="badge-dot"></span>
                        Truckers First. Partners Welcome.
                    </div>

                    <h1 className="hero-title">
                        Empowering safer,
                        <span>smarter parking</span>
                        for the road ahead.
                    </h1>

                    <p className="hero-subtitle">
                        Whether you're a trucker looking for real-time parking, a facility with unused space, or a tow/recovery provider serving drivers—Marc’d connects the entire ecosystem.
                    </p>

                    <div className="hero-cta-group">
                        <button onClick={scrollToWaitlist} className="btn-primary">
                            Join the Waitlist
                        </button>
                        <button onClick={scrollToFeatures} className="btn-secondary">
                            See Features
                        </button>
                    </div>

                    <div className="hero-features-list">
                        <div className="hero-feature-item">
                            <FaCheckCircle className="check-icon" />
                            <span>For Truckers</span>
                        </div>
                        <div className="hero-feature-item">
                            <FaCheckCircle className="check-icon" />
                            <span>For Parking Hosts (Facilitators)</span>
                        </div>
                        <div className="hero-feature-item">
                            <FaCheckCircle className="check-icon" />
                            <span>For Tow & Recovery Providers</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="hero-image-container"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="hero-image-backdrop"></div>
                    <img src={truckerImage} alt="Trucker with family" className="hero-main-image" />

                    <motion.div
                        className="hero-floating-card card-top-left"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <div className="floating-icon">
                            <FaParking />
                        </div>
                        <div className="floating-text">
                            <h4>Real-time Parking</h4>
                            <p>Verified Availability</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="hero-floating-card card-bottom-right"
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    >
                        <div className="floating-icon">
                            <FaShieldAlt />
                        </div>
                        <div className="floating-text">
                            <h4>Community Safety</h4>
                            <p>Driver Verified Ratings</p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
