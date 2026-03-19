"use client";

import { toast } from "@/components/ui/use-toast";
import { queryKeys } from "@/constants/keys/queryKeys";
import { socket } from "@/lib/socket/socket";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useAdminOrdersRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.io.opts.query = {
      role: "admin",
    };

    if (!socket.connected) {
      socket.connect();
    }

    const handleNewOrder = (data: any) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.adminOrders.root,
      });

      toast({
        description: "Đơn hàng mới",
        variant: "success",
      });
    };

    const handleOrderUpdate = (data: any) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.adminOrders.root,
      });
    };

    socket.on("order:new", handleNewOrder);
    socket.on("order:update", handleOrderUpdate);

    return () => {
      socket.off("order:new", handleNewOrder);
      socket.off("order:update", handleOrderUpdate);
    };
  }, [queryClient]);
};
