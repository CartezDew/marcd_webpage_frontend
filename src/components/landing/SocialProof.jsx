import React from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft } from 'react-icons/fa';
import '../../styles/landing/social-proof.css';
import trucker1 from '../../assets/Happy_Truckers_1.jpg';
import trucker2 from '../../assets/Happy Truck Drivers.jpg';

const SocialProof = () => {
    return (
        <section className="social-proof-section">
            <div className="landing-container">
                <div className="section-title">
                    <span className="section-subtitle">Social Proof</span>
                    <h2>What Drivers Are Saying</h2>
                </div>

                <div className="testimonials-grid">
                    <motion.div
                        className="testimonial-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <FaQuoteLeft className="quote-icon" />
                        <p className="testimonial-text">
                            "Finally an app built by someone who actually knows what truckers need. The safety ratings alone make this a must-have."
                        </p>
                        <div className="testimonial-author">
                            <img src={trucker1} alt="Trucker" className="author-avatar" />
                            <div className="author-info">
                                <h4>James R.</h4>
                                <span>Owner Operator</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="testimonial-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <FaQuoteLeft className="quote-icon" />
                        <p className="testimonial-text">
                            "I would absolutely use Marc’d on every trip. It takes the stress out of finding safe parking at night."
                        </p>
                        <div className="testimonial-author">
                            <img src={trucker2} alt="Trucker" className="author-avatar" />
                            <div className="author-info">
                                <h4>Sarah M.</h4>
                                <span>Long Haul Driver</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="social-stats">
                    <div className="stat-item">
                        <h3>200+</h3>
                        <p>Drivers on Waitlist</p>
                    </div>
                    <div className="stat-item">
                        <h3>50+</h3>
                        <p>Parking Partners</p>
                    </div>
                    <div className="stat-item">
                        <h3>4.9/5</h3>
                        <p>Driver Satisfaction</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SocialProof;
