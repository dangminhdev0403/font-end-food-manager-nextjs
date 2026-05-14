"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { TableItem } from "@/services/internal/admin/tables/table.types";
import { ChefHat, Edit2, QrCode, Trash2, Users } from "lucide-react";
import { useState } from "react";

interface TableCardProps {
  table: TableItem;
  onEdit: () => void;
  onDelete: () => void;
  onShowQR: () => void;
}

const statusConfig: Record<
  "empty" | "occupied" | "reserved",
  {
    label: string;
    badgeClass: string;
    accentClass: string;
    barClass: string;
  }
> = {
  empty: {
    label: "Trống",
    badgeClass:
      "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    accentClass: "text-emerald-600 dark:text-emerald-400",
    barClass: "bg-emerald-500",
  },
  occupied: {
    label: "Đang dùng",
    badgeClass:
      "border-orange-500/30 bg-orange-500/15 text-orange-700 dark:text-orange-300",
    accentClass: "text-orange-600 dark:text-orange-400",
    barClass: "bg-orange-500",
  },
  reserved: {
    label: "Đặt trước",
    badgeClass:
      "border-blue-500/30 bg-blue-500/15 text-blue-700 dark:text-blue-300",
    accentClass: "text-blue-600 dark:text-blue-400",
    barClass: "bg-blue-500",
  },
};

export default function TableCard({
  table,
  onEdit,
  onDelete,
  onShowQR,
}: Readonly<TableCardProps>) {
  const key = table.status.toLowerCase() as keyof typeof statusConfig;
  const config = statusConfig[key] ?? statusConfig.empty;
  const [showDishes, setShowDishes] = useState(false);
  const orderedDishes = table.orderedDishes || [];

  return (
    <Card className="overflow-hidden p-0 transition-shadow duration-base hover:shadow-md">
      <div className={cn("h-1.5", config.barClass)} aria-hidden />

      <CardContent className="space-y-4 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-bold text-foreground sm:text-xl">
              {table.name}
            </h3>
            <div className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users
                aria-hidden
                className={cn("size-4", config.accentClass)}
              />
              <span>
                Sức chứa:{" "}
                <span className="font-semibold text-foreground">
                  {table.capacity} người
                </span>
              </span>
            </div>
          </div>
          <Badge variant="outline" className={cn("h-7", config.badgeClass)}>
            {config.label}
          </Badge>
        </div>

        <div className="flex items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
          <span>ID:</span>
          <span className="rounded bg-muted px-2 py-1 font-mono text-foreground">
            {table.id}
          </span>
        </div>

        {orderedDishes.length > 0 && (
          <div className="border-t border-border pt-3">
            <button
              type="button"
              onClick={() => setShowDishes((v) => !v)}
              aria-expanded={showDishes}
              className="flex min-h-10 w-full items-center gap-2 rounded-md text-sm text-muted-foreground transition-colors duration-base hover:text-foreground"
            >
              <ChefHat aria-hidden className="size-4" />
              <span>Các món đang gọi ({orderedDishes.length})</span>
            </button>

            {showDishes && (
              <ul className="mt-2 space-y-2 rounded-md bg-muted/40 p-3">
                {orderedDishes.map((dish) => (
                  <li
                    key={dish.id}
                    className="flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">
                        {dish.name}
                      </p>
                      <p className="text-muted-foreground">x{dish.quantity}</p>
                    </div>
                    <p className="shrink-0 font-semibold tabular-nums text-foreground">
                      {formatCurrency(dish.price * dish.quantity)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 pt-1">
          <Button
            variant="default"
            size="sm"
            onClick={onShowQR}
            aria-label={`Hiện mã QR cho ${table.name}`}
            className="h-10 gap-1.5"
          >
            <QrCode className="size-4" aria-hidden />
            <span className="hidden sm:inline">QR</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            aria-label={`Sửa ${table.name}`}
            className="h-10 gap-1.5"
          >
            <Edit2 className="size-4" aria-hidden />
            <span className="hidden sm:inline">Sửa</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            aria-label={`Xoá ${table.name}`}
            className="h-10 gap-1.5 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="size-4" aria-hidden />
            <span className="hidden sm:inline">Xoá</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
