import api from './apiConfig';

export const reviewsAPI = {
  // Get all reviews
  getAll: () => api.get('/reviews/'),
  
  // Get a specific review
  getById: (id) => api.get(`/reviews/${id}/`),
  
  // Create a new review
  create: (data) => api.post('/reviews/', data),
  
  // Update a review
  update: (id, data) => api.put(`/reviews/${id}/`, data),
  
  // Delete a review
  delete: (id) => api.delete(`/reviews/${id}/`),
}; 