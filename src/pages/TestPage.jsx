import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTruck, FaWarehouse, FaTools, FaMapMarkedAlt, FaShieldAlt, FaStar } from 'react-icons/fa';
import '../styles/test-page.css';

// Assets
import heroBgTrucker from '../assets/Trucker_with_family.jpg';
import heroBgHost from '../assets/App_Parking.png';
import heroBgTow from '../assets/Truck_Icon.png';

const TestPage = () => {
    const [activePersona, setActivePersona] = useState('trucker');

    const personas = {
        trucker: {
            title: "Own The Road",
            subtitle: "Stop searching. Start parking. The only app built to keep you moving safely.",
            bg: heroBgTrucker,
            accent: "Find Parking"
        },
        host: {
            title: "Monetize Your Lot",
            subtitle: "Turn empty asphalt into revenue. Secure, verified, and automated.",
            bg: heroBgHost,
            accent: "List Your Space"
        },
        tow: {
            title: "Expand Your Reach",
            subtitle: "Connect directly with drivers in need. No middlemen, just business.",
            bg: heroBgTow,
            accent: "Join Network"
        }
    };

    return (
        <div className="test-page-wrapper">

            {/* --- HERO SECTION --- */}
            <section className="tp-hero">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activePersona}
                        className="tp-hero-bg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <img src={personas[activePersona].bg} alt="Background" />
                    </motion.div>
                </AnimatePresence>

                <div className="tp-hero-content">
                    <div className="tp-persona-switcher">
                        <button
                            className={`tp-persona-btn ${activePersona === 'trucker' ? 'active' : ''}`}
                            onClick={() => setActivePersona('trucker')}
                        >
                            Trucker
                        </button>
                        <button
                            className={`tp-persona-btn ${activePersona === 'host' ? 'active' : ''}`}
                            onClick={() => setActivePersona('host')}
                        >
                            Parking Host
                        </button>
                        <button
                            className={`tp-persona-btn ${activePersona === 'tow' ? 'active' : ''}`}
                            onClick={() => setActivePersona('tow')}
                        >
                            Tow Provider
                        </button>
                    </div>

                    <motion.h1
                        key={personas[activePersona].title}
                        className="tp-hero-title"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
                    >
                        {personas[activePersona].title}
                    </motion.h1>

                    <motion.p
                        key={personas[activePersona].subtitle}
                        className="tp-hero-subtitle"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {personas[activePersona].subtitle}
                    </motion.p>

                    <motion.button
                        className="tp-cta-btn"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ fontSize: '1.2rem', padding: '1rem 3rem', marginTop: '1rem' }}
                    >
                        {personas[activePersona].accent}
                    </motion.button>
                </div>
            </section>

            {/* --- ECOSYSTEM SECTION --- */}
            <section className="tp-ecosystem">
                <div className="tp-container">
                    <div className="tp-section-header">
                        <span className="tp-text-mono tp-text-red">THE NETWORK</span>
                        <h2 className="tp-section-title">Connected Ecosystem</h2>
                    </div>

                    <div className="tp-map-container">
                        {/* Abstract Map Visualization */}
                        <motion.div
                            className="tp-map-node"
                            style={{ top: '30%', left: '20%' }}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <motion.div
                            className="tp-map-node"
                            style={{ top: '60%', left: '70%' }}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                        />
                        <motion.div
                            className="tp-map-node"
                            style={{ top: '40%', left: '50%' }}
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                        />

                        <div className="tp-map-line" style={{ top: '30%', left: '20%', transform: 'rotate(15deg)', width: '300px' }}></div>
                        <div className="tp-map-line" style={{ top: '40%', left: '50%', transform: 'rotate(25deg)', width: '250px' }}></div>

                        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
                            <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Real-Time Data</h3>
                            <p style={{ color: '#888' }}>Live updates from thousands of drivers and facilities.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- DASHBOARD PREVIEW --- */}
            <section className="tp-dashboard-preview">
                <div className="tp-container">
                    <div className="tp-section-header" style={{ textAlign: 'right', borderLeft: 'none', borderRight: '4px solid #ff1f1f', paddingRight: '2rem' }}>
                        <span className="tp-text-mono tp-text-red">INTERFACE</span>
                        <h2 className="tp-section-title">Command Center</h2>
                    </div>

                    <motion.div
                        className="tp-dashboard-card"
                        initial={{ rotateX: 20, opacity: 0 }}
                        whileInView={{ rotateX: 20, opacity: 1 }}
                        whileHover={{ rotateX: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="tp-dashboard-header">
                            <div className="tp-flex">
                                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }}></div>
                                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }}></div>
                                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }}></div>
                            </div>
                            <span className="tp-text-mono">MARCD_OS_V2.0</span>
                        </div>
                        <div className="tp-dashboard-body">
                            <div className="tp-dashboard-overlay">
                                <div style={{ textAlign: 'center' }}>
                                    <FaMapMarkedAlt style={{ fontSize: '4rem', color: 'var(--tp-accent-red)', marginBottom: '1rem' }} />
                                    <h3>Live Parking Availability</h3>
                                    <p className="tp-text-mono">STATUS: ACTIVE</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- COMMUNITY GRID --- */}
            <section className="tp-community">
                <div className="tp-container">
                    <div className="tp-section-header">
                        <span className="tp-text-mono tp-text-red">VOICES</span>
                        <h2 className="tp-section-title">The Community</h2>
                    </div>

                    <div className="tp-community-grid">
                        <div className="tp-community-card">
                            <FaStar className="tp-text-red" />
                            <FaStar className="tp-text-red" />
                            <FaStar className="tp-text-red" />
                            <FaStar className="tp-text-red" />
                            <FaStar className="tp-text-red" />
                            <p style={{ margin: '1rem 0', fontStyle: 'italic' }}>"Finally, an app that treats us like professionals. The safety ratings are a game changer."</p>
                            <div className="tp-flex" style={{ alignItems: 'center' }}>
                                <div style={{ width: 40, height: 40, background: '#333', borderRadius: '50%' }}></div>
                                <div>
                                    <h4 style={{ margin: 0 }}>Mike D.</h4>
                                    <span className="tp-text-mono" style={{ fontSize: '0.7rem' }}>OWNER OPERATOR</span>
                                </div>
                            </div>
                        </div>

                        <div className="tp-community-card" style={{ marginTop: '3rem' }}>
                            <FaShieldAlt className="tp-text-red" style={{ fontSize: '2rem', marginBottom: '1rem' }} />
                            <h3 style={{ marginBottom: '0.5rem' }}>Verified Safe</h3>
                            <p>Every location is vetted by our community of drivers. No more guessing games at 2 AM.</p>
                        </div>

                        <div className="tp-community-card">
                            <h3 style={{ fontSize: '3rem', margin: 0, color: 'var(--tp-accent-red)' }}>56m</h3>
                            <p className="tp-text-mono">AVERAGE TIME SAVED PER DAY</p>
                            <p style={{ marginTop: '1rem' }}>Get back on the road faster with real-time availability.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <section className="tp-cta-section">
                <div className="tp-container">
                    <h2 className="tp-hero-title" style={{ fontSize: '4rem' }}>Ready to Roll?</h2>
                    <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                        Join the network that's redefining the trucking industry.
                    </p>
                    <button className="tp-cta-btn">Join Waitlist</button>
                </div>
            </section>

        </div>
    );
};

export default TestPage;
