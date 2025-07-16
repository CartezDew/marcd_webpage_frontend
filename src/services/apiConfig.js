import axios from "axios";

// Create the axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// ✅ Add request interceptor (e.g., for auth token)
api.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Token ${token}`;
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
