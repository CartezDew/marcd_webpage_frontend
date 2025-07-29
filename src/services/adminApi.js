import { devError } from "../utils/logger";
// Admin API service for fetching contact and waitlist data
import api from './apiConfig';



// Fetch contact submissions
export const fetchContactData = async () => {
  try {
    const response = await api.get('/contactus/');
    return response.data;
  } catch (error) {
    devError('Error fetching contact data:', error);
    throw error;
  }
};

// Fetch waitlist entries
export const fetchWaitlistData = async () => {
  try {
    const response = await api.get('/waitlist-entries/');
    return response.data;
  } catch (error) {
    devError('Error fetching waitlist data:', error);
    throw error;
  }
};

// Update contact submission (mark as read/unread)
export const updateContactStatus = async (contactId, isRead, contactData = null) => {
  try {
    let updateData;
    
    // Try sending just the is_read field first
    updateData = { is_read: isRead };
    
    // If that doesn't work, we can try the complete object approach
    // if (contactData) {
    //   updateData = { ...contactData, is_read: isRead };
    // }
    
    const response = await api.patch(`/contactus/${contactId}/`, updateData);
    return response.data;
  } catch (error) {
    devError('Error updating contact status:', error);
    if (error.response) {
      devError('Error response data:', error.response.data);
      devError('Error response status:', error.response.status);
    }
    throw error;
  }
};

// Delete contact submission
export const deleteContact = async (contactId) => {
  try {
    const response = await api.delete(`/contactus/${contactId}/`);
    return response.data;
  } catch (error) {
    devError('Error deleting contact:', error);
    throw error;
  }
};

// Delete waitlist entry
export const deleteWaitlistEntry = async (entryId) => {
  try {
    const response = await api.delete(`/waitlist-entries/${entryId}/`);
    return response.data;
  } catch (error) {
    devError('Error deleting waitlist entry:', error);
    throw error;
  }
};

// Export data functions
export const exportContactData = async (format = 'csv') => {
  try {
    const response = await api.get(`/contactus/export/?format=${format}`);
    return response.data;
  } catch (error) {
    devError('Error exporting contact data:', error);
    throw error;
  }
};

export const exportWaitlistData = async (format = 'csv') => {
  try {
    const response = await api.get(`/waitlist-entries/export/?format=${format}`);
    return response.data;
  } catch (error) {
    devError('Error exporting waitlist data:', error);
    throw error;
  }
};

// Authentication functions
export const adminLogin = async (email, password) => {
  try {
    const response = await api.post('/admin/login/', { email, password });
    const data = response.data;
    
    // Store token if login successful
    if (data.token) {
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminEmail', email);
    }
    
    return data;
  } catch (error) {
    devError('Error during admin login:', error);
    throw error;
  }
};

export const adminLogout = async () => {
  try {
    const response = await api.post('/admin/logout/');
    
    // Clear local storage regardless of response
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    
    return response.data;
  } catch (error) {
    devError('Error during admin logout:', error);
    // Still clear local storage even if API call fails
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('adminToken');
  return !!token;
};

// Get current admin user info
export const getCurrentAdmin = () => {
  const email = localStorage.getItem('adminEmail');
  const token = localStorage.getItem('adminToken');
  
  if (!email || !token) {
    return null;
  }
  
  return {
    email,
    token
  };
}; 