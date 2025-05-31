import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://192.168.0.158:5173:8000/api",
  withCredentials: true,
});

export default axiosInstance;
