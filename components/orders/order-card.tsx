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
    <div className="rounded-xl border border-[#2a2a2a] bg-[#111111] shadow-lg transition hover:border-[#444]">
      {/* HEADER */}

      <div className="flex items-center justify-between border-b border-[#2a2a2a] p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 font-semibold text-white shadow">
            {order.tableName}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-100">{order.id}</p>

              {order.guestName && (
                <p className="text-sm text-gray-400">• {order.guestName}</p>
              )}
            </div>

            {/* <p className="text-sm text-gray-500">
              {formatTime(order.createdAt)}
            </p> */}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge className={`border px-2 py-1 text-xs ${config.badge}`}>
            <StatusIcon className="mr-1 h-3 w-3" />
            {config.label}
          </Badge>

          {/* ACTION MENU */}

          {config.next.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400 hover:text-white hover:bg-[#1f1f1f]"
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
            className="text-gray-400 hover:text-white hover:bg-[#1f1f1f]"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>
      </div>

      {/* ITEMS PREVIEW */}

      <div className="px-4 py-3">
        <div className="flex flex-wrap gap-2">
          {order.items.slice(0, 2).map((item) => (
            <span
              key={item.id}
              className="rounded-md bg-[#1f1f1f] px-3 py-1 text-sm text-gray-200"
            >
              {item.quantity}x {item.name}
            </span>
          ))}

          {order.items.length > 2 && (
            <span className="rounded-md bg-[#1f1f1f] px-3 py-1 text-sm text-gray-200">
              +{order.items.length - 2} món
            </span>
          )}
        </div>
      </div>

      {/* EXPANDED */}

      {expanded && (
        <div className="space-y-4 border-t border-[#2a2a2a] px-4 py-4">
          <p className="font-semibold text-gray-100">Chi tiết đơn hàng</p>

          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="flex items-center justify-between text-sm"
              >
                <div>
                  <p className="text-gray-200">
                    {item.quantity}x {item.name}
                  </p>
                  {/* 
                  {item.specialRequests && (
                    <p className="text-xs text-gray-500 italic">
                      {item.specialRequests}
                    </p>
                  )} */}
                </div>

                <p className="font-medium text-gray-200">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
          {/* 
          {order.notes && (
            <div>
              <p className="font-semibold text-gray-200">Ghi chú</p>
              <p className="text-sm text-gray-400 italic">{order.notes}</p>
            </div>
          )} */}

          {/* TOTAL */}

          <div className="border-t border-[#2a2a2a] pt-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-200">Tổng cộng</p>

              <p className="text-lg font-bold text-blue-400">
                {formatCurrency(order.total)}
              </p>
            </div>

            {/* ACTION BUTTONS */}

            <div className="mt-4 flex gap-2">
              {config.next.map((status) => (
                <Button
                  key={status}
                  size="sm"
                  onClick={() => onStatusChange(status)}
                  className={`flex-1 font-medium text-white ${
                    STATUS_CONFIG[status].actionColor
                  }`}
                >
                  {STATUS_CONFIG[status].label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
