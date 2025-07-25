// Admin API service for fetching contact and waitlist data

const API_BASE_URL = 'http://localhost:8000';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Fetch contact submissions
export const fetchContactData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/contactus/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching contact data:', error);
    throw error;
  }
};

// Fetch waitlist entries
export const fetchWaitlistData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/waitlist-entries/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching waitlist data:', error);
    throw error;
  }
};

// Update contact submission (mark as read/unread)
export const updateContactStatus = async (contactId, isRead) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contactus/${contactId}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ is_read: isRead }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error updating contact status:', error);
    throw error;
  }
};

// Delete contact submission
export const deleteContact = async (contactId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contactus/${contactId}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw error;
  }
};

// Delete waitlist entry
export const deleteWaitlistEntry = async (entryId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/waitlist-entries/${entryId}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error('Error deleting waitlist entry:', error);
    throw error;
  }
};

// Export data functions
export const exportContactData = async (format = 'csv') => {
  try {
    const response = await fetch(`${API_BASE_URL}/contactus/export/?format=${format}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error exporting contact data:', error);
    throw error;
  }
};

export const exportWaitlistData = async (format = 'csv') => {
  try {
    const response = await fetch(`${API_BASE_URL}/waitlist-entries/export/?format=${format}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error exporting waitlist data:', error);
    throw error;
  }
};

// Authentication functions
export const adminLogin = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(response);
    
    // Store token if login successful
    if (data.token) {
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminEmail', email);
    }
    
    return data;
  } catch (error) {
    console.error('Error during admin login:', error);
    throw error;
  }
};

export const adminLogout = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/logout/`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    // Clear local storage regardless of response
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error during admin logout:', error);
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