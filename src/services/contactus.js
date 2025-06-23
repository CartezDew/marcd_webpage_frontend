// services/contactus.js
import api from './apiConfig';

export const contactUsAPI = {
  getAll: () => api.get('/feedback/'),
  getById: (id) => api.get(`/feedback/${id}/`),
  create: (data) => api.post('/feedback/', data),
  update: (id, data) => api.put(`/feedback/${id}/`, data),
  delete: (id) => api.delete(`/feedback/${id}/`),
};
