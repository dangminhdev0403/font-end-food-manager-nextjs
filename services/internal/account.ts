import { httpClient } from "@/services/http/httpClient";
import { httpServer } from "@/services/http/httpServer";

// ===== Types =====
export interface ProfileRes {
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  avatar: string | null;
}

export interface UpdatePasswordBody {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  refreshToken: string;
}

export interface UpdatePasswordRes {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

// ===== API Layer =====
export const profileApiRequest = {
  // Client UI call backend directly
  getProfileClient: () =>
    httpClient.get<ProfileRes>("/profile/me"),

  // Next Route Handler → Backend
  updatePasswordServer: (body: UpdatePasswordBody) =>
    httpServer.put<UpdatePasswordRes>("/profile/change-password", body),

  // Browser → Next API proxy
  updatePasswordClientProxy: (body: UpdatePasswordBody) =>
    httpClient.put<UpdatePasswordRes>("/api/profile/change-password", body),
};
