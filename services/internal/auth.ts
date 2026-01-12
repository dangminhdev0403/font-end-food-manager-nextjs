import { LoginBodyType, LogoutBodyType } from "@/schemaValidations/auth.schema";
import { http } from "@/services/http/httpClient";

export interface LoginRes {
  accessToken: string;
  refreshToken: string;
}
const authRequest = {
  serverLogin: (body: LoginBodyType) => http.post<LoginRes>("auth/login", body),
  clientLogin: (body: LoginBodyType) =>
    http.post<LoginRes>("api/auth/login", body, {
      baseURL: "",
    }),

  serverLogout: (body: LoginBodyType) =>
    http.post<LoginRes>("auth/logout", body),
  clientLogout: (body: LogoutBodyType) =>
    http.post<any>("api/auth/logout", body, {
      baseURL: "",
    }),
};

export default authRequest;
