"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, formatCurrency } from "@/lib/utils";
import { Order } from "@/services/internal/admin/orders/order.types";
import { OrderStatus } from "@/services/internal/customers/customer.types";
import {
  AlertCircle,
  CheckCircle,
  ChefHat,
  ChevronDown,
  CreditCard,
  MoreVertical,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    badgeClass: string;
    icon: LucideIcon;
    next: OrderStatus[];
  }
> = {
  PENDING: {
    label: "Chờ xử lý",
    badgeClass:
      "border-yellow-500/30 bg-yellow-500/15 text-yellow-700 dark:text-yellow-300",
    icon: AlertCircle,
    next: ["CONFIRMED", "CANCELLED"],
  },
  CONFIRMED: {
    label: "Đang phục vụ",
    badgeClass:
      "border-indigo-500/30 bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
    icon: CheckCircle,
    next: ["COOKING", "CANCELLED"],
  },
  COOKING: {
    label: "Đang nấu",
    badgeClass:
      "border-orange-500/30 bg-orange-500/15 text-orange-700 dark:text-orange-300",
    icon: ChefHat,
    next: ["PAID"],
  },
  PAID: {
    label: "Đã thanh toán",
    badgeClass:
      "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    icon: CreditCard,
    next: [],
  },
  CANCELLED: {
    label: "Đã huỷ",
    badgeClass:
      "border-red-500/30 bg-red-500/15 text-red-700 dark:text-red-300",
    icon: X,
    next: [],
  },
};

interface OrderCardProps {
  order: Order;
  onStatusChange: (status: OrderStatus) => void;
}

export function OrderCard({ order, onStatusChange }: Readonly<OrderCardProps>) {
  const [expanded, setExpanded] = useState(false);

  const config = STATUS_CONFIG[order.status];
  const StatusIcon = config.icon;

  return (
    <Card className="overflow-hidden transition-shadow duration-base hover:shadow-md">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary sm:size-14">
            <span className="truncate px-1 text-xs font-semibold sm:text-sm">
              {order.tableName}
            </span>
          </div>

          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="text-sm font-bold text-foreground sm:text-base">
              #{order.id}
            </p>
            {order.guestName && (
              <p className="truncate text-xs text-muted-foreground sm:text-sm">
                {order.guestName}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn("h-7 gap-1 px-2.5 text-xs", config.badgeClass)}
          >
            <StatusIcon className="size-3.5" aria-hidden />
            <span>{config.label}</span>
          </Badge>

          {config.next.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-9"
                  aria-label="Cập nhật trạng thái"
                >
                  <MoreVertical className="size-4" aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {config.next.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => onStatusChange(status)}
                  >
                    {STATUS_CONFIG[status].label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label={
              expanded ? "Thu gọn chi tiết đơn hàng" : "Mở chi tiết đơn hàng"
            }
            className="size-9"
          >
            <ChevronDown
              className={cn(
                "size-4 transition-transform duration-base",
                expanded && "rotate-180",
              )}
              aria-hidden
            />
          </Button>
        </div>
      </div>

      <CardContent className="space-y-3 p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Danh sách món ăn
        </p>
        <div className="flex flex-wrap gap-2">
          {order.items.slice(0, 2).map((item) => (
            <span
              key={item.id}
              className="inline-flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-sm font-medium text-foreground"
            >
              <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary/15 text-xs text-primary">
                {item.quantity}
              </span>
              {item.name}
            </span>
          ))}

          {order.items.length > 2 && (
            <span className="inline-flex items-center rounded-md bg-muted px-3 py-1.5 text-sm font-medium text-muted-foreground">
              +{order.items.length - 2} món khác
            </span>
          )}
        </div>

        {expanded && (
          <div className="space-y-4 border-t border-border pt-4">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Chi tiết đơn hàng
              </p>
              <ul className="space-y-2">
                {order.items.map((item, index) => (
                  <li
                    key={`${item.id}-${index}`}
                    className="flex items-start justify-between gap-3 rounded-md bg-muted/40 px-3 py-2.5"
                  >
                    <p className="text-sm font-medium text-foreground">
                      {item.quantity}x {item.name}
                    </p>
                    <p className="text-sm font-semibold tabular-nums text-foreground">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between rounded-md bg-primary/10 px-4 py-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-foreground">
                Tổng cộng
              </p>
              <p className="text-xl font-bold tabular-nums text-primary sm:text-2xl">
                {formatCurrency(order.total)}
              </p>
            </div>

            {config.next.length > 0 && (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {config.next.map((status) => (
                  <Button
                    key={status}
                    onClick={() => onStatusChange(status)}
                    className="h-10 w-full"
                  >
                    {STATUS_CONFIG[status].label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
