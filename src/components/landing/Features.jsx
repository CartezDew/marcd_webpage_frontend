import React from 'react';
import { motion } from 'framer-motion';
import { FaParking, FaStar, FaCloudSun, FaHandshake, FaTruckPickup, FaGift } from 'react-icons/fa';
import '../../styles/landing/features.css';

const Features = () => {
    const features = [
        {
            icon: <FaParking />,
            title: "Real-Time Parking Availability",
            desc: "Know what’s open before you arrive. No guesswork."
        },
        {
            icon: <FaStar />,
            title: "Community Safety Scores",
            desc: "Rate cleanliness, lighting, food options, restrooms, and safety."
        },
        {
            icon: <FaCloudSun />,
            title: "Weather & Hazard Alerts",
            desc: "Stay ahead of storms, closures, and unexpected risks."
        },
        {
            icon: <FaHandshake />,
            title: "Authorized Parking Partnerships",
            desc: "Verified locations from businesses, churches, schools & more."
        },
        {
            icon: <FaTruckPickup />,
            title: "Tow + Emergency Services",
            desc: "Quick access to local, trusted tow providers."
        },
        {
            icon: <FaGift />,
            title: "Rewards System",
            desc: "Earn points for contributions, updates, and participation."
        }
    ];

    return (
        <section id="features" className="features-section">
            <div className="landing-container">
                <div className="section-title">
                    <span className="section-subtitle">Core Features</span>
                    <h2>Everything Truckers Need—All in One App</h2>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="feature-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                            <div className="feature-icon-wrapper">
                                {feature.icon}
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
