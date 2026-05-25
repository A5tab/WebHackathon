// src/api/axios.ts
import axios from "axios";

// Base instance for public APIs
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || "";

    if (status === 401 || status === 403) {
      const isAuthEndpoint = url.includes("/auth/login") || url.includes("/auth/register");

      if (!isAuthEndpoint) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        window.dispatchEvent(new Event("auth:expired"));
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
