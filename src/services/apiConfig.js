import axios from "axios";

// Create the axios instance
const api = axios.create({
  baseURL: "http://localhost:8000", // Temporarily use local backend for testing
});

// ✅ Add request interceptor (e.g., for auth token)
api.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");
    
    // Use admin token if available, otherwise use regular token
    const authToken = adminToken || token;
    
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  function (error) {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// ✅ Add response interceptor (for catching 401/500 errors globally)
api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // You can inspect error.response.status here
    if (error.response) {
      console.error("API Response Error:", error.response);
    } else if (error.request) {
      console.error("API No Response Error:", error.request);
    } else {
      console.error("Unexpected Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
