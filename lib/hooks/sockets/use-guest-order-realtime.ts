"use client";

import { toast } from "@/components/ui/use-toast";
import { queryKeys } from "@/constants/keys/queryKeys";
import { socket } from "@/lib/socket/socket";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useGuestOrderRealtime = (orderId?: number) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!orderId) return;

    socket.io.opts.query = {
      orderId: orderId.toString(),
    };

    socket.connect();

    socket.on("connect", () => {
      console.log("Guest socket connected:", socket.id);
    });

    socket.on("order:update", (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.listOrderGuest,
      });

      toast({
        description: `Đơn #${data.id} vừa được cập nhật`,
        variant: "success",
      });
    });

    socket.on("order:status", (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.listOrderGuest,
      });

      toast({
        title: "📦 Trạng thái đơn",
        description: `Đơn #${data.id} → ${data.status}`,
      });
    });

    return () => {
      socket.off("order:update");
      socket.off("order:status");
    };
  }, [orderId, queryClient]);
};
