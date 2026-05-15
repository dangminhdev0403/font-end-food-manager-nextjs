"use client";

import LuxuryLoading from "@/components/loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGuestOrderRealtime } from "@/lib/hooks/sockets/use-guest-order-realtime";
import { useSessionStore } from "@/lib/stores/session.store";
import { cn, formatCurrency } from "@/lib/utils";
import { useGuestGetListOrderQuery } from "@/queries/guests/useGuest";
import {
  ListOrderGuestResponse,
  OrderGuestItem,
  OrderStatus,
} from "@/services/internal/customers/guests/guest.types";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChefHat,
  Clock,
  CreditCard,
  Phone,
} from "lucide-react";
import { useRouter } from "next/navigation";

const STATUS_FLOW: OrderStatus[] = ["PENDING", "CONFIRMED", "COOKING", "PAID"];

const STATUS_CONFIG: Record<OrderStatus, { label: string; icon: any }> = {
  PENDING: { label: "Chờ xác nhận", icon: Clock },
  CONFIRMED: { label: "Đã xác nhận", icon: CheckCircle2 },
  COOKING: { label: "Đang nấu", icon: ChefHat },
  PAID: { label: "Đã thanh toán", icon: CreditCard },
  CANCELLED: { label: "Đã huỷ", icon: AlertCircle },
};

export default function MyOrdersPage() {
  const router = useRouter();

  const { orderId } = useSessionStore();

  useGuestOrderRealtime(orderId!);

  const { data, isLoading } = useGuestGetListOrderQuery();

  const guestOrders: ListOrderGuestResponse | undefined = data?.data;

  const statusOrder = guestOrders?.status;

  const currentIndex =
    statusOrder && STATUS_FLOW.includes(statusOrder)
      ? STATUS_FLOW.indexOf(statusOrder)
      : -1;

  let progressPercent = 0;
  if (statusOrder !== "CANCELLED" && currentIndex >= 0) {
    progressPercent = (currentIndex / (STATUS_FLOW.length - 1)) * 100;
  }

  if (!orderId) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background p-4 text-foreground">
        <div className="space-y-3 text-center" role="alert">
          <AlertCircle
            aria-hidden
            className="mx-auto size-12 text-destructive"
          />
          <p className="text-base text-muted-foreground sm:text-lg">
            Không tìm thấy đơn hàng
          </p>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return <LuxuryLoading text="Đang tải đơn hàng..." />;
  }

  if (!guestOrders) return null;

  const isCancelled = statusOrder === "CANCELLED";
  const isPaid = statusOrder === "PAID";

  let badgeVariant: "destructive" | "default" | "secondary" = "secondary";
  if (isCancelled) badgeVariant = "destructive";
  else if (isPaid) badgeVariant = "default";

  return (
    <main className="relative min-h-dvh overflow-hidden bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.12),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(52,211,153,0.08),transparent_38%)]"
      />

      <div className="relative container mx-auto space-y-4 px-4 py-6 sm:space-y-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="relative overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-md sm:p-5 md:flex md:items-center md:justify-between md:gap-4 md:p-6">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/5"
          />

          <div className="relative min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground sm:text-xs">
              Trải nghiệm ẩm thực hiện đại
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              Đơn hàng của bạn
            </h1>
            <p className="mt-1 truncate text-sm text-muted-foreground sm:text-base">
              {guestOrders.guestName}
            </p>
          </div>

          <Badge
            variant={badgeVariant}
            className={cn(
              "relative mt-4 self-start whitespace-nowrap px-3 py-1.5 text-xs shadow-sm sm:mt-0 sm:text-sm",
              isCancelled
                ? "border border-destructive/40 bg-destructive/15 text-destructive"
                : "border border-amber-700/30 bg-amber-500/10 text-amber-100",
            )}
          >
            {STATUS_CONFIG[guestOrders.status].label}
          </Badge>
        </header>

        <Card className="overflow-hidden border-amber-900/30 bg-card/55 shadow-xl backdrop-blur-md">
          <CardContent className="p-4 sm:p-6 md:p-8">
            {isCancelled ? (
              <div
                className="flex items-center justify-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 py-6 text-destructive sm:py-8"
                role="alert"
              >
                <AlertCircle aria-hidden className="size-5 shrink-0" />
                <span className="text-base font-semibold sm:text-lg">
                  Đơn hàng đã bị huỷ
                </span>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative">
                  <div
                    className="absolute left-0 right-0 top-5 h-[2px] rounded-full bg-amber-200/20 sm:top-6 sm:h-[3px]"
                    aria-hidden
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.9, ease: "easeInOut" }}
                    className="absolute left-0 top-5 h-[2px] rounded-full bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 shadow-[0_0_16px_rgba(251,191,36,0.45)] sm:top-6 sm:h-[3px]"
                    aria-hidden
                  />

                  <div className="grid grid-cols-2 gap-3 pt-8 sm:grid-cols-4 sm:gap-4 sm:pt-10 md:pt-12">
                    {STATUS_FLOW.map((status, index) => {
                      const isCompleted = index < currentIndex;
                      const isCurrent = index === currentIndex;
                      const Icon = STATUS_CONFIG[status].icon;
                      const isActive = isCompleted || isCurrent;

                      return (
                        <motion.div
                          key={status}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex flex-col items-center"
                        >
                          <motion.div
                            whileHover={{ y: -2 }}
                            transition={{ duration: 0.2 }}
                            className={cn(
                              "relative flex size-10 shrink-0 items-center justify-center rounded-full border transition-all duration-base sm:size-12 md:size-14",
                              isActive
                                ? "border-amber-400/70 bg-gradient-to-br from-amber-500/90 to-orange-500/90 text-amber-50 shadow-[0_0_18px_rgba(251,191,36,0.45)]"
                                : "border-border bg-background/70 text-muted-foreground",
                            )}
                            aria-current={isCurrent ? "step" : undefined}
                          >
                            {isCurrent && (
                              <span
                                aria-hidden
                                className="absolute inset-0 rounded-full border border-amber-300/50 animate-pulse"
                              />
                            )}
                            {isCompleted ? (
                              <Check
                                aria-hidden
                                className="size-4 sm:size-5 md:size-6"
                              />
                            ) : (
                              <Icon
                                aria-hidden
                                className="size-4 sm:size-5 md:size-6"
                              />
                            )}
                          </motion.div>
                          <span className="mt-2 text-center text-xs font-medium leading-tight text-amber-50/90 sm:mt-3 sm:text-sm">
                            {STATUS_CONFIG[status].label}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-amber-900/30 bg-card/55 shadow-xl backdrop-blur-md">
          <CardHeader className="border-b border-amber-900/30 bg-gradient-to-r from-amber-600/10 via-transparent to-orange-600/10">
            <CardTitle className="text-base sm:text-lg md:text-xl">
              Chi tiết đơn hàng
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 p-4 sm:p-6">
            {guestOrders.items.map((item: OrderGuestItem, idx: number) => {
              const total = item.price * item.quantity;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -2 }}
                  className="group relative flex items-start justify-between gap-3 overflow-hidden rounded-xl border border-amber-900/25 bg-gradient-to-r from-amber-950/20 to-orange-950/10 p-3 transition-all duration-base hover:border-amber-700/40 hover:shadow-md sm:items-center sm:p-4"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-amber-300/70 to-orange-500/70 opacity-60"
                  />

                  <div className="min-w-0 flex-1 pl-1">
                    <p className="text-sm font-semibold text-foreground sm:text-base">
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs font-medium text-amber-100/70 sm:text-sm">
                      {formatCurrency(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <p className="whitespace-nowrap text-base font-bold tabular-nums text-amber-300 sm:text-lg">
                    {formatCurrency(total)}
                  </p>
                </motion.div>
              );
            })}
          </CardContent>

          <div className="border-t border-amber-900/30 bg-gradient-to-r from-amber-950/35 via-transparent to-orange-950/35 px-4 py-5 sm:px-6 sm:py-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
              <span className="text-sm font-bold uppercase tracking-wide text-amber-50/90 sm:text-base">
                Tổng cộng
              </span>
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="text-2xl font-bold tabular-nums tracking-tight text-amber-300 sm:text-3xl md:text-4xl"
              >
                {formatCurrency(guestOrders.totalPrice)}
              </motion.span>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <Button className="h-12 gap-2 border border-amber-700/40 bg-gradient-to-r from-amber-700/80 to-orange-700/80 text-sm font-semibold text-amber-50 shadow-md transition-all duration-base hover:from-amber-600 hover:to-orange-600 hover:shadow-lg sm:text-base">
            <Phone aria-hidden className="size-4 shrink-0 sm:size-5" />
            <span className="truncate">Liên hệ hỗ trợ</span>
          </Button>

          <Button
            onClick={() => router.back()}
            disabled={isPaid || isCancelled}
            variant={isPaid || isCancelled ? "outline" : "default"}
            className={cn(
              "h-12 gap-2 text-sm font-semibold sm:text-base",
              isPaid || isCancelled
                ? "border-amber-700/40 bg-transparent text-amber-100/70"
                : "border border-amber-700/40 bg-card/70 text-amber-100 shadow-sm transition-all duration-base hover:bg-card hover:shadow-md",
            )}
          >
            <span className="truncate">Gọi thêm món</span>
            <ArrowRight aria-hidden className="size-4 shrink-0 sm:size-5" />
          </Button>
        </div>
      </div>
    </main>
  );
}
