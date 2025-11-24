import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/landing/join.css';

const JoinMovement = () => {
    const scrollToWaitlist = () => {
        if (window.scrollToWaitlist) {
            window.scrollToWaitlist();
        }
    };

    return (
        <section className="join-section">
            <div className="join-bg-decoration"></div>
            <div className="join-content">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="section-subtitle" style={{ color: 'white' }}>Join the Movement</span>
                    <h2>Be Part of the Future of Safe Parking</h2>
                    <p>
                        Truckers: Join the waitlist. Facilitators: Register as a parking host. Tow Providers: Get listed.
                    </p>

                    <div className="join-cta-group">
                        <button onClick={scrollToWaitlist} className="btn-primary" style={{ backgroundColor: 'white', color: '#be0303' }}>
                            Join the Waitlist
                        </button>
                        <button className="btn-outline" style={{ borderColor: 'white', color: 'white' }}>
                            Partner With Us
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default JoinMovement;
