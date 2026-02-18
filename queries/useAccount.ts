import { queryKeys } from "@/lib/queryKeys";
import { profileClientApi } from "@/services/internal/me/profile.client";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAccountProfileQuery = () => {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: profileClientApi.getProfile,
  });
};

export const useUpdateProfileMutation = () => {
  return useMutation({
    mutationFn: profileClientApi.updatePassword,
  });
};
