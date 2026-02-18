export interface LoginRes {
  email: string;
  name: string;
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

export interface LoginBodyRequest {
  email: string;
  password: string;
}
export interface LogoutBodyRequest {
  refreshToken: string;
}
