import { LoginBodyType, LogoutBodyType } from "@/schemaValidations/auth.schema";
import { ApiResponse } from "@/services/http/apiError";
import { httpClient } from "@/services/http/httpClient";
import { httpServer } from "@/services/http/httpServer";

// ===== Types =====
export interface LoginRes {
  accessToken: string;
  refreshToken: string;
}
export interface RefreshTokenRes {
  accessToken: string;
  refreshToken: string;
}

export interface LogoutRes {
  message: string;
}

// ===== API Layer =====
const authRequest = {
  refreshTokenRequest: null as Promise<ApiResponse<RefreshTokenRes>> | null,
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

  clientRefreshToken: () =>
    httpClient.post<RefreshTokenRes>("/api/auth/refresh"),
  serverRefreshToken: (accessToken: string, body: { refreshToken: string }) =>
    httpServer.post<RefreshTokenRes>("/auth/refresh-token", body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  async refreshToken() {
    console.log("Function Refresh Run");

    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest;
    }
    this.refreshTokenRequest = httpClient.post<RefreshTokenRes>(
      "/api/auth/refresh",
      null,
    );
    const result = await this.refreshTokenRequest;
    this.refreshTokenRequest = null;
    return result;
  },
};

export default authRequest;
