"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn, formatCurrency } from "@/lib/utils";
import { Clock3, CookingPot, ReceiptText, Table2, UserRound } from "lucide-react";
import { useMemo, useState } from "react";

type OrderStatus = "PENDING" | "CONFIRMED" | "COOKING" | "PAID" | "CANCELLED";

type OrderItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
};

type UserOrder = {
  id: number;
  customerName: string;
  table: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
};

const hardOrders: UserOrder[] = [
  {
    id: 1201,
    customerName: "Nguyễn Minh Anh",
    table: "Bàn A01",
    items: [
      { id: 1, name: "Bò lúc lắc", quantity: 1, price: 185000 },
      { id: 2, name: "Salad cá ngừ", quantity: 1, price: 89000 },
      { id: 3, name: "Nước ép cam", quantity: 2, price: 35000 },
    ],
    total: 344000,
    status: "COOKING",
    createdAt: "2026-05-15 11:40",
  },
  {
    id: 1202,
    customerName: "Trần Gia Huy",
    table: "Bàn B04",
    items: [
      { id: 4, name: "Mì Ý sốt bò bằm", quantity: 2, price: 129000 },
      { id: 5, name: "Trà đào", quantity: 2, price: 39000 },
    ],
    total: 336000,
    status: "PENDING",
    createdAt: "2026-05-15 11:53",
  },
  {
    id: 1203,
    customerName: "Lê Thanh Vân",
    table: "Bàn C02",
    items: [
      { id: 6, name: "Lẩu thái hải sản", quantity: 1, price: 299000 },
      { id: 7, name: "Cơm chiên hải sản", quantity: 1, price: 119000 },
      { id: 8, name: "Pepsi", quantity: 3, price: 22000 },
    ],
    total: 484000,
    status: "CONFIRMED",
    createdAt: "2026-05-15 12:06",
  },
  {
    id: 1204,
    customerName: "Phạm Quốc Thái",
    table: "Bàn D07",
    items: [
      { id: 9, name: "Cá hồi áp chảo", quantity: 1, price: 245000 },
      { id: 10, name: "Súp nấm", quantity: 1, price: 69000 },
    ],
    total: 314000,
    status: "PAID",
    createdAt: "2026-05-15 10:58",
  },
];

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  PENDING: {
    label: "Chờ xử lý",
    className: "border-yellow-500/30 bg-yellow-500/15 text-yellow-700 dark:text-yellow-300",
  },
  CONFIRMED: {
    label: "Đang phục vụ",
    className: "border-indigo-500/30 bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
  },
  COOKING: {
    label: "Đang nấu",
    className: "border-orange-500/30 bg-orange-500/15 text-orange-700 dark:text-orange-300",
  },
  PAID: {
    label: "Đã thanh toán",
    className: "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  },
  CANCELLED: {
    label: "Đã huỷ",
    className: "border-red-500/30 bg-red-500/15 text-red-700 dark:text-red-300",
  },
};

export default function UserOrdersPage() {
  const [selectedId, setSelectedId] = useState<number>(hardOrders[0]?.id ?? 0);

  const selectedOrder = useMemo(
    () => hardOrders.find((order) => order.id === selectedId) ?? hardOrders[0],
    [selectedId],
  );

  const stats = useMemo(() => {
    const totalOrders = hardOrders.length;
    const totalRevenue = hardOrders.reduce((sum, order) => sum + order.total, 0);
    const cookingOrders = hardOrders.filter((o) => o.status === "COOKING").length;
    const pendingOrders = hardOrders.filter((o) => o.status === "PENDING").length;

    return { totalOrders, totalRevenue, cookingOrders, pendingOrders };
  }, []);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <main className="container mx-auto space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-border/80 bg-card/70 p-5 backdrop-blur sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <ReceiptText className="size-3.5" />
                Order Management (Hard Data)
              </p>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Danh sách đơn hàng người dùng</h1>
              <p className="text-sm text-muted-foreground sm:text-base">Theo dõi trạng thái đơn, tổng tiền và chi tiết món theo từng bàn.</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <SummaryCard title="Tổng đơn" value={stats.totalOrders.toString()} icon={ReceiptText} />
          <SummaryCard title="Đang nấu" value={stats.cookingOrders.toString()} icon={CookingPot} />
          <SummaryCard title="Chờ xử lý" value={stats.pendingOrders.toString()} icon={Clock3} />
          <SummaryCard title="Tổng giá trị" value={formatCurrency(stats.totalRevenue)} icon={Table2} />
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <Card className="xl:col-span-8">
            <CardHeader>
              <CardTitle className="text-lg">Danh sách đơn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {hardOrders.map((order) => (
                <button
                  key={order.id}
                  type="button"
                  onClick={() => setSelectedId(order.id)}
                  className={cn(
                    "w-full rounded-xl border border-border/80 bg-background/40 p-4 text-left transition hover:border-primary/40 hover:bg-primary/5",
                    selectedOrder?.id === order.id && "border-primary/55 bg-primary/10",
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-bold sm:text-base">#{order.id} • {order.customerName}</p>
                      <p className="text-xs text-muted-foreground sm:text-sm">{order.table} • {order.createdAt}</p>
                    </div>
                    <Badge variant="outline" className={cn("h-7 px-2.5 text-xs", statusConfig[order.status].className)}>
                      {statusConfig[order.status].label}
                    </Badge>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex items-center justify-between text-sm">
                    <p className="text-muted-foreground">{order.items.length} món</p>
                    <p className="font-semibold tabular-nums">{formatCurrency(order.total)}</p>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="xl:col-span-4">
            <CardHeader>
              <CardTitle className="text-lg">Chi tiết đơn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedOrder && (
                <>
                  <div className="space-y-1 rounded-lg bg-muted/50 p-3">
                    <p className="text-sm font-semibold">#{selectedOrder.id} • {selectedOrder.table}</p>
                    <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <UserRound className="size-4" />
                      {selectedOrder.customerName}
                    </p>
                    <p className="text-xs text-muted-foreground">{selectedOrder.createdAt}</p>
                  </div>

                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-start justify-between gap-3 rounded-md border border-border/70 bg-background/60 px-3 py-2.5">
                        <p className="text-sm font-medium">{item.quantity}x {item.name}</p>
                        <p className="text-sm font-semibold tabular-nums">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  <Separator />
                  <div className="flex items-center justify-between rounded-lg bg-primary/10 px-4 py-3">
                    <p className="text-sm font-semibold uppercase tracking-wide">Tổng cộng</p>
                    <p className="text-xl font-bold tabular-nums text-primary">{formatCurrency(selectedOrder.total)}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

type SummaryCardProps = {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
};

function SummaryCard({ title, value, icon: Icon }: Readonly<SummaryCardProps>) {
  return (
    <Card className="border-border/80 bg-card/80">
      <CardContent className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground sm:text-sm">{title}</p>
          <p className="mt-1 truncate text-lg font-bold tabular-nums sm:text-xl">{value}</p>
        </div>
        <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="size-4.5" />
        </div>
      </CardContent>
    </Card>
  );
}
