import { LoginBodyType } from "@/schemaValidations/auth.schema";
import { ApiResponse } from "@/services/http/apiError";
import { httpClient } from "@/services/http/httpClient";
import {
  LoginRes,
  LogoutRes,
  RefreshTokenRes,
} from "@/services/internal/auth/auth.types";

const authClient = {
  refreshTokenRequest: null as Promise<ApiResponse<RefreshTokenRes>> | null,

  clientLogin: (body: LoginBodyType) =>
    httpClient.post<LoginRes>("api/auth/login", body),

  clientLogout: () => httpClient.post<LogoutRes>("/api/auth/logout"),

  clientRefreshToken: () =>
    httpClient.post<RefreshTokenRes>("/api/auth/refresh"),

  async refreshToken() {
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest;
    }

    this.refreshTokenRequest =
      httpClient.post<RefreshTokenRes>("/api/auth/refresh");

    const result = await this.refreshTokenRequest;
    this.refreshTokenRequest = null;

    return result;
  },
};

export default authClient;
