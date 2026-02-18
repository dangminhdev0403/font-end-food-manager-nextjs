import { httpClient } from "@/services/http/httpClient";
import { ProfileRes, UpdatePasswordBody, UpdatePasswordRes } from "@/services/internal/me/profile.types";

export const profileClientApi = {
  getProfile: () => httpClient.get<ProfileRes>("/api/profile/me"),

  updatePassword: (body: UpdatePasswordBody) =>
    httpClient.put<UpdatePasswordRes>("/api/profile/change-password", body),
};
