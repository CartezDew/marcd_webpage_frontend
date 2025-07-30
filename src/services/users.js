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
    // Use the correct login endpoint
    const resp = await api.post("/api/login/", credentials);
    
    // Store the token
    const token = resp.data.access || resp.data.token;
    localStorage.setItem("token", token);
    
    return resp.data;
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
