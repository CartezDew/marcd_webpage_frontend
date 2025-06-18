import { useState } from 'react';
import { FaClipboardList, FaCheckCircle, FaStar } from 'react-icons/fa';

function Survey() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    experience_level: '',
    primary_use: '',
    features_used: [],
    satisfaction_rating: '',
    improvement_suggestions: '',
    willing_to_test: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'features_used') {
        const updatedFeatures = checked
          ? [...formData.features_used, value]
          : formData.features_used.filter(feature => feature !== value);
        setFormData(prev => ({
          ...prev,
          features_used: updatedFeatures
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // For now, we'll just simulate a submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('There was an error submitting your survey. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="survey-page">
        <div className="text-center">
          <div className="card">
            <FaCheckCircle style={{ fontSize: '3rem', color: '#27ae60', marginBottom: '1rem' }} />
            <h2>Survey Submitted!</h2>
            <p>Thank you for taking the time to complete our survey. Your feedback helps us improve Marc'd Trucking!</p>
            <button 
              onClick={() => setSubmitted(false)}
              className="btn btn-primary mt-2"
            >
              Take Another Survey
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="survey-page">
      <div className="page-header text-center mb-3">
        <h1>User Survey</h1>
        <p>Help us understand how to better serve the trucking community</p>
      </div>

      <div className="survey-form-container">
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name (Optional)</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email (Optional)</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="experience_level">Experience Level *</label>
              <select
                id="experience_level"
                name="experience_level"
                value={formData.experience_level}
                onChange={handleChange}
                required
              >
                <option value="">Select your experience level</option>
                <option value="new">New to trucking apps</option>
                <option value="experienced">Experienced with trucking apps</option>
                <option value="professional">Professional truck driver</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="satisfaction_rating">Overall Satisfaction *</label>
              <div className="rating-buttons">
                {[1, 2, 3, 4, 5].map(rating => (
                  <label key={rating} className="rating-button">
                    <input
                      type="radio"
                      name="satisfaction_rating"
                      value={rating.toString()}
                      checked={formData.satisfaction_rating === rating.toString()}
                      onChange={handleChange}
                      required
                    />
                    <span className="rating-star">
                      <FaStar />
                    </span>
                    <span className="rating-number">{rating}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="improvement_suggestions">
                What would you like to see improved or added to Marc'd Trucking?
              </label>
              <textarea
                id="improvement_suggestions"
                name="improvement_suggestions"
                value={formData.improvement_suggestions}
                onChange={handleChange}
                rows="4"
                placeholder="Share your ideas for improvements..."
              />
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Survey'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Survey; 