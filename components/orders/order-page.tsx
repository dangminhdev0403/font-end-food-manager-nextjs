"use client";

import { Header } from "@/components/orders/header";
import { OrdersFilters } from "@/components/orders/order-filter";
import { OrdersList } from "@/components/orders/order-list";
import { OrderStatsCards } from "@/components/orders/order-stats-cards";
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

  /* ---------- CALL API ---------- */

  const { data, isLoading } = adminOrderResource.useListQuery({
    page: 1,
    size: 20,
    status: selectedStatus,
  });

  const updateOrder = adminOrderResource.useUpdateMutation();

  const orders = data?.items ?? [];

  /* ---------- FILTER ---------- */

  const filteredOrders = useMemo(() => {
    return orders.filter((order: any) => {
      const matchesSearch =
        order.tableId?.toString().includes(searchQuery) ||
        order.id?.toString().includes(searchQuery) ||
        order.guestName?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [orders, searchQuery]);

  /* ---------- STATS ---------- */

  const stats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((o: any) => o.status === "PENDING").length,
      confirmed: orders.filter((o: any) => o.status === "CONFIRMED").length,
      cooking: orders.filter((o: any) => o.status === "COOKING").length,
      paid: orders.filter((o: any) => o.status === "PAID").length,
      cancelled: orders.filter((o: any) => o.status === "CANCELLED").length,
    };
  }, [orders]);

  /* ---------- UPDATE STATUS ---------- */

  const handleStatusChange = (orderId: number, status: any) => {
    updateOrder.mutate({
      orderId,
      status,
    });
  };

  if (isLoading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-6 py-8">
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
