import { queryKeys } from "@/lib/queryKeys";
import { profileApiRequest } from "@/services/internal/account";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAccountProfileQuery = () => {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: profileApiRequest.getProfileClient,
  });
};

export const useUpdateProfileMutation = () => {
  return useMutation({
    mutationFn: profileApiRequest.updatePasswordClient,
  });
};
