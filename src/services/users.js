import { devLog } from "../utils/logger";
import api from "./apiConfig";

export const signUp = async (credentials) => {
  try {
    const resp = await api.post("/users/register/", credentials);
    localStorage.setItem("token", resp.data.access);
    return resp.data.user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (credentials) => {
  try {
    // Debug: Log the credentials being sent
    console.log('Sending login request with credentials:', credentials);
    console.log('Credentials type:', typeof credentials);
    console.log('Credentials keys:', Object.keys(credentials));
    console.log('Username value:', credentials.username);
    console.log('Password value:', credentials.password ? '[REDACTED]' : 'undefined');
    
    // First, let's test if the backend is reachable
    console.log('Testing backend connectivity...');
    try {
      const healthCheck = await api.get('/');
      console.log('Backend health check response:', healthCheck.status);
    } catch (healthError) {
      console.error('Backend health check failed:', healthError.response?.status);
    }
    
    // Try the original working endpoint
    console.log('Attempting login with /api/token/');
    const resp = await api.post("/api/token/", credentials);
    
    // Store the token
    const token = resp.data.access || resp.data.token;
    localStorage.setItem("token", token);
    
    return resp.data;
  } catch (error) {
    console.error('SignIn error:', error);
    console.error('Error response:', error.response);
    console.error('Error response data:', error.response?.data);
    console.error('Error response status:', error.response?.status);
    console.error('Error response headers:', error.response?.headers);
    
    // Try to extract more details from the HTML error response
    if (error.response?.data && typeof error.response.data === 'string') {
      console.error('HTML Error Response:', error.response.data);
    }
    
    throw error;
  }
};

export const signOut = async () => {
  try {
    localStorage.removeItem("token");
    return true;
  } catch (error) {
    throw error;
  }
};

export const verifyUser = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    const resp = await api.post("/api/token/refresh/", { refresh: token });
    localStorage.setItem("token", resp.data.access);
    return resp.data;
  }
  return false;
};

// Password Reset Functions
export const requestPasswordReset = async (data) => {
  try {
    // Send the exact payload format the backend expects
    const payload = {
      username: data.username,
      professor_last_name: data.professor_last_name
    };
    
    // Only include security_answer if it's provided (for users who have set it up)
    if (data.security_answer) {
      payload.security_answer = data.security_answer;
    }
    
    const resp = await api.post("/api/password/reset/request/", payload);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const confirmPasswordReset = async (data) => {
  try {
    // Send the exact payload format the backend expects
    const payload = {
      username: data.username,
      professor_last_name: data.professor_last_name,
      new_password: data.new_password
    };
    
    // Only include security_answer if it's provided (for users who have set it up)
    if (data.security_answer) {
      payload.security_answer = data.security_answer;
    }
    
    const resp = await api.post("/api/password/reset/confirm/", payload);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (data) => {
  try {
    const resp = await api.post("/api/password/change/", data);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const setupSecurityQuestions = async (data) => {
  try {
    const resp = await api.post("/api/security-questions/setup/", data);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const updateSecurityQuestions = async (data) => {
  try {
    const resp = await api.put("/api/security-questions/update/", data);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

// Email-based Password Reset Functions
export const requestEmailPasswordReset = async (data) => {
  try {
    const resp = await api.post("/api/password/reset/email/request/", data);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const verifyEmailResetCode = async (data) => {
  try {
    const resp = await api.post("/api/password/reset/email/verify/", data);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const confirmEmailPasswordReset = async (data) => {
  try {
    const resp = await api.post("/api/password/reset/email/confirm/", data);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

// Waitlist Functions
export const addToWaitlist = async (data) => {
  try {
    const resp = await api.post("/waitlist/", data);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

// Test function for debugging - call this from browser console
export const testLogin = async (username, password) => {
  console.log('Testing login with:', { username, password });
  try {
    const result = await signIn({ username, password });
    console.log('Login successful:', result);
    return result;
  } catch (error) {
    console.error('Login failed:', error);
    return error;
  }
};

// Test different authentication endpoints
export const testAuthEndpoints = async (username, password) => {
  const endpoints = [
    '/api/token/',
    '/api/auth/login/',
    '/api/login/',
    '/auth/login/',
    '/users/login/',
    '/api/users/login/',
    '/api/token/login/',
    '/api/authentication/login/'
  ];
  
  const credentialFormats = [
    { username, password },
    { email: username, password },
    { user: username, password },
    { login: username, password }
  ];
  
  console.log('Testing different authentication endpoints and data formats...');
  
  for (const endpoint of endpoints) {
    for (const credentials of credentialFormats) {
      try {
        console.log(`\n--- Testing ${endpoint} with ${JSON.stringify(credentials)} ---`);
        const resp = await api.post(endpoint, credentials);
        console.log(`✅ SUCCESS with ${endpoint}:`, resp.data);
        return { endpoint, credentials, data: resp.data };
      } catch (error) {
        console.log(`❌ FAILED with ${endpoint}:`, error.response?.status, error.response?.data);
      }
    }
  }
  
  console.log('\n❌ All endpoints and formats failed');
  return null;
};

// Make functions available globally for console testing
if (typeof window !== 'undefined') {
  window.testLogin = testLogin;
  window.testAuthEndpoints = testAuthEndpoints;
}
