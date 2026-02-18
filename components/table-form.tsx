"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableItem } from "@/services/internal/admin/tables/table.client";
import { useState } from "react";

interface TableFormProps {
  initialData?: TableItem & { id: number };
  onSubmit: (data: TableItem) => void;
  onClose: () => void;
}

export default function TableForm({
  initialData,
  onSubmit,
  onClose,
}: TableFormProps) {
  const [formData, setFormData] = useState<TableItem>(
    initialData || {
      id: 1,
      name: "MINH",
      capacity: 4,
      orderedDishes: [],
      qrToken: "test",
      status: "EMPTY",
    },
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSubmit(formData);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Tên Bàn</Label>
        <Input
          id="name"
          placeholder="e.g., Bàn 1, VIP 1"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="capacity">Sức Chứa (người)</Label>
        <Input
          id="capacity"
          type="number"
          min="1"
          max="20"
          value={formData.capacity}
          onChange={(e) =>
            setFormData({ ...formData, capacity: parseInt(e.target.value) })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Trạng Thái</Label>
        <Select
          value={formData.status}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              status: value as "EMPTY" | "OCCUPIED" | "RESERVED",
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Trống</SelectItem>
            <SelectItem value="occupied">Đang Dùng</SelectItem>
            <SelectItem value="reserved">Đặt Trước</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          type="submit"
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {initialData ? "Cập Nhật" : "Thêm Bàn"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1 bg-transparent"
        >
          Hủy
        </Button>
      </div>
    </form>
  );
}
