import React from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaArrowRight } from 'react-icons/fa';
import '../../styles/landing/story.css';
import storyImage from '../../assets/Trucker_on_phone.jpg'; // Using another asset

const Story = () => {
    return (
        <section className="story-section">
            <div className="story-content">
                <motion.div
                    className="story-text"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="section-subtitle">The Problem</span>
                    <h2>Truckers spend <span className="highlight-text">56 minutes a day</span> searching for safe parking.</h2>

                    <div className="story-stat">
                        That adds up to lost miles, lost revenue, and increased safety risks.
                    </div>

                    <p>Marc’d solves the problem with:</p>

                    <ul className="solution-list">
                        <li><FaCheck className="solution-icon" /> Verified parking availability</li>
                        <li><FaCheck className="solution-icon" /> Real-time updates from drivers</li>
                        <li><FaCheck className="solution-icon" /> Community-powered safety alerts</li>
                        <li><FaCheck className="solution-icon" /> Partners who offer safe legal lots</li>
                        <li><FaCheck className="solution-icon" /> Tow companies on standby for emergencies</li>
                    </ul>

                    <div className="story-cta">
                        <FaArrowRight className="text-primary" /> The road is unpredictable. Your resources shouldn’t be.
                    </div>
                </motion.div>

                <motion.div
                    className="story-image-wrapper"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <img src={storyImage} alt="Trucker on phone looking for parking" className="story-image" />
                </motion.div>
            </div>
        </section>
    );
};

export default Story;
