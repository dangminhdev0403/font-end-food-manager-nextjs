"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  { value: "ALL", label: "Tất Cả" },
  { value: "PENDING", label: "Chờ Xử Lí" },
  { value: "CONFIRMED", label: "Đang Phục Vụ" },
  { value: "COOKING", label: "Đang Nấu" },
  { value: "PAID", label: "Đã Thanh Toán" },
  { value: "CANCELLED", label: "Đã Hủy" },
];

export function OrdersFilters({
  searchQuery,
  selectedStatus,
  onSearchChange,
  onStatusChange,
}: OrdersFiltersProps) {
  return (
    <div className="mb-6 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />

        <Input
          placeholder="Tìm kiếm theo số bàn, mã đơn hoặc tên khách..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border-gray-700 bg-[#1f1f1f] pl-10 text-white placeholder-gray-400 focus:border-blue-500"
        />
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-5 w-5 text-gray-400" />

        {statusOptions.map((status) => (
          <Button
            key={status.value}
            size="sm"
            variant={selectedStatus === status.value ? "default" : "outline"}
            onClick={() => onStatusChange(status.value)}
            className={`rounded-full ${
              selectedStatus === status.value
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "border-gray-600 bg-[#1f1f1f] text-gray-300 hover:bg-gray-800"
            }`}
          >
            {status.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
