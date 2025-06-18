import { useState } from 'react';
import { FaStar, FaParking } from 'react-icons/fa';

function FeedbackForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    cleanliness_rating: 5,
    food_rating: 5,
    safety_rating: 5,
    parking_availability: 'available',
    comment: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (ratingType, value) => {
    setFormData(prev => ({
      ...prev,
      [ratingType]: parseInt(value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderRatingStars = (ratingType, currentRating) => {
    return (
      <div className="rating-stars-input">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            className={`star-button ${star <= currentRating ? 'active' : ''}`}
            onClick={() => handleRatingChange(ratingType, star)}
          >
            <FaStar />
          </button>
        ))}
        <span className="rating-number">({currentRating})</span>
      </div>
    );
  };

  return (
    <div className="feedback-form">
      <form onSubmit={handleSubmit}>
        <div className="form-section mb-2">
          <h4>Rate Your Experience</h4>
          
          <div className="rating-group mb-1">
            <label>Cleanliness:</label>
            {renderRatingStars('cleanliness_rating', formData.cleanliness_rating)}
          </div>

          <div className="rating-group mb-1">
            <label>Food Quality:</label>
            {renderRatingStars('food_rating', formData.food_rating)}
          </div>

          <div className="rating-group mb-1">
            <label>Safety:</label>
            {renderRatingStars('safety_rating', formData.safety_rating)}
          </div>
        </div>

        <div className="form-section mb-2">
          <h4>Parking Availability</h4>
          <div className="form-group">
            <label htmlFor="parking_availability">
              <FaParking style={{ marginRight: '0.5rem' }} />
              Current Parking Status
            </label>
            <select
              id="parking_availability"
              name="parking_availability"
              value={formData.parking_availability}
              onChange={handleChange}
              required
            >
              <option value="available">Available</option>
              <option value="limited">Limited</option>
              <option value="full">Full</option>
            </select>
          </div>
        </div>

        <div className="form-section mb-2">
          <h4>Additional Comments</h4>
          <div className="form-group">
            <label htmlFor="comment">Share your experience (optional)</label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              rows="4"
              placeholder="Tell us about your experience at this truck stop..."
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Submit Review
          </button>
          {onCancel && (
            <button 
              type="button" 
              onClick={onCancel}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default FeedbackForm; 