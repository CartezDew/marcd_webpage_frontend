import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaListAlt, FaBell, FaClock, FaWrench } from 'react-icons/fa';
import '../../styles/landing/providers.css';
import towImg from '../../assets/Truck_Icon.png'; // Using truck icon as placeholder

const Providers = () => {
    return (
        <section className="providers-section">
            <div className="providers-content">
                <motion.div
                    className="providers-image-wrapper"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    {/* Placeholder for tow truck image */}
                    <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        height: '400px',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <img src={towImg} alt="Tow Truck" style={{ width: '100px', opacity: 0.5 }} />
                    </div>
                </motion.div>

                <motion.div
                    className="providers-text"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="section-subtitle">For Tow & Recovery Providers</span>
                    <h2>Be There When Drivers Need You Most</h2>
                    <p>
                        Increase your visibility and reach the drivers already on your routes.
                    </p>

                    <div className="providers-benefits">
                        <div className="benefit-item">
                            <FaListAlt className="benefit-icon" />
                            <span>Get listed in provider network</span>
                        </div>
                        <div className="benefit-item">
                            <FaBell className="benefit-icon" />
                            <span>Receive in-app requests</span>
                        </div>
                        <div className="benefit-item">
                            <FaClock className="benefit-icon" />
                            <span>Highlight 24/7 services</span>
                        </div>
                        <div className="benefit-item">
                            <FaWrench className="benefit-icon" />
                            <span>Promote specialized recovery</span>
                        </div>
                    </div>

                    <button className="btn-primary">
                        Join the Provider Network <FaArrowRight style={{ marginLeft: '8px' }} />
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default Providers;
