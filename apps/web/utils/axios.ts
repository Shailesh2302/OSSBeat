// src/lib/axios.ts
import axios from "axios";
import { refreshAccessToken } from "../lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const ok = await refreshAccessToken();
      if (ok) {
        originalRequest.headers.Authorization = `Bearer ${localStorage.getItem(
          "token"
        )}`;
        return axiosInstance(originalRequest);
      }

      window.location.href = "/login?error=session_expired";
    }

    return Promise.reject(error);
  }
);
