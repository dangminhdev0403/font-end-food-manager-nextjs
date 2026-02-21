"use client";
import envConfig from "@/config/env.config";
import { logger } from "@/lib/logger";
import { RefreshTokenRes } from "@/services/internal/auth/auth.types";
import axios, { AxiosError, AxiosHeaders, AxiosInstance } from "axios";
import { signOut } from "next-auth/react";
import { ApiError } from "./apiError";
// Request interceptor
let isRefreshing = false;
let refreshAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 3;

let failedQueue: {
  resolve: () => void;
  reject: (err: any) => void;
}[] = [];

function processQueue(error?: any) {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve();
  });
  failedQueue = [];
}
export const httpClient = axios.create({
  baseURL: envConfig.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

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
    const originalRequest: any = error.config;
    const payload = error.response?.data as any;

    const status =
      payload?.status ?? payload?.statusCode ?? error.response?.status ?? 500;
    logger.info(
      {
        status,
        url: originalRequest?.url,
        method: originalRequest?.method,
        payload,
      },
      "Http Client Error Response Payload: ",
    );
    if (status === 401 && !originalRequest._retry) {
      // Handle token refresh logic here, e.g., call a refresh token API endpoint
      logger.info(
        { url: originalRequest?.url, method: originalRequest?.method },
        "Received 401 Unauthorized, attempting to refresh token",
      );
      return handleUnauthorized(error, httpClient);
    }

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

async function handleUnauthorized(
  error: AxiosError,
  httpClient: AxiosInstance,
) {
  logger.info(
    { url: error.config?.url, method: error.config?.method },
    "Handling 401 Unauthorized error",
  );
  const originalRequest: any = error.config;

  if (!originalRequest) {
    return Promise.reject(error);
  }

  if (originalRequest._retry) {
    return Promise.reject(error);
  }

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({
        resolve: () => resolve(httpClient(originalRequest)),
        reject,
      });
    });
  }

  originalRequest._retry = true;
  isRefreshing = true;

  try {
    refreshAttempts++;

    logger.info({ attempt: refreshAttempts }, "Refreshing access token");

    // const res = await authClient.clientRefreshToken();
    const res = await httpClient.post<RefreshTokenRes>("/api/auth/refresh");

    logger.info({ res }, "Refresh reverse token success");

    refreshAttempts = 0;
    processQueue();

    return httpClient(originalRequest);
  } catch (err: any) {
    logger.error(
      { attempt: refreshAttempts, message: err?.message },
      "Refresh failed",
    );

    processQueue(err);

    if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
      logger.error(
        { attempts: refreshAttempts },
        "Max refresh attempts reached → logout",
      );
      refreshAttempts = 0;
      await signOut({
        callbackUrl: "/login",
        redirect: true,
      });
    }

    return Promise.reject(err);
  } finally {
    isRefreshing = false;
  }
}
