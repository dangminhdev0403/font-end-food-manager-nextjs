"use client";

import envConfig from "@/config/env.config";
import axios, { AxiosError, AxiosHeaders } from "axios";
import { ApiError } from "./apiError";

export const httpClient = axios.create({
  baseURL: envConfig.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

// Request interceptor
httpClient.interceptors.request.use((config) => {
  if (!config.headers) {
    config.headers = new AxiosHeaders();
  }

  return config;
});

// Response interceptor
httpClient.interceptors.response.use(
  (res) => {
    return res.data;
  },

  (error: AxiosError) => {
    const payload = error.response?.data as any;

    return Promise.reject(
      new ApiError({
        status: payload?.status ?? error.response?.status ?? 500,
        message: payload?.message ?? error.message,
        error: payload?.error,
        data: payload?.data,
      }),
    );
  },
);
