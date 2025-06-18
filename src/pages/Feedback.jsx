import { useState } from 'react';
import { FaComments, FaBug, FaLightbulb, FaEnvelope } from 'react-icons/fa';
import { feedbackAPI } from '../services/feedback';

function Feedback() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedback_type: 'general',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await feedbackAPI.create(formData);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        feedback_type: 'general',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('There was an error submitting your feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const feedbackTypes = [
    { value: 'bug', label: 'Bug Report', icon: <FaBug /> },
    { value: 'feature', label: 'Feature Request', icon: <FaLightbulb /> },
    { value: 'general', label: 'General Feedback', icon: <FaComments /> }
  ];

  if (submitted) {
    return (
      <div className="feedback-page">
        <div className="text-center">
          <div className="card">
            <FaEnvelope style={{ fontSize: '3rem', color: '#27ae60', marginBottom: '1rem' }} />
            <h2>Thank You!</h2>
            <p>Your feedback has been submitted successfully. We appreciate your input!</p>
            <button 
              onClick={() => setSubmitted(false)}
              className="btn btn-primary mt-2"
            >
              Submit Another Feedback
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-page">
      <div className="page-header text-center mb-3">
        <h1>Send Feedback</h1>
        <p>Help us improve Marc'd Trucking by sharing your thoughts</p>
      </div>

      <div className="feedback-form-container">
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="feedback_type">Feedback Type *</label>
              <select
                id="feedback_type"
                name="feedback_type"
                value={formData.feedback_type}
                onChange={handleChange}
                required
              >
                {feedbackTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Please describe your feedback in detail..."
              />
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        </div>

        <div className="feedback-info card mt-3">
          <h3>What kind of feedback can you provide?</h3>
          <div className="feedback-types-info">
            <div className="feedback-type-info">
              <FaBug style={{ color: '#e74c3c' }} />
              <div>
                <h4>Bug Report</h4>
                <p>Report any issues or problems you've encountered while using the app.</p>
              </div>
            </div>
            <div className="feedback-type-info">
              <FaLightbulb style={{ color: '#f39c12' }} />
              <div>
                <h4>Feature Request</h4>
                <p>Suggest new features or improvements that would make the app better.</p>
              </div>
            </div>
            <div className="feedback-type-info">
              <FaComments style={{ color: '#3498db' }} />
              <div>
                <h4>General Feedback</h4>
                <p>Share your overall experience, suggestions, or any other thoughts.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feedback; 