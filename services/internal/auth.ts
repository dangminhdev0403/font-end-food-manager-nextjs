import { LoginBodyType, LogoutBodyType } from "@/schemaValidations/auth.schema";
import { http } from "@/services/http/httpClient";

export interface LoginRes {
  accessToken: string;
  refreshToken: string;
}
export interface LogoutRes {
  message: string;
}
const authRequest = {
  serverLogin: (body: LoginBodyType) => http.post<LoginRes>("auth/login", body),
  clientLogin: (body: LoginBodyType) =>
    http.post<LoginRes>("api/auth/login", body, {
      baseURL: "",
    }),

  serverLogout: (
    body: LogoutBodyType & {
      accessToken: string;
    }
  ) =>
    http.post<LogoutRes>(
      "auth/logout",
      {
        refreshToken: body.refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
        },
      }
    ),
  clientLogout: () =>
    http.post<LogoutRes>(
      "api/auth/logout",
      {},
      {
        baseURL: "",
      }
    ),
};

export default authRequest;
