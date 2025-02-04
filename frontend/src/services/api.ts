import { NEXT_PUBLIC_API_URL } from "@/config/env";
import axios from "axios";

export const api = axios.create({
  baseURL: NEXT_PUBLIC_API_URL || "http://localhost:3000",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) config.headers['Authorization'] = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
