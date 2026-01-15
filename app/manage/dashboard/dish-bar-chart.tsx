"use client";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const colors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Phở",
    color: "hsl(210 100% 50%)",
  },
  safari: {
    label: "Bánh Mì",
    color: "hsl(45 100% 50%)",
  },
  firefox: {
    label: "Cơm Tấm",
    color: "hsl(30 100% 50%)",
  },
  edge: {
    label: "Gỏi Cuốn",
    color: "hsl(120 100% 40%)",
  },
  other: {
    label: "Khác",
    color: "hsl(270 100% 50%)",
  },
} satisfies ChartConfig;

const chartData = [
  { name: "Phở", successOrders: 275, fill: "hsl(210 100% 50%)" },
  { name: "Bánh Mì", successOrders: 200, fill: "hsl(45 100% 50%)" },
  { name: "Cơm Tấm", successOrders: 187, fill: "hsl(30 100% 50%)" },
  { name: "Gỏi Cuốn", successOrders: 173, fill: "hsl(120 100% 40%)" },
  { name: "Khác", successOrders: 90, fill: "hsl(270 100% 50%)" },
];

export function DishBarChart() {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Xếp hạng món ăn</CardTitle>
        <CardDescription>
          Được gọi nhiều nhất trong thời gian quy định
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{ left: 100, right: 10, top: 5, bottom: 5 }}
            >
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                width={100}
                tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
              />
              <XAxis dataKey="successOrders" type="number" hide />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar
                dataKey="successOrders"
                name="Đơn thanh toán"
                layout="vertical"
                radius={[0, 8, 8, 0]}
                fill="url(#gradient)"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
