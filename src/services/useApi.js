// reusable useApi() hook to handle loading + error automatically in components //

import { useState, useCallback } from "react";
import api from "../utils/apiConfig"; 

function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (config) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api(config);
      return response.data;
    } catch (err) {
      console.error("useApi error:", err);
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { request, loading, error };
}

export default useApi;
