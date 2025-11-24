import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import '../../styles/landing/founder.css';
import founderImg from '../../assets/Sister and Dad.jpg'; // Using family image for founder story

const Founder = () => {
    return (
        <section className="founder-section">
            <div className="founder-content">
                <motion.div
                    className="founder-text"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="section-subtitle">Founder Story</span>
                    <h2>A Legacy of Trucking. A Mission for Change.</h2>
                    <p>
                        Marc'd is inspired by the 30+ years my father spent navigating America’s highways.
                        We built this app because truckers deserve better—better parking, better resources, better support.
                    </p>

                    <div className="mission-statement">
                        “Our mission is to make trucking safer, healthier, and more supported through community-powered technology.”
                    </div>

                    <button className="btn-secondary">
                        Read Our Story <FaArrowRight style={{ marginLeft: '8px' }} />
                    </button>
                </motion.div>

                <motion.div
                    className="founder-image-wrapper"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <img src={founderImg} alt="Founder with Father" className="founder-image" />
                </motion.div>
            </div>
        </section>
    );
};

export default Founder;
