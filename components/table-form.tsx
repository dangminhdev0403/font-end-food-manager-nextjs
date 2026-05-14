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
    onSubmit({ ...data, id: initialData?.id ?? Date.now() });
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit(onTableSubmit)}
      className="space-y-4"
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="table-name">Tên bàn</Label>
        <Input id="table-name" className="h-11" {...register("name")} />
        {errors.name && (
          <p role="alert" className="text-sm text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="table-capacity">Sức chứa (người)</Label>
        <Input
          id="table-capacity"
          type="number"
          min={1}
          max={20}
          inputMode="numeric"
          className="h-11"
          {...register("capacity", { valueAsNumber: true })}
        />
        {errors.capacity && (
          <p role="alert" className="text-sm text-destructive">
            {errors.capacity.message}
          </p>
        )}
      </div>

      {initialData && (
        <div className="space-y-2">
          <Label htmlFor="table-status">Trạng thái</Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="table-status" className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMPTY">Trống</SelectItem>
                  <SelectItem value="OCCUPIED">Đang dùng</SelectItem>
                  <SelectItem value="RESERVED">Đặt trước</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && (
            <p role="alert" className="text-sm text-destructive">
              {errors.status.message}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="h-11 flex-1"
        >
          Huỷ
        </Button>
        <Button type="submit" className="h-11 flex-1">
          {initialData ? "Cập nhật" : "Thêm bàn"}
        </Button>
      </div>
    </form>
  );
}
