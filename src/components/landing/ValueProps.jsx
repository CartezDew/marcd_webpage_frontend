import React from 'react';
import { motion } from 'framer-motion';
import { FaTruck, FaWarehouse, FaTools } from 'react-icons/fa';
import '../../styles/landing/value-props.css';

const ValueProps = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <section className="value-props-section">
            <div className="landing-container">
                <div className="value-props-header">
                    <span className="section-subtitle">Why Choose Marc'd</span>
                    <h2>One Platform. Three Communities. Shared Impact.</h2>
                </div>

                <motion.div
                    className="value-props-grid"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {/* For Truckers */}
                    <motion.div className="value-prop-card" variants={itemVariants}>
                        <div className="value-prop-icon">
                            <FaTruck />
                        </div>
                        <h3>For Truckers</h3>
                        <p>
                            Find safe, reliable parking in real-time, get route alerts, rate locations, and earn rewards for contributing to the community.
                        </p>
                    </motion.div>

                    {/* For Facilitators */}
                    <motion.div className="value-prop-card" variants={itemVariants}>
                        <div className="value-prop-icon">
                            <FaWarehouse />
                        </div>
                        <h3>For Facilitators</h3>
                        <p>
                            Monetize unused parking space legally and safely—churches, schools, truck parking lots, farms, distribution centers, small businesses, etc.
                        </p>
                    </motion.div>

                    {/* For Tow/Recovery Providers */}
                    <motion.div className="value-prop-card" variants={itemVariants}>
                        <div className="value-prop-icon">
                            <FaTools />
                        </div>
                        <h3>For Tow & Recovery</h3>
                        <p>
                            Reach drivers faster, gain visibility, and offer emergency services directly through the Marc’d platform.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default ValueProps;
