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
    // Try different possible authentication endpoints and credential formats
    let resp;
    
    // Try different endpoint variations
    const endpoints = [
      "/api/token/",
      "/api/login/", 
      "/api/auth/login/",
      "/api/signin/",
      "/auth/login/",
      "/login/"
    ];
    
    // Try different credential formats
    const credentialFormats = [
      credentials, // { username: email, password }
      { email: credentials.username, password: credentials.password },
      { username: credentials.username, password: credentials.password },
      { user: credentials.username, password: credentials.password }
    ];
    
    let lastError;
    
    for (const endpoint of endpoints) {
      for (const format of credentialFormats) {
        try {
          resp = await api.post(endpoint, format);
          // If we get here, the request was successful
          const token = resp.data.access || resp.data.token;
          localStorage.setItem("token", token);
          return resp.data;
        } catch (error) {
          lastError = error;
          // Continue trying other combinations
        }
      }
    }
    
    // If we get here, none of the combinations worked
    throw lastError;
  } catch (error) {
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
    
    console.log('Sending password reset request with payload:', payload);
    const resp = await api.post("/api/password/reset/request/", payload);
    console.log('Password reset request successful');
    return resp.data;
  } catch (error) {
    console.log('Password reset request failed:', error.response?.data);
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
    
    console.log('Sending password reset confirmation with payload:', payload);
    const resp = await api.post("/api/password/reset/confirm/", payload);
    console.log('Password reset confirmation successful');
    return resp.data;
  } catch (error) {
    console.log('Password reset confirmation failed:', error.response?.data);
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
