import authRequest from "@/services/internal/auth";
import { useMutation } from "@tanstack/react-query";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: authRequest.clientLogin,
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: authRequest.clientLogout,
  });
};
