// src/lib/axios-public.ts
import axios from "axios";

export const axiosPublicInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
  headers: {
    "Content-Type": "application/json",
  },
});
