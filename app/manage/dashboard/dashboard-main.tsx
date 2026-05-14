"use client";

import { DishBarChart } from "@/app/manage/dashboard/dish-bar-chart";
import { RevenueLineChart } from "@/app/manage/dashboard/revenue-line-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Banknote,
  ClipboardList,
  Sofa,
  Users,
  type LucideIcon,
} from "lucide-react";

type Metric = {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
};

const metrics: Metric[] = [
  { title: "Tổng doanh thu", value: "0", icon: Banknote },
  { title: "Khách", value: "0", subtitle: "Gọi món", icon: Users },
  {
    title: "Đơn hàng",
    value: "0",
    subtitle: "Đã thanh toán",
    icon: ClipboardList,
  },
  { title: "Bàn đang phục vụ", value: "0", icon: Sofa },
];

export default function DashboardMain() {
  const resetDateFilter = () => {};

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="date-from">Từ ngày</Label>
                <Input id="date-from" type="date" className="h-11 w-full" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-to">Đến ngày</Label>
                <Input id="date-to" type="date" className="h-11 w-full" />
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={resetDateFilter}
              className="h-10 self-end text-muted-foreground"
            >
              Reset bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Card
              key={m.title}
              className="transition-shadow duration-base hover:shadow-md"
            >
              <CardContent className="space-y-3 p-4 sm:p-5">
                <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden />
                </div>
                <p className="text-sm text-muted-foreground">{m.title}</p>
                <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {m.value}
                </p>
                {m.subtitle && (
                  <p className="text-xs text-muted-foreground">{m.subtitle}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              Doanh thu theo thời gian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueLineChart />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              Xếp hạng món ăn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DishBarChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
