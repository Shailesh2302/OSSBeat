// src/lib/axios-auth.ts
import axios from "axios";
import { refreshAccessToken } from "../lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export const axiosAuthInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosAuthInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosAuthInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const ok = await refreshAccessToken();
      if (ok) {
        originalRequest.headers.Authorization = `Bearer ${localStorage.getItem(
          "access_token"
        )}`;
        return axiosAuthInstance(originalRequest);
      }
      window.location.href = "/login?error=session_expired";
    }
    return Promise.reject(error);
  }
);
