import { LoginBodyType, LogoutBodyType } from "@/schemaValidations/auth.schema";
import { httpClient } from "@/services/http/httpClient";
import { httpServer } from "@/services/http/httpServer";

// ===== Types =====
export interface LoginRes {
  accessToken: string;
  refreshToken: string;
}

export interface LogoutRes {
  message: string;
}

// ===== API Layer =====
const authRequest = {
  // Browser → Backend
  clientLogin: (body: LoginBodyType) =>
    httpClient.post<LoginRes>("api/auth/login", body),
  // Next API → Backend
  serverLogin: (body: LoginBodyType) =>
    httpServer.post<LoginRes>("/auth/login", body),

  serverLogout: (body: LogoutBodyType & { accessToken: string }) =>
    httpServer.post<LogoutRes>(
      "/auth/logout",
      { refreshToken: body.refreshToken },
      {
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
        },
      },
    ),

  clientLogout: () => httpClient.post<LogoutRes>("/api/auth/logout"),
};

export default authRequest;
