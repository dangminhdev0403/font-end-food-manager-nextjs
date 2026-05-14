"use client";

import { Card, CardContent } from "@/components/ui/card";
import { OrderStatusCount } from "@/services/internal/admin/orders/order.types";
import {
  AlertCircle,
  CheckCircle2,
  ChefHat,
  CreditCard,
  Package,
  XCircle,
  type LucideIcon,
} from "lucide-react";

interface OrderStatsCardProps {
  stats: OrderStatusCount;
}

type StatItem = {
  label: string;
  value: number;
  icon: LucideIcon;
  /** Tailwind classes for the icon container. Status colors are intentional. */
  iconClass: string;
};

export function OrderStatsCards({ stats }: OrderStatsCardProps) {
  const statItems: StatItem[] = [
    {
      label: "Tổng đơn",
      value: stats.ALL,
      icon: Package,
      iconClass: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    },
    {
      label: "Chờ xử lý",
      value: stats.PENDING,
      icon: AlertCircle,
      iconClass: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
    },
    {
      label: "Đang nấu",
      value: stats.COOKING,
      icon: ChefHat,
      iconClass: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
    },
    {
      label: "Đang phục vụ",
      value: stats.CONFIRMED,
      icon: CheckCircle2,
      iconClass: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400",
    },
    {
      label: "Đã thanh toán",
      value: stats.PAID,
      icon: CreditCard,
      iconClass: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Đã huỷ",
      value: stats.CANCELLED,
      icon: XCircle,
      iconClass: "bg-red-500/15 text-red-600 dark:text-red-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
      {statItems.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.label}
            className="transition-shadow duration-base hover:shadow-md"
          >
            <CardContent className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-muted-foreground sm:text-sm">
                  {stat.label}
                </p>
                <p className="mt-1 text-xl font-bold tabular-nums text-foreground sm:text-2xl md:text-3xl">
                  {stat.value}
                </p>
              </div>
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-md ${stat.iconClass}`}
              >
                <Icon className="size-5" aria-hidden />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
