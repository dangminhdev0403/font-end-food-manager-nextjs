import { httpServer } from "@/services/http/httpServer";
import {
  ProfileRes,
  UpdatePasswordBody,
  UpdatePasswordRes,
} from "@/services/internal/me/profile.types";
export const profileServerApi = {
  getProfile: (accessToken: string) =>
    httpServer.get<ProfileRes>("/profile/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  updatePassword: (body: UpdatePasswordBody, accessToken: string) =>
    httpServer.put<UpdatePasswordRes>("/profile/change-password", body, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
};
