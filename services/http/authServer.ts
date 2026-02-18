// services/http/authHttp.server.ts
import { auth } from "@/config/authentication/auth";
import { AxiosRequestConfig } from "axios";
import { httpServer } from "./httpServer";
type HttpServerType = typeof httpServer;
type Method = keyof HttpServerType;

async function injectAuth(
  options?: AxiosRequestConfig,
): Promise<AxiosRequestConfig> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Unauthorized");
  }

  return {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${session.accessToken}`,
    },
  };
}

async function callWithAuth<T>(
  method: Method,
  url: string,
  data?: any,
  options?: AxiosRequestConfig,
) {
  const config = await injectAuth(options);

  if (method === "get" || method === "delete") {
    return httpServer[method]<T>(url, config);
  }

  return httpServer[method]<T>(url, data, config);
}

export const authHttp = {
  get: <T>(url: string, options?: AxiosRequestConfig) =>
    callWithAuth<T>("get", url, undefined, options),

  delete: <T>(url: string, options?: AxiosRequestConfig) =>
    callWithAuth<T>("delete", url, undefined, options),

  post: <T>(url: string, data?: any, options?: AxiosRequestConfig) =>
    callWithAuth<T>("post", url, data, options),

  put: <T>(url: string, data?: any, options?: AxiosRequestConfig) =>
    callWithAuth<T>("put", url, data, options),
};
