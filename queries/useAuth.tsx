import authClient from "@/services/internal/auth/auth.client";
import { useMutation } from "@tanstack/react-query";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: authClient.clientLogin,
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: authClient.clientLogout,
  });
};
