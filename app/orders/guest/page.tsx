"use client";

import LuxuryLoading from "@/components/loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
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
  CANCELLED: { label: "Đã hủy", icon: AlertCircle },
};

export default function MyOrdersPage() {
  const { data, isLoading } = useGuestGetListOrderQuery();
  const router = useRouter();

  const guestOrders: ListOrderGuestResponse | undefined = data?.data;

  const statusOrder = guestOrders?.status;

  const currentIndex =
    statusOrder && STATUS_FLOW.includes(statusOrder)
      ? STATUS_FLOW.indexOf(statusOrder)
      : -1;

  const progressPercent =
    statusOrder === "CANCELLED"
      ? 0
      : currentIndex >= 0
        ? (currentIndex / (STATUS_FLOW.length - 1)) * 100
        : 0;

  if (isLoading) return <LuxuryLoading text="Đang chuẩn tạo đơn ..." />;

  if (!guestOrders) return null;

  return (
    <div className="relative min-h-screen bg-[#1a120c] text-[#f5f1e8] p-4 sm:p-6 lg:p-10">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* STATUS CARD */}
        <Card className="bg-gradient-to-br from-[#2a1a12] to-[#1f140e] border border-[#f08a00]/20 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <h1 className="text-4xl font-serif font-bold text-[#f08a00]">
              Đơn Hàng Của Bạn
            </h1>

            <Badge
              className={
                guestOrders.status === "CANCELLED"
                  ? "bg-red-900/40 text-red-400 border border-red-500/40"
                  : "bg-[#f08a00]/20 text-[#f08a00]"
              }
            >
              {STATUS_CONFIG[guestOrders.status].label}
            </Badge>
          </div>

          {/* CANCELLED */}
          {statusOrder === "CANCELLED" ? (
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle size={18} />
              <span>Đơn hàng đã bị hủy</span>
            </div>
          ) : (
            <div className="relative mt-10">
              <div className="absolute top-5 left-0 right-0 h-[3px] bg-[#f08a00]/20 rounded-full" />

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8 }}
                className="absolute top-5 left-0 h-[3px] bg-gradient-to-r from-[#c76b00] via-[#f08a00] to-[#ff9d2f]"
              />

              <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-4">
                {STATUS_FLOW.map((status, index) => {
                  const isCompleted = index < currentIndex;
                  const isCurrent = index === currentIndex;
                  const Icon = STATUS_CONFIG[status].icon;

                  return (
                    <div
                      key={status}
                      className="flex flex-col items-center pt-10"
                    >
                      <motion.div
                        animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                        transition={{
                          repeat: isCurrent ? Infinity : 0,
                          duration: 1.8,
                        }}
                        className={`w-12 h-12 rounded-full flex items-center justify-center border
                        ${
                          isCompleted || isCurrent
                            ? "bg-[#f08a00] border-[#f08a00]"
                            : "bg-[#2a1a12] border-[#f08a00]/30"
                        }`}
                      >
                        {isCompleted ? (
                          <Check size={18} className="text-black" />
                        ) : (
                          <Icon
                            size={18}
                            className={
                              isCurrent ? "text-black" : "text-[#c9b8a6]"
                            }
                          />
                        )}
                      </motion.div>

                      <span
                        className={`mt-2 text-sm text-center
                        ${
                          isCurrent || isCompleted
                            ? "text-[#f08a00] font-semibold"
                            : "text-[#c9b8a6]"
                        }`}
                      >
                        {STATUS_CONFIG[status].label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Card>

        {/* ORDER ITEMS */}
        <Card className="bg-gradient-to-br from-[#2a1a12] to-[#1f140e] border border-[#f08a00]/20 p-6 sm:p-8">
          <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#f08a00] to-[#ffd27a] bg-clip-text text-transparent">
            Chi Tiết Món
          </h3>

          <div className="space-y-4">
            {guestOrders.items.map((item: OrderGuestItem) => {
              const itemTotal = item.price * item.quantity;

              return (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-4
                  bg-gradient-to-r from-[#2a1a12]/70 to-[#1f140e]/70
                  border border-[#f08a00]/10 rounded-xl"
                >
                  <div>
                    <p className="font-semibold text-lg text-[#f7d1a9]">
                      {item.name}
                    </p>

                    <div className="flex items-center gap-3 text-sm text-[#e4a664] mt-1">
                      <span>{formatCurrency(item.price)}</span>
                      <span className="text-[#f08a00] font-bold">
                        × {item.quantity}
                      </span>
                    </div>
                  </div>

                  <p className="text-xl font-bold text-[#f08a00]">
                    {formatCurrency(itemTotal)}
                  </p>
                </div>
              );
            })}
          </div>

          {/* TOTAL */}
          <div className="border-t border-[#f08a00]/20 mt-6 pt-6 flex justify-between text-xl font-bold">
            <span className="text-[#f08a00]">Tổng Cộng</span>
            <span className="text-[#f08a00]">
              {formatCurrency(guestOrders.totalPrice)}
            </span>
          </div>
        </Card>

        {/* ACTION */}
        <div className="flex gap-4">
          <Button
            variant="secondary"
            className="flex items-center gap-2 flex-1"
          >
            <Phone size={18} />
            Liên Hệ Hỗ Trợ
          </Button>

          <Button
            variant="food"
            className="flex items-center gap-2 flex-1"
            onClick={() => {
              router.back();
            }}
          >
            Gọi Thêm Món
            <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
