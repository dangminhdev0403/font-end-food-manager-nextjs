import { auth } from "@/config/authentication/auth";
import envConfig from "@/config/env.config";
import axios, { AxiosRequestConfig } from "axios";
import { ApiError, ApiResponse } from "./apiError";
export interface ServerRequestConfig extends AxiosRequestConfig {
  isAuth?: boolean;
}
const http = axios.create({
  baseURL: envConfig.NEXT_PUBLIC_BACKEND_API_ENDPOINT,
  timeout: 10_000,
  withCredentials: true,
});

export async function request<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  data?: any,
  options?: ServerRequestConfig,
): Promise<ApiResponse<T>> {
  try {
    const { isAuth, ...axiosOptions } = options ?? {};
    let headers = { ...axiosOptions.headers };

    if (isAuth) {
      const session = await auth();
      if (!session?.accessToken) {
        throw new Error("Unauthorized");
      }

      headers = {
        ...headers,
        Authorization: `Bearer ${session.accessToken}`,
      };
    }
    const res = await http.request<ApiResponse<T>>({
      url,
      method,
      data,
      ...options,
    });
    console.log("Call API Success:", res.status);

    return res.data;
  } catch (error: any) {
    const payload = error.response?.data;
    console.log("Http Server Error", payload);

    throw new ApiError({
      status: payload?.status ?? error.response?.status ?? 500,
      message: payload?.message ?? error.message,
      error: payload?.error,
      data: payload?.data,
    });
  }
}
export const httpServer = {
  get: <T>(url: string, options?: ServerRequestConfig) =>
    request<T>("GET", url, undefined, options),

  post: <T>(url: string, data?: any, options?: ServerRequestConfig) =>
    request<T>("POST", url, data, options),

  put: <T>(url: string, data?: any, options?: ServerRequestConfig) =>
    request<T>("PUT", url, data, options),

  delete: <T>(url: string, options?: ServerRequestConfig) =>
    request<T>("DELETE", url, undefined, options),
};
