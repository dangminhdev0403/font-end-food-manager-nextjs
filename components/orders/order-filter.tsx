"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Filter, Search } from "lucide-react";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COOKING"
  | "PAID"
  | "CANCELLED";

export type FilterStatus = OrderStatus | "ALL";

interface OrdersFiltersProps {
  searchQuery: string;
  selectedStatus: FilterStatus;
  onSearchChange: (query: string) => void;
  onStatusChange: (status: FilterStatus) => void;
}

const statusOptions: Array<{ value: FilterStatus; label: string }> = [
  { value: "ALL", label: "Tất cả" },
  { value: "PENDING", label: "Chờ xử lý" },
  { value: "CONFIRMED", label: "Đang phục vụ" },
  { value: "COOKING", label: "Đang nấu" },
  { value: "PAID", label: "Đã thanh toán" },
  { value: "CANCELLED", label: "Đã huỷ" },
];

export function OrdersFilters({
  searchQuery,
  selectedStatus,
  onSearchChange,
  onStatusChange,
}: OrdersFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder="Tìm kiếm theo số bàn, mã đơn hoặc tên khách..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Tìm kiếm đơn hàng"
          className="h-11 pl-9"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Filter aria-hidden className="size-4 text-muted-foreground" />
        {statusOptions.map((status) => {
          const isActive = selectedStatus === status.value;
          return (
            <Button
              key={status.value}
              size="sm"
              variant={isActive ? "default" : "outline"}
              onClick={() => onStatusChange(status.value)}
              aria-pressed={isActive}
              className={cn("h-10 rounded-full", isActive && "shadow-sm")}
            >
              {status.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
