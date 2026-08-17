import axios from 'axios';
import { useAuthStore } from '../store/authStore';

let dynamicBaseURL = "http://localhost:5000/api"; // Default fallback

if (typeof window !== "undefined") {
  // If running in browser, check the actual URL
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    dynamicBaseURL = "http://localhost:5000/api";
  } else {
    // If not localhost, it must be the live server
    dynamicBaseURL = "https://erp-backend.jcbbooking.com/api";
  }
} else {
  // Server-side (during build/SSR)
  dynamicBaseURL = process.env.NEXT_PUBLIC_API_URL || "https://erp-backend.jcbbooking.com/api";
}

// Create a centralized Axios instance
const apiClient = axios.create({
  baseURL: dynamicBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the JWT token automatically
apiClient.interceptors.request.use(
  (config) => {
    // Read the token from Zustand global state
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle global errors (like 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Auto logout if the token expires or is invalid
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
