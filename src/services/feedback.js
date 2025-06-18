import api from './apiConfig';

export const feedbackAPI = {
  // Get all feedback (admin only)
  getAll: () => api.get('/feedback/'),
  
  // Get a specific feedback
  getById: (id) => api.get(`/feedback/${id}/`),
  
  // Create new feedback
  create: (data) => api.post('/feedback/', data),
  
  // Update feedback
  update: (id, data) => api.put(`/feedback/${id}/`, data),
  
  // Delete feedback
  delete: (id) => api.delete(`/feedback/${id}/`),
}; 