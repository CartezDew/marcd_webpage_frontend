import api from './apiConfig';

export const truckStopsAPI = {
  // Get all truck stops
  getAll: () => api.get('/truck-stops/'),
  
  // Get a specific truck stop
  getById: (id) => api.get(`/truck-stops/${id}/`),
  
  // Create a new truck stop
  create: (data) => api.post('/truck-stops/', data),
  
  // Update a truck stop
  update: (id, data) => api.put(`/truck-stops/${id}/`, data),
  
  // Delete a truck stop
  delete: (id) => api.delete(`/truck-stops/${id}/`),
}; 