import envConfig from "@/config";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

// --- ApiError class ---
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

// --- Create Axios instance ---
export const http: AxiosInstance = axios.create({
  baseURL: envConfig.NEXT_PUBLIC_API_ENDPOINT,
  headers: { "Content-Type": "application/json" },
});

// --- Request Interceptor ---
//@ts-ignore
http.interceptors.request.use((config: AxiosRequestConfig) => {
  // Nếu headers chưa có, tạo object
  if (!config.headers) {
    config.headers = {};
  }

  // Add Authorization nếu client
  if (typeof window !== "undefined") {
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
  <T>(res: AxiosResponse<T>) => res, // trả nguyên response
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
  options?: AxiosRequestConfig & { baseUrl?: string }
): Promise<AxiosResponse<T>> {
  const baseURL =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT // backend mặc định
      : options.baseUrl === "" // gọi client
      ? undefined
      : options.baseUrl;

  return http.request<T>({
    ...options,
    url,
    method,
    baseURL,
  });
}

// --- Shortcut helpers ---
export const httpClient = {
  get: <T>(url: string, options?: AxiosRequestConfig & { baseUrl?: string }) =>
    request<T>("GET", url, options),
  post: <T>(
    url: string,
    data?: any,
    options?: AxiosRequestConfig & { baseUrl?: string }
  ) => request<T>("POST", url, { ...options, data }),
  put: <T>(
    url: string,
    data?: any,
    options?: AxiosRequestConfig & { baseUrl?: string }
  ) => request<T>("PUT", url, { ...options, data }),
  delete: <T>(
    url: string,
    options?: AxiosRequestConfig & { baseUrl?: string }
  ) => request<T>("DELETE", url, options),
};
