"use client";

import { Header } from "@/components/orders/header";
import { OrdersFilters } from "@/components/orders/order-filter";
import { OrdersList } from "@/components/orders/order-list";
import { OrderStatsCards } from "@/components/orders/order-stats-cards";
import { Spinner } from "@/components/ui/spinner";
import { adminOrderResource } from "@/resources/admin-order.resource";
import { useMemo, useState } from "react";

type FilterStatus =
  | "ALL"
  | "PENDING"
  | "CONFIRMED"
  | "COOKING"
  | "PAID"
  | "CANCELLED";

export default function OrdersPageClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>("ALL");

  const { data, isLoading } = adminOrderResource.useListQuery({
    page: 1,
    size: 20,
    status: selectedStatus,
  });

  const updateOrder = adminOrderResource.useUpdateMutation();

  const orders = data?.items ?? [];

  const filteredOrders = useMemo(() => {
    return orders.filter((order: any) => {
      const matchesSearch =
        order.tableId?.toString().includes(searchQuery) ||
        order.id?.toString().includes(searchQuery) ||
        order.guestName?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [orders, searchQuery]);

  const stats = useMemo(
    () => ({
      ALL: orders.length,
      PENDING: orders.filter((o: any) => o.status === "PENDING").length,
      CONFIRMED: orders.filter((o: any) => o.status === "CONFIRMED").length,
      COOKING: orders.filter((o: any) => o.status === "COOKING").length,
      PAID: orders.filter((o: any) => o.status === "PAID").length,
      CANCELLED: orders.filter((o: any) => o.status === "CANCELLED").length,
    }),
    [orders],
  );

  const handleStatusChange = (orderId: number, status: any) => {
    updateOrder.mutate({
      orderId,
      status,
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-3 text-muted-foreground">
        <Spinner className="size-6" />
        <p className="text-sm">Đang tải đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Header />

      <main className="container mx-auto space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <OrderStatsCards stats={stats} />

        <OrdersFilters
          searchQuery={searchQuery}
          selectedStatus={selectedStatus}
          onSearchChange={setSearchQuery}
          onStatusChange={setSelectedStatus}
        />

        <OrdersList
          orders={filteredOrders}
          onStatusChange={handleStatusChange}
        />
      </main>
    </div>
  );
}
