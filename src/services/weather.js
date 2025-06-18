import api from './apiConfig';

export const weatherAPI = {
  // Get all weather data
  getAll: () => api.get('/weather/'),
  
  // Get weather data for a specific truck stop
  getByTruckStop: (truckStopId) => api.get(`/weather/?truck_stop=${truckStopId}`),
  
  // Get a specific weather record
  getById: (id) => api.get(`/weather/${id}/`),
  
  // Create new weather data
  create: (data) => api.post('/weather/', data),
  
  // Update weather data
  update: (id, data) => api.put(`/weather/${id}/`, data),
  
  // Delete weather data
  delete: (id) => api.delete(`/weather/${id}/`),
}; 