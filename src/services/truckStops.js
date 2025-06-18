import api from './apiConfig';

export const truckStopsAPI = {
  // Get all truck stops
  getAll: () => api.get('/truck-stops/'),
  
  // Get a specific truck stop
  getById: (id) => api.get(`/truck-stops/${id}/`),
  
  // Get nearby truck stops
  getNearby: (lat, lng, unit = 'miles') => 
    api.get(`/truck-stops/nearby/?lat=${lat}&lng=${lng}&unit=${unit}`),
  
  // Create a new truck stop
  create: (data) => api.post('/truck-stops/', data),
  
  // Update a truck stop
  update: (id, data) => api.put(`/truck-stops/${id}/`, data),
  
  // Delete a truck stop
  delete: (id) => api.delete(`/truck-stops/${id}/`),
}; 