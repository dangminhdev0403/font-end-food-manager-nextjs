"use client";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
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

const chartConfig = {
  revenue: {
    label: "Doanh thu",
    color: "hsl(210 100% 50%)",
  },
  target: {
    label: "Mục tiêu",
    color: "hsl(120 100% 40%)",
  },
} satisfies ChartConfig;

const chartData = [
  {
    date: "01/01",
    revenue: 2400,
    target: 2400,
  },
  {
    date: "02/01",
    revenue: 1398,
    target: 2210,
  },
  {
    date: "03/01",
    revenue: 9800,
    target: 2290,
  },
  {
    date: "04/01",
    revenue: 3908,
    target: 2000,
  },
  {
    date: "05/01",
    revenue: 4800,
    target: 2181,
  },
  {
    date: "06/01",
    revenue: 3800,
    target: 2500,
  },
  {
    date: "07/01",
    revenue: 4300,
    target: 2100,
  },
];

export function RevenueLineChart() {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Doanh thu theo thời gian
        </CardTitle>
        <CardDescription>Biểu đồ doanh thu 7 ngày gần nhất</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: "12px" }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(210 100% 50%)"
                strokeWidth={2}
                dot={{ fill: "hsl(210 100% 50%)", r: 4 }}
                activeDot={{ r: 6 }}
                name="Doanh thu"
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="hsl(120 100% 40%)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "hsl(120 100% 40%)", r: 4 }}
                activeDot={{ r: 6 }}
                name="Mục tiêu"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
