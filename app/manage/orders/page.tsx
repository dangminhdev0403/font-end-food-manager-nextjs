"use client";

import { Header } from "@/components/orders/header";
import { OrdersFilters } from "@/components/orders/order-filter";
import { OrdersList } from "@/components/orders/order-list";
import { OrderStatsCards } from "@/components/orders/order-stats-cards";
import { toast } from "@/components/ui/use-toast";
import { useAdminOrdersRealtime } from "@/lib/hooks/sockets/use-admin-orders-realtime";
import { logger } from "@/lib/logger";
import { useOrderStatusCounts } from "@/queries/admin/useAdminOrders";
import { adminOrderResource } from "@/resources/admin-order.resource";
import { OrderStatus } from "@/services/internal/customers/guests/guest.types";

import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";

type FilterStatus = OrderStatus | "ALL";

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounceValue(searchQuery, 400);
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>("ALL");

  /** API */
  const { data, isLoading } = adminOrderResource.useListQuery({
    page: 1,
    size: 20,
    status: selectedStatus,
    search: debouncedSearch.trim(),
  });
  const { data: dataStatus, isLoading: statusLoading } = useOrderStatusCounts();
  const orders = data?.items ?? [];

  const updateOrderMutation = adminOrderResource.useUpdateMutation();

  /** Update status */
  const handleStatusChange = async (
    orderId: number,
    newStatus: OrderStatus,
  ) => {
    if (updateOrderMutation.isPending) return;
    try {
      await updateOrderMutation.mutateAsync({
        orderId,
        status: newStatus,
      });
      toast({
        description: "Cập nhật thành công",
        variant: "success",
      });
    } catch (error) {
      logger.error({ error }, "Có Lỗi xảy ra");
      toast({
        description: "Có lỗi xảy ra",
        variant: "error",
      });
    }
  };

  if (isLoading || statusLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-400">
        Đang tải đơn hàng...
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <OrderStatsCards
          stats={
            dataStatus ?? {
              ALL: 0,
              CANCELLED: 0,
              CONFIRMED: 0,
              COOKING: 0,
              PAID: 0,
              PENDING: 0,
            }
          }
        />

        <OrdersFilters
          searchQuery={searchQuery}
          selectedStatus={selectedStatus}
          onSearchChange={setSearchQuery}
          onStatusChange={setSelectedStatus}
        />

        <OrdersList orders={orders} onStatusChange={handleStatusChange} />
      </main>
    </div>
  );
}
