import envConfig from "@/config";
import { LoginRes } from "@/services/internal/auth";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

// --- ApiError class ---
export interface ApiResponse<T> {
  data: T;
}
export class ApiError<T = any> extends Error {
  status: number;
  error: string | null;
  data: T | null;

  constructor({
    status,
    message,
    error = null,
    data = null,
  }: {
    status: number;
    message: string;
    error?: string | null;
    data?: T | null;
  }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.error = error;
    this.data = data;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

const isClient = globalThis.window !== undefined;

// --- Create Axios instance ---
export const http: AxiosInstance = axios.create({
  baseURL: envConfig.NEXT_PUBLIC_API_ENDPOINT,
  headers: { "Content-Type": "application/json" },
});

// --- Request Interceptor ---
//@ts-ignore
http.interceptors.request.use((config: AxiosRequestConfig) => {
  // Nếu headers chưa có, tạo object
  config.headers ??= {};

  // Add Authorization nếu client
  if (isClient) {
    const token = localStorage.getItem("accessToken");
    if (token) {
      (
        config.headers as Record<string, string>
      ).Authorization = `Bearer ${token}`;
    }
  }

  // Nếu baseURL = '' → gọi client route
  if (config.baseURL === "") {
    config.baseURL = undefined;
  }

  return config;
});

// --- Response Interceptor ---
http.interceptors.response.use(
  //@ts-ignore
  <T>(res: AxiosResponse<ApiResponse<T>>) => {
    const url = res.config.url ?? "";

    if (isClient) {
      if (url.includes("/login")) {
        const { accessToken, refreshToken } = res.data.data as LoginRes;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      }
      if (url.includes("/logout")) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    }

    return res.data; // trả data cho caller
  },

  (error: AxiosError) => {
    const payload = error.response?.data as any;

    const formattedError = new ApiError({
      status: payload?.status ?? error.response?.status ?? 500,
      message: payload?.message ?? error.message ?? "Unknown error",
      error: payload?.error ?? null,
      data: payload?.data ?? null,
    });

    return Promise.reject(formattedError);
  }
);

// --- Wrapper method hỗ trợ dynamic baseUrl ---
export async function request<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  data?: any,
  options?: AxiosRequestConfig & { baseUrl?: string }
): Promise<T> {
  let baseURL: string | undefined;

  if (options?.baseUrl === undefined) {
    baseURL = envConfig.NEXT_PUBLIC_API_ENDPOINT;
  } else {
    baseURL = options.baseUrl || undefined;
  }

  const res = await http.request<ApiResponse<T>>({
    url,
    method,
    data,
    ...options,
    baseURL,
  });

  return res.data.data;
}
export const httpClient = {
  post: <T>(
    url: string,
    data?: any,
    options?: AxiosRequestConfig & { baseUrl?: string }
  ) => request<T>("POST", url, data, options),

  get: <T>(url: string, options?: AxiosRequestConfig & { baseUrl?: string }) =>
    request<T>("GET", url, undefined, options),
};
