// src/api/axios.ts
import axios from "axios";

// Base instance for public APIs
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

export default axiosInstance;
