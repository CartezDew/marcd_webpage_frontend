import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://your-deployed-app.herokuapp.com"
      : "http://localhost:8000",
});

api.interceptors.request.use(
  function (config) {
    // Add any request interceptors if needed
    return config;
  },
  function (error) {
    console.log("Request error: ", error);
    return Promise.reject(error);
  }
);

export default api;