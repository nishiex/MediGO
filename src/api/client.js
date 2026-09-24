import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("medigo_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("medigo_token");
      localStorage.removeItem("medigo_user");
    }
    return Promise.reject(error);
  }
);

export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";
export const mockDelay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));
