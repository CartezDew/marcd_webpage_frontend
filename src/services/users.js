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
