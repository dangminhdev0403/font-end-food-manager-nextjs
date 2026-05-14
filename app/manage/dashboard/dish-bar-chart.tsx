"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  successOrders: { label: "Đơn thanh toán" },
  pho: { label: "Phở", color: "var(--chart-1)" },
  banhMi: { label: "Bánh Mì", color: "var(--chart-2)" },
  comTam: { label: "Cơm Tấm", color: "var(--chart-3)" },
  goiCuon: { label: "Gỏi Cuốn", color: "var(--chart-4)" },
  other: { label: "Khác", color: "var(--chart-5)" },
} satisfies ChartConfig;

const chartData = [
  { name: "Phở", successOrders: 275, fill: "var(--color-pho)" },
  { name: "Bánh Mì", successOrders: 200, fill: "var(--color-banhMi)" },
  { name: "Cơm Tấm", successOrders: 187, fill: "var(--color-comTam)" },
  { name: "Gỏi Cuốn", successOrders: 173, fill: "var(--color-goiCuon)" },
  { name: "Khác", successOrders: 90, fill: "var(--color-other)" },
];

export function DishBarChart() {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          accessibilityLayer
          data={chartData}
          layout="vertical"
          margin={{ left: 12, right: 12, top: 8, bottom: 4 }}
        >
          <YAxis
            dataKey="name"
            type="category"
            tickLine={false}
            tickMargin={8}
            axisLine={false}
            width={88}
            tick={{ fontSize: 12, fill: "var(--color-foreground)" }}
          />
          <XAxis dataKey="successOrders" type="number" hide />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Bar
            dataKey="successOrders"
            name="Đơn thanh toán"
            layout="vertical"
            radius={[0, 6, 6, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
