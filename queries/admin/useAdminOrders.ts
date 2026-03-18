import adminOrderClient from "@/services/internal/admin/orders/order.client";
import { useQuery } from "@tanstack/react-query";

export const useOrderStatusCounts = () => {
  return useQuery({
    queryKey: ["admin-orders", "status-count"],
    queryFn: async () => {
      const res = await adminOrderClient.getOrderCounts();
      return res.data;
    },
    refetchInterval: 5000,
  });
};
