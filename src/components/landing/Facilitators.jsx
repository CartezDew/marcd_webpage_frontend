import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import '../../styles/landing/facilitators.css';
import parkingLotImg from '../../assets/App_Parking.png'; // Using parking image as placeholder

const Facilitators = () => {
    return (
        <section className="facilitators-section">
            <div className="facilitators-content">
                <motion.div
                    className="facilitators-text"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="section-subtitle">For Facilitators</span>
                    <h2>Turn Underused Space Into Reliable Revenue</h2>
                    <p>
                        Parking lots sit empty across the country at night. Marc’d connects you with vetted commercial drivers who need legal, safe places to park.
                    </p>

                    <h3>Why Host on Marc’d?</h3>
                    <ul className="facilitators-list">
                        <li>Earn passive revenue</li>
                        <li>Improve community safety</li>
                        <li>Control hours, pricing, and capacity</li>
                        <li>Full CRM to manage bookings and driver interactions</li>
                        <li>Insurance guidance & best-practice resources</li>
                    </ul>

                    <button className="btn-primary">
                        Become a Parking Partner <FaArrowRight style={{ marginLeft: '8px' }} />
                    </button>
                </motion.div>

                <motion.div
                    className="facilitators-image-container"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <img src={parkingLotImg} alt="Parking Lot Management" className="facilitators-image" />
                </motion.div>
            </div>
        </section>
    );
};

export default Facilitators;
