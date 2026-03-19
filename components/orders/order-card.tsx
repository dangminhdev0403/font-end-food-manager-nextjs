"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { formatCurrency } from "@/lib/utils";
import { Order } from "@/services/internal/admin/orders/order.types";
import { OrderStatus } from "@/services/internal/customers/customer.types";

import {
  AlertCircle,
  CheckCircle,
  ChefHat,
  ChevronDown,
  CreditCard,
  LucideIcon,
  MoreVertical,
  X,
} from "lucide-react";

import { useState } from "react";

/* ---------------- STATUS CONFIG ---------------- */

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    badge: string;
    icon: LucideIcon;
    next: OrderStatus[];
    actionColor: string;
  }
> = {
  PENDING: {
    label: "Chờ xử lý",
    badge: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    icon: AlertCircle,
    next: ["CONFIRMED", "CANCELLED"],
    actionColor: "bg-yellow-500 hover:bg-yellow-600",
  },

  CONFIRMED: {
    label: "Đang phục vụ",
    badge: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
    icon: CheckCircle,
    next: ["COOKING", "CANCELLED"],
    actionColor: "bg-indigo-500 hover:bg-indigo-600",
  },

  COOKING: {
    label: "Đang nấu",
    badge: "bg-orange-500/20 text-orange-300 border-orange-500/40",
    icon: ChefHat,
    next: ["PAID"],
    actionColor: "bg-orange-500 hover:bg-orange-600",
  },

  PAID: {
    label: "Đã thanh toán",
    badge: "bg-green-500/20 text-green-300 border-green-500/40",
    icon: CreditCard,
    next: [],
    actionColor: "bg-green-500 hover:bg-green-600",
  },

  CANCELLED: {
    label: "Đã huỷ",
    badge: "bg-red-500/20 text-red-300 border-red-500/40",
    icon: X,
    next: [],
    actionColor: "bg-red-500 hover:bg-red-600",
  },
};

/* ---------------- UTIL ---------------- */

function formatTime(date: string) {
  const created = new Date(date);
  const now = new Date();
  const diff = Math.floor((now.getTime() - created.getTime()) / 60000);

  if (diff < 1) return "Vừa xong";
  if (diff < 60) return `${diff} phút trước`;

  return `${Math.floor(diff / 60)} giờ trước`;
}

/* ---------------- COMPONENT ---------------- */

interface OrderCardProps {
  order: Order;
  onStatusChange: (status: OrderStatus) => void;
}

export function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);

  const config = STATUS_CONFIG[order.status];
  const StatusIcon = config.icon;
  return (
    <div className="group rounded-xl border border-[#2a2a2a] bg-gradient-to-br from-[#141414] to-[#0a0a0a] shadow-lg transition-all duration-300 hover:border-[#3a3a3a] hover:shadow-xl">
      {/* HEADER */}

      <div className="flex flex-col gap-4 border-b border-[#2a2a2a] p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 font-bold text-white shadow-lg">
            <span className="truncate text-sm px-1">{order.tableName}</span>
          </div>

          <div className="flex-1">
            <div className="flex flex-col gap-1">
              <p className="text-base font-bold text-white">{order.id}</p>

              {order.guestName && (
                <p className="text-sm text-gray-400">{order.guestName}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            className={`border px-3 py-1.5 text-xs font-medium ${config.badge}`}
          >
            <StatusIcon className="mr-1.5 h-3.5 w-3.5" />
            {config.label}
          </Badge>

          {/* ACTION MENU */}

          {config.next.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400 transition-colors hover:bg-[#1f1f1f] hover:text-white"
                >
                  <MoreVertical size={18} />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="border-[#2a2a2a] bg-[#111] text-gray-200"
              >
                {config.next.map((status, index) => (
                  <DropdownMenuItem
                    key={`${status}-${index}`}
                    onClick={() => onStatusChange(status)}
                    className="cursor-pointer focus:bg-[#1f1f1f]"
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
            onClick={() => setExpanded(!expanded)}
            className="text-gray-400 transition-colors hover:bg-[#1f1f1f] hover:text-white"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>
      </div>

      {/* ITEMS PREVIEW */}

      <div className="space-y-3 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Danh sách món ăn
        </p>
        <div className="flex flex-wrap gap-2">
          {order.items.slice(0, 2).map((item) => (
            <span
              key={item.id}
              className="inline-flex items-center rounded-lg bg-[#1f1f1f] px-3.5 py-2 text-sm font-medium text-gray-100 ring-1 ring-inset ring-[#2a2a2a] transition-colors group-hover:bg-[#2a2a2a]"
            >
              <span className="mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/30 text-xs text-blue-300">
                {item.quantity}
              </span>
              {item.name}
            </span>
          ))}

          {order.items.length > 2 && (
            <span className="inline-flex items-center rounded-lg bg-[#1f1f1f] px-3.5 py-2 text-sm font-medium text-gray-400 ring-1 ring-inset ring-[#2a2a2a] transition-colors group-hover:bg-[#2a2a2a]">
              +{order.items.length - 2} món khác
            </span>
          )}
        </div>
      </div>

      {/* EXPANDED */}

      {expanded && (
        <div className="space-y-5 border-t border-[#2a2a2a] px-5 py-5">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Chi tiết đơn hàng
            </p>

            <div className="space-y-2.5">
              {order.items.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="flex items-start justify-between rounded-lg bg-[#0f0f0f] px-3.5 py-3 ring-1 ring-inset ring-[#1f1f1f] transition-colors hover:ring-[#2a2a2a]"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-100">
                      {item.quantity}x {item.name}
                    </p>
                  </div>

                  <p className="text-sm font-semibold text-blue-400">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* TOTAL */}

          <div className="rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-600/10 px-4 py-4 ring-1 ring-inset ring-blue-500/20">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-300">
                Tổng cộng
              </p>

              <p className="text-2xl font-bold text-blue-400">
                {formatCurrency(order.total)}
              </p>
            </div>
          </div>

          {/* ACTION BUTTONS */}

          {config.next.length > 0 && (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {config.next.map((status) => (
                <Button
                  key={status}
                  size="sm"
                  onClick={() => onStatusChange(status)}
                  className={`w-full font-medium text-white transition-all ${
                    STATUS_CONFIG[status].actionColor
                  }`}
                >
                  {STATUS_CONFIG[status].label}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
