"use client";

import { OrderStatus } from "@/components/orders/order-filter";
import { Card, CardContent } from "@/components/ui/card";
import { Order } from "@/services/internal/admin/orders/order.types";
import { Inbox } from "lucide-react";
import { OrderCard } from "./order-card";

interface OrdersListProps {
  orders: Order[];
  onStatusChange: (orderId: number, newStatus: OrderStatus) => void;
}

export function OrdersList({ orders, onStatusChange }: OrdersListProps) {
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 p-8 text-center sm:p-12">
          <Inbox aria-hidden className="size-10 text-muted-foreground" />
          <p className="text-base font-semibold text-foreground sm:text-lg">
            Không có đơn hàng
          </p>
          <p className="text-sm text-muted-foreground">
            Không tìm thấy đơn hàng phù hợp với tiêu chí tìm kiếm
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
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
