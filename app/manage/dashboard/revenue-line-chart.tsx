"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  revenue: {
    label: "Doanh thu",
    color: "var(--chart-1)",
  },
  target: {
    label: "Mục tiêu",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const chartData = [
  { date: "01/01", revenue: 2400, target: 2400 },
  { date: "02/01", revenue: 1398, target: 2210 },
  { date: "03/01", revenue: 9800, target: 2290 },
  { date: "04/01", revenue: 3908, target: 2000 },
  { date: "05/01", revenue: 4800, target: 2181 },
  { date: "06/01", revenue: 3800, target: 2500 },
  { date: "07/01", revenue: 4300, target: 2100 },
];

export function RevenueLineChart() {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 8, right: 12, left: -8, bottom: 4 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-border)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            stroke="var(--color-muted-foreground)"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke="var(--color-muted-foreground)"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend wrapperStyle={{ paddingTop: 16, fontSize: 12 }} />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="var(--color-revenue)"
            strokeWidth={2}
            dot={{ fill: "var(--color-revenue)", r: 3 }}
            activeDot={{ r: 5 }}
            name="Doanh thu"
          />
          <Line
            type="monotone"
            dataKey="target"
            stroke="var(--color-target)"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: "var(--color-target)", r: 3 }}
            activeDot={{ r: 5 }}
            name="Mục tiêu"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
