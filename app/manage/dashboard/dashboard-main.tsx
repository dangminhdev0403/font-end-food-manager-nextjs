"use client";

import { DishBarChart } from "@/app/manage/dashboard/dish-bar-chart";
import { RevenueLineChart } from "@/app/manage/dashboard/revenue-line-chart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpRight } from "lucide-react";

export default function DashboardMain() {
  const resetDateFilter = () => {};

  const metrics = [
    {
      title: "Tổng doanh thu",
      value: "0",
      icon: "💰",
      trend: "+5.2%",
      color: "from-blue-600 to-blue-400",
    },
    {
      title: "Khách",
      value: "0",
      subtitle: "Gọi món",
      icon: "👥",
      trend: "+12%",
      color: "from-emerald-600 to-emerald-400",
    },
    {
      title: "Đơn hàng",
      value: "0",
      subtitle: "Đã thanh toán",
      icon: "📋",
      trend: "+8.1%",
      color: "from-orange-600 to-orange-400",
    },
    {
      title: "Bàn đang phục vụ",
      value: "0",
      icon: "🪑",
      trend: "+3.5%",
      color: "from-purple-600 to-purple-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Date filter */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-500">
                Từ ngày
              </label>
              <Input type="date" className="w-40" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-500">
                Đến ngày
              </label>
              <Input type="date" className="w-40" />
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={resetDateFilter}
            className="text-slate-500"
          >
            Reset bộ lọc
          </Button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div
              className={`w-10 h-10 rounded-lg bg-gradient-to-br ${m.color} flex items-center justify-center text-white mb-4`}
            >
              <span className="text-lg">{m.icon}</span>
            </div>

            <p className="text-sm text-slate-500">{m.title}</p>

            <div className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
              {m.value}
            </div>

            {m.subtitle && (
              <p className="text-xs text-slate-400 mt-1">{m.subtitle}</p>
            )}

            <div className="mt-4 flex items-center gap-1 text-xs font-medium text-emerald-600">
              <ArrowUpRight className="w-3 h-3" />
              {m.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
            <h3 className="text-sm font-semibold mb-2">
              Doanh thu theo thời gian
            </h3>
            <RevenueLineChart />
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
            <h3 className="text-sm font-semibold mb-2">
              Xếp hạng món ăn
            </h3>
            <DishBarChart />
          </div>
        </div>
      </div>
    </div>
  );
}
