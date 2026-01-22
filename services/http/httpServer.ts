import envConfig from "@/config";
import axios, { AxiosRequestConfig } from "axios";
import { ApiError, ApiResponse } from "./apiError";

const http = axios.create({
  baseURL: envConfig.NEXT_PUBLIC_API_ENDPOINT,
  timeout: 10_000,
});

export async function request<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  data?: any,
  options?: AxiosRequestConfig,
): Promise<ApiResponse<T>> {
  try {
    const res = await http.request<ApiResponse<T>>({
      url,
      method,
      data,
      ...options,
    });

    return res.data;
  } catch (error: any) {
    const payload = error.response?.data;
    throw new ApiError({
      status: payload?.status ?? 500,
      message: payload?.message ?? error.message,
      error: payload?.error,
      data: payload?.data,
    });
  }
}

export const httpServer = {
  get: <T>(url: string, options?: AxiosRequestConfig) =>
    request<T>("GET", url, undefined, options),

  post: <T>(url: string, data?: any, options?: AxiosRequestConfig) =>
    request<T>("POST", url, data, options),

  put: <T>(url: string, data?: any, options?: AxiosRequestConfig) =>
    request<T>("PUT", url, data, options),

  delete: <T>(url: string, options?: AxiosRequestConfig) =>
    request<T>("DELETE", url, undefined, options),
};
