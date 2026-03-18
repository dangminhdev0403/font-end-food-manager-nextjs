"use client";

import { OrderStatusCount } from "@/services/internal/admin/orders/order.types";
import {
  AlertCircle,
  CheckCircle2,
  ChefHat,
  CreditCard,
  Package,
  XCircle,
} from "lucide-react";



interface OrderStatsCardProps {
  stats: OrderStatusCount;
}

export function OrderStatsCards({ stats }: OrderStatsCardProps) {
  const statItems = [
    {
      label: "Tổng Đơn",
      value: stats.ALL,
      icon: Package,
      color: "bg-blue-500/15 text-blue-400",
      border: "border-blue-500/30",
    },
    {
      label: "Chờ Xử Lí",
      value: stats.PENDING,
      icon: AlertCircle,
      color: "bg-yellow-500/15 text-yellow-400",
      border: "border-yellow-500/30",
    },

    {
      label: "Đang Nấu",
      value: stats.COOKING,
      icon: ChefHat,
      color: "bg-orange-500/15 text-orange-400",
      border: "border-orange-500/30",
    },
    {
      label: "Đang Phục Vụ",
      value: stats.CONFIRMED,
      icon: CheckCircle2,
      color: "bg-indigo-500/15 text-indigo-400",
      border: "border-indigo-500/30",
    },
    {
      label: "Đã Thanh Toán",
      value: stats.PAID,
      icon: CreditCard,
      color: "bg-green-500/15 text-green-400",
      border: "border-green-500/30",
    },
    {
      label: "Đã Hủy",
      value: stats.CANCELLED,
      icon: XCircle,
      color: "bg-red-500/15 text-red-400",
      border: "border-red-500/30",
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
      {statItems.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className={`rounded-xl border ${stat.border} bg-[#1f1f1f] p-5 transition-all hover:shadow-lg hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  {stat.label}
                </p>

                <p className="mt-2 text-3xl font-bold text-white">
                  {stat.value}
                </p>
              </div>

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
