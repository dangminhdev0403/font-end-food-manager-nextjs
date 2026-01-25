"use client";

import { toast } from "@/components/ui/use-toast";
import { useLogoutMutation } from "@/queries/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export function useHandleLogout() {
  const router = useRouter();
  const logoutMutation = useLogoutMutation();
  const queryClient = useQueryClient();
  const locking = useRef(false);

  const handleLogout = async () => {
    if (locking.current || logoutMutation.isPending) return;
    locking.current = true;

    try {
      await logoutMutation.mutateAsync();

      // Flush all cached user data
      queryClient.clear();

      toast({
        description: "Đăng xuất thành công",
        variant: "success",
      });
    } catch (err) {
      console.error("Logout failed:", err);

      // Still clear local session
      queryClient.clear();

      toast({
        description: "Logout API lỗi, nhưng client session đã bị xoá",
        variant: "error",
      });
    } finally {
      router.replace("/login");
      locking.current = false;
    }
  };

  return { handleLogout, isLoading: logoutMutation.isPending };
}
