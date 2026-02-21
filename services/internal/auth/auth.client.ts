import { LoginBodyType } from "@/schemaValidations/auth.schema";
import { ApiResponse } from "@/services/http/apiError";
import { httpClient } from "@/services/http/httpClient";
import {
  LoginRes,
  LogoutRes,
  RefreshTokenRes,
} from "@/services/internal/auth/auth.types";

const authClient = {

  clientLogin: (body: LoginBodyType) =>
    httpClient.post<LoginRes>("api/auth/login", body),

  clientLogout: () => httpClient.post<LogoutRes>("/api/auth/logout"),

  clientRefreshToken: () =>
    httpClient.post<RefreshTokenRes>("/api/auth/refresh"),

 
};

export default authClient;
