import { httpServer } from "@/services/http/httpServer";
import {
  LoginBodyRequest,
  LoginRes,
  LogoutBodyRequest,
  LogoutRes,
  RefreshTokenRes,
} from "@/services/internal/auth/auth.types";

const authServer = {
  serverLogin: (body: LoginBodyRequest) =>
    httpServer.post<LoginRes>("/auth/login", body),

  serverLogout: (body: LogoutBodyRequest ) =>
    httpServer.post<LogoutRes>(
      "/auth/logout",
      { refreshToken: body.refreshToken }
    ),

  serverRefreshToken: (body: { refreshToken: string }) =>
    httpServer.post<RefreshTokenRes>("/auth/refresh-token", body),
};

export default authServer;
