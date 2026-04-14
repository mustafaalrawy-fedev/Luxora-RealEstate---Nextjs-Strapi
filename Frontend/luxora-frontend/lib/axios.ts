import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_URL,
  // baseURL: "http://localhost:1337/api",
  baseURL: process.env.NEXT_PUBLIC_STRAPI_API_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  // Client-side: get token from cookie
  const token = Cookies.get("jwt");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;