"use client";

import { OrderStatus } from "@/components/orders/order-filter";
import { Order } from "@/services/internal/admin/orders/order.types";
import { OrderCard } from "./order-card";

interface OrdersListProps {
  orders: Order[];
  onStatusChange: (orderId: number, newStatus: OrderStatus) => void;
}

export function OrdersList({ orders, onStatusChange }: OrdersListProps) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-gray-700 bg-[#1f1f1f] py-12">
        <div className="text-center">
          <p className="mb-2 text-lg font-semibold text-white">
            Không có đơn hàng
          </p>

          <p className="text-sm text-gray-400">
            Không tìm thấy đơn hàng phù hợp với tiêu chí tìm kiếm
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onStatusChange={(status) => onStatusChange(order.id, status)}
        />
      ))}
    </div>
  );
}
