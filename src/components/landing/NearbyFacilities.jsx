import React from 'react';
import { FaStar } from 'react-icons/fa';
import '../../styles/landing/nearby.css';
import place1 from '../../assets/Scroll Images/Image- 1.png';
import place2 from '../../assets/Scroll Images/Image-2.png';
import place3 from '../../assets/Scroll Images/Image-3.png';
import place4 from '../../assets/Scroll Images/Image-4.png';

const NearbyFacilities = () => {
    const facilities = [
        {
            id: 1,
            name: "Pilot Travel Center #452",
            image: place1,
            rating: 4.8,
            distance: "2.3 miles away",
            price: "$15",
            type: "Truck Stop"
        },
        {
            id: 2,
            name: "Love's Travel Stop",
            image: place2,
            rating: 4.6,
            distance: "5.1 miles away",
            price: "$12",
            type: "Rest Area"
        },
        {
            id: 3,
            name: "Secure Park Atlanta",
            image: place3,
            rating: 4.9,
            distance: "12 miles away",
            price: "$20",
            type: "Secure Lot"
        },
        {
            id: 4,
            name: "TA Express",
            image: place4,
            rating: 4.5,
            distance: "18 miles away",
            price: "$15",
            type: "Truck Stop"
        }
    ];

    return (
        <section className="nearby-section">
            <div className="landing-container">
                <div className="section-title">
                    <span className="section-subtitle">Nearby Availability</span>
                    <h2>Find Safe Parking Near You</h2>
                </div>

                <div className="nearby-grid">
                    {facilities.map((place) => (
                        <div key={place.id} className="facility-card">
                            <img src={place.image} alt={place.name} className="facility-image" />
                            <div className="facility-info">
                                <div className="facility-header">
                                    <h4>{place.name}</h4>
                                    <div className="rating">
                                        <FaStar className="star-icon" />
                                        <span>{place.rating}</span>
                                    </div>
                                </div>
                                <div className="facility-details">
                                    <p style={{ margin: '0 0 4px 0' }}>{place.type}</p>
                                    <p style={{ margin: 0 }}>{place.distance}</p>
                                    <div className="facility-price">
                                        {place.price} <span>/ night</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NearbyFacilities;
