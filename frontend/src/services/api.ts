// frontend/src/services/api.ts
import axios, { AxiosRequestConfig } from "axios";

// ✅ Use correct env var + default fallback
const API_BASE_URL: string =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// ✅ Explicit AxiosRequestConfig fixes TS errors
const config: AxiosRequestConfig = {
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
};

export const api = axios.create(config);

// ✅ Request interceptor
api.interceptors.request.use((config) => {
  const method = String(config.method || "unknown").toUpperCase();
  console.log(`Making ${method} request to ${config.url}`);
  return config;
});

// ✅ Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
