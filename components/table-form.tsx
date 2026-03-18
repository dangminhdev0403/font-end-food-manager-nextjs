"use client";

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

import {
  TableFormValues,
  TableItemForm,
  tableSchema,
} from "@/schemaValidations/table.schema";
import { TableItem } from "@/services/internal/admin/tables/table.types";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

interface TableFormProps {
  initialData?: TableItem & { id: number };
  onSubmit: (data: TableItemForm) => void;
  onClose: () => void;
}

export default function TableForm({
  initialData,
  onSubmit,
  onClose,
}: TableFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TableFormValues>({
    resolver: zodResolver(tableSchema),
    defaultValues: initialData ?? {
      name: "",
      capacity: 1,
      status: "EMPTY",
    },
  });

  const onTableSubmit = (data: TableFormValues) => {
    onSubmit({ ...data, id: initialData?.id ?? Date.now() }); // Nếu có initialData thì dùng id đó, nếu không thì tạo id mới bằng timestamp
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onTableSubmit)} className="space-y-4">
      {/* Name */}
      <div className="space-y-2">
        <Label>Tên Bàn</Label>
        <Input {...register("name")} />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Capacity */}
      <div className="space-y-2">
        <Label>Sức Chứa (người)</Label>
        <Input
          type="number"
          min={1}
          max={20}
          {...register("capacity", { valueAsNumber: true })}
        />
        {errors.capacity && (
          <p className="text-sm text-red-500">{errors.capacity.message}</p>
        )}
      </div>

      {/* Status (chỉ edit mới hiện) */}
      {initialData && (
        <div className="space-y-2">
          <Label>Trạng Thái</Label>

          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMPTY">Trống</SelectItem>
                  <SelectItem value="OCCUPIED">Đang Dùng</SelectItem>
                  <SelectItem value="RESERVED">Đặt Trước</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          {errors.status && (
            <p className="text-sm text-red-500">{errors.status.message}</p>
          )}
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {initialData ? "Cập Nhật" : "Thêm Bàn"}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1"
        >
          Hủy
        </Button>
      </div>
    </form>
  );
}
