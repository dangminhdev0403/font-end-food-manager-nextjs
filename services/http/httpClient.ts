"use client";

import envConfig from "@/config";
import { UpdatePasswordRes } from "@/services/internal/account";
import { LoginRes } from "@/services/internal/auth";
import axios, { AxiosError, AxiosHeaders, AxiosResponse } from "axios";
import { ApiError, ApiResponse } from "./apiError";

export const httpClient = axios.create({
  baseURL: envConfig.NEXT_PUBLIC_API_ENDPOINT,
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

// Request interceptor
httpClient.interceptors.request.use((config) => {
  if (!config.headers) {
    config.headers = new AxiosHeaders();
  }
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor
httpClient.interceptors.response.use(
  <T>(res: AxiosResponse<ApiResponse<T>>) => {
    const url = res.config.url ?? "";

    if (url.includes("/login")) {
      const { accessToken, refreshToken } = res.data.data as LoginRes;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    }

    if (url.includes("/profile/change-password")) {
      const tokens = res.data.data as UpdatePasswordRes;
      localStorage.setItem("accessToken", tokens.tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.tokens.refreshToken);
    }

    if (url.includes("/logout")) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }

    return res;
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
