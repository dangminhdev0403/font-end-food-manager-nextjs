import envConfig from "@/config";
import axios, { AxiosError, AxiosResponse } from "axios";

export interface ApiResponse {
  status: number;
  error: string;
  message: string;
  data: any;
}
export interface ApiError<T = any> extends Error {
  status: number;
  error: string | null;
  message: string;
  data: T | null;
}
export const http = axios.create({
  baseURL: envConfig.API_SERVER_URL,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.response.use(
  <T>(res: AxiosResponse<{ status: number; message: string; data: T }>) => {
    res.status = res.data.status;
    return res.data as any;
  },
  (error: AxiosError) => {
    const res = error.response;
    error.status = res?.status;
    const payload = res?.data as ApiResponse;
    const formattedError: ApiError = {
      name: "ApiError",
      error: payload?.error ?? null,
      message: payload?.message ?? error.message ?? "Unknown error",
      status: payload?.status ?? res?.status ?? 500,
      data: null,
    };

    return Promise.reject(formattedError);
  }
);
