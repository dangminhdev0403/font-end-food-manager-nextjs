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
  getProfileClient: async () => httpClient.get<ProfileRes>("/api/profile/me"),
  getProfileServer: (accessToken: string) =>
    httpServer.get<ProfileRes>("/profile/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  // Next Route Handler → Backend
  updatePasswordServer: (body: UpdatePasswordBody, accessToken: string) =>
    httpServer.put<UpdatePasswordRes>("/profile/change-password", body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),

  // Browser → Next API proxy
  updatePasswordClient: (body: UpdatePasswordBody) =>
    httpClient.put<UpdatePasswordRes>("/api/profile/change-password", body),
};
