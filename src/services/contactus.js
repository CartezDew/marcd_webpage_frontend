// services/contactus.js
import api from './apiConfig';

export const contactUsAPI = {
  getAll: () => api.get('/contactus/'),
  getById: (id) => api.get(`/contactus/${id}/`),
  create: (data) => api.post('/contactus/', data),
  update: (id, data) => api.put(`/contactus/${id}/`, data),
  delete: (id) => api.delete(`/contactus/${id}/`),
};
