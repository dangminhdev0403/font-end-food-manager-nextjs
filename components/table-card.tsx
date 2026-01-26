"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Trash2, Edit2, Users, ChefHat } from "lucide-react";
import { useState } from "react";

interface Dish {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Table {
  id: number;
  name: string;
  capacity: number;
  status: "available" | "occupied" | "reserved";
  orderedDishes?: Dish[];
}

interface TableCardProps {
  table: Table;
  onEdit: () => void;
  onDelete: () => void;
  onShowQR: () => void;
}

const statusConfig = {
  available: {
    label: "Trống",
    badgeClass: "bg-green-500 dark:bg-green-600 text-white",
    dotClass: "bg-green-500",
    accentClass: "text-green-600 dark:text-green-400",
  },
  occupied: {
    label: "Đang Dùng",
    badgeClass: "bg-orange-500 dark:bg-orange-600 text-white",
    dotClass: "bg-orange-500",
    accentClass: "text-orange-600 dark:text-orange-400",
  },
  reserved: {
    label: "Đặt Trước",
    badgeClass: "bg-blue-500 dark:bg-blue-600 text-white",
    dotClass: "bg-blue-500",
    accentClass: "text-blue-600 dark:text-blue-400",
  },
};

export default function TableCard({
  table,
  onEdit,
  onDelete,
  onShowQR,
}: TableCardProps) {
  const config = statusConfig[table.status];
  const [showDishes, setShowDishes] = useState(false);
  const orderedDishes = table.orderedDishes || [];

  return (
    <Card className="p-0 border-2 border-border hover:border-primary/50 hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Status bar */}
      <div className={`h-1.5 ${config.dotClass}`} />

      <div className="p-6">
        <div className="space-y-5">
          {/* Header with name and status */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-foreground">
                {table.name}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <Users className={`h-4 w-4 ${config.accentClass}`} />
                <p className="text-sm font-medium text-muted-foreground">
                  Sức chứa:{" "}
                  <span className="text-foreground font-semibold">
                    {table.capacity} người
                  </span>
                </p>
              </div>
            </div>
            <span
              className={`px-3 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap ${config.badgeClass}`}
            >
              {config.label}
            </span>
          </div>

          {/* Table ID */}
          <div className="flex items-center gap-2 pt-2 border-t border-border/50">
            <span className="text-xs font-medium text-muted-foreground">
              ID:
            </span>
            <span className="text-sm font-semibold text-foreground bg-muted px-2 py-1 rounded">
              {table.id}
            </span>
          </div>

          {/* Ordered Dishes Section */}
          {orderedDishes.length > 0 && (
            <div className="pt-2 border-t border-border/50">
              <button
                onClick={() => setShowDishes(!showDishes)}
                className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-2 w-full"
              >
                <ChefHat className="h-4 w-4" />
                <span>Các món đang gọi ({orderedDishes.length})</span>
              </button>

              {showDishes && (
                <div className="space-y-2 bg-muted/30 p-3 rounded-lg">
                  {orderedDishes.map((dish) => (
                    <div
                      key={dish.id}
                      className="flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {dish.name}
                        </p>
                        <p className="text-muted-foreground">
                          x{dish.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-foreground">
                        {(dish.price * dish.quantity).toLocaleString("vi-VN")}₫
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <Button
              variant="default"
              size="sm"
              onClick={onShowQR}
              className="gap-1.5 h-9 text-xs font-semibold"
            >
              <QrCode className="h-4 w-4" />
              <span className="hidden sm:inline">QR</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="gap-1.5 h-9 text-xs font-semibold bg-transparent"
            >
              <Edit2 className="h-4 w-4" />
              <span className="hidden sm:inline">Sửa</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="gap-1.5 h-9 text-xs font-semibold hover:bg-destructive/10 hover:text-destructive bg-transparent"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Xóa</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
