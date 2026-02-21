import { auth } from "@/config/authentication/auth";
import envConfig from "@/config/env.config";
import { logger } from "@/lib/logger";
import { privatePaths } from "@/lib/utils";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
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
        throw new ApiError({
          status: 401,
          message: "Unauthorized: No access token found",
          error: "Unauthorized",
        });
      }
      logger.info(
        { accessToken: session.accessToken },
        "Attaching access token to request headers",
      );
      const isPrivate = privatePaths.some((p) => url.startsWith(p));

      if (isPrivate) {
        headers = {
          ...headers,
          Authorization: `Bearer ${session.accessToken}`,
        };
      }
    }
    const res = await http.request<ApiResponse<T>>({
      url,
      method,
      data,
      ...axiosOptions,
      headers,
    });
    logger.info({ dataAPI: res.data }, "Call API Success, Response Status: ");
    return res.data;
  } catch (error: AxiosError | any) {
    const originalRequest: any = error.config;
    const payload = error.response?.data;

    const status =
      payload?.status ?? payload?.statusCode ?? error.response?.status ?? 500;
    logger.info(
      {
        status,
        url: originalRequest?.url,
        method: originalRequest?.method,
        payload,
      },
      "Http Server Error Response Payload: ",
    );
    throw new ApiError({
      status,
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
