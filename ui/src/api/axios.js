import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: "localhost:3000/api",
    withCredentials: true
});