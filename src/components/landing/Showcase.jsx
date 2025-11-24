import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/landing/showcase.css';

// Import images
import parkingImg from '../../assets/App_Parking.png';
import statsImg from '../../assets/App_Statistics.png';
import placesImg from '../../assets/App_Marc\'d_Places.png';
import navImg from '../../assets/App_Navigation.png';
import alertsImg from '../../assets/App_Alerts_Image.png';

const Showcase = () => {
    const screenshots = [
        { id: 1, src: parkingImg, title: 'Parking Map View' },
        { id: 2, src: statsImg, title: 'Location Safety Ratings' },
        { id: 3, src: placesImg, title: 'Food/Amenities Listing' },
        { id: 4, src: alertsImg, title: 'Weather Route Alerts' },
        { id: 5, src: navImg, title: 'Tow Provider Directory' },
    ];

    return (
        <section className="showcase-section">
            <div className="landing-container">
                <div className="showcase-header">
                    <h2>See Marc’d in Action</h2>
                    <p>Built for speed. Designed for safety. Powered by community.</p>
                </div>

                <div className="showcase-grid">
                    {screenshots.map((shot, index) => (
                        <motion.div
                            key={shot.id}
                            className="showcase-item"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <img src={shot.src} alt={shot.title} className="showcase-image" />
                            <div className="showcase-caption">
                                <h4>{shot.title}</h4>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Showcase;
