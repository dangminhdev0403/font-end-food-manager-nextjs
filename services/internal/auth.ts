import { LoginBodyType } from "@/schemaValidations/auth.schema";
import { http } from "@/services/http/httpClient";

interface LoginRes {
  
    accessToken: string;
    refreshToken: string;
    // account: {
    //   id: number;
    //   name: string;
    //   email: string;
    //   role: string;
    // };
  
  
}
const authRequest = {
  serverLogin: (body: LoginBodyType) => http.post<LoginRes>("auth/login", body),
  clientLogin: (body: LoginBodyType) => http.post<LoginRes>("auth/login", body),
};

export default authRequest;
