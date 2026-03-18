"use client";

import LuxuryLoading from "@/components/loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGuestOrderRealtime } from "@/lib/hooks/sockets/use-guest-order-realtime";
import { useSessionStore } from "@/lib/stores/session.store";
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
  const router = useRouter();

  /**
   * 🔥 LẤY TỪ ZUSTAND
   */
  const { orderId } = useSessionStore();

  /**
   * 🔥 REALTIME
   */
  useGuestOrderRealtime(orderId!);

  /**
   * 🔥 QUERY
   */
  const { data, isLoading } = useGuestGetListOrderQuery();

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

  /**
   * 🔥 GUARD
   */
  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a120c] to-[#0f0a07] p-4">
        <div className="text-center space-y-3">
          <AlertCircle size={48} className="mx-auto text-red-400" />
          <p className="text-lg text-[#c9b8a6]">Không tìm thấy đơn hàng</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LuxuryLoading text="Đang tải đơn hàng..." />;
  }

  if (!guestOrders) return null;

  const isCancelled = statusOrder === "CANCELLED";
  const isPaid = statusOrder === "PAID";

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#1a120c] to-[#0f0a07] text-[#f5f1e8] p-3 sm:p-4 md:p-6 lg:p-10">
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#f08a00] mb-1 leading-tight">
              Đơn Hàng Của Bạn
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-[#c9b8a6] truncate">
              {guestOrders.guestName}
            </p>
          </div>
          <Badge
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold whitespace-nowrap flex-shrink-0 ${
              isCancelled
                ? "bg-red-900/40 text-red-400"
                : isPaid
                  ? "bg-green-900/40 text-green-400"
                  : "bg-[#f08a00]/20 text-[#f08a00]"
            }`}
          >
            {STATUS_CONFIG[guestOrders.status].label}
          </Badge>
        </div>

        {/* STATUS TRACKER */}
        <Card className="bg-gradient-to-br from-[#2a1a12] to-[#1f140e] border border-[#f08a00]/20 p-4 sm:p-6 md:p-8">
          {isCancelled ? (
            <div className="flex items-center justify-center gap-2 sm:gap-3 py-6 sm:py-8 text-red-400">
              <AlertCircle size={20} className="flex-shrink-0" />
              <span className="text-base sm:text-lg font-semibold">
                Đơn hàng đã bị hủy
              </span>
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8">
              {/* Progress Bar */}
              <div className="relative">
                <div className="absolute top-5 sm:top-6 left-0 right-0 h-[2px] sm:h-[3px] bg-[#f08a00]/20 rounded-full" />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute top-5 sm:top-6 left-0 h-[2px] sm:h-[3px] bg-[#f08a00] rounded-full"
                />

                {/* Status Steps */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 pt-8 sm:pt-10 md:pt-12">
                  {STATUS_FLOW.map((status, index) => {
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;
                    const Icon = STATUS_CONFIG[status].icon;

                    return (
                      <motion.div
                        key={status}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex flex-col items-center"
                      >
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-semibold transition-all duration-300 flex-shrink-0 ${
                            isCompleted
                              ? "bg-[#f08a00] text-black shadow-lg shadow-[#f08a00]/30"
                              : isCurrent
                                ? "bg-[#f08a00] text-black shadow-lg shadow-[#f08a00]/30"
                                : "bg-[#2a1a12] text-[#c9b8a6]"
                          }`}
                        >
                          {isCompleted ? (
                            <Check
                              size={16}
                              className="sm:w-5 sm:h-5 md:w-6 md:h-6"
                            />
                          ) : (
                            <Icon
                              size={16}
                              className="sm:w-5 sm:h-5 md:w-6 md:h-6"
                            />
                          )}
                        </div>
                        <span className="mt-2 sm:mt-2.5 md:mt-3 text-xs sm:text-xs md:text-sm font-medium text-[#c9b8a6] text-center leading-tight">
                          {STATUS_CONFIG[status].label}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* ORDER ITEMS */}
        <Card className="bg-gradient-to-br from-[#2a1a12] to-[#1f140e] border border-[#f08a00]/20 overflow-hidden">
          <div className="bg-gradient-to-r from-[#f08a00]/10 to-transparent px-4 sm:px-6 py-3 sm:py-4 border-b border-[#f08a00]/20">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#f08a00]">
              Chi Tiết Đơn Hàng
            </h3>
          </div>

          <div className="space-y-2 px-2 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6">
            {guestOrders.items.map((item: OrderGuestItem, idx: number) => {
              const total = item.price * item.quantity;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group flex justify-between items-start sm:items-center gap-3 p-3 sm:p-4 bg-[#1f140e]/60 hover:bg-[#f08a00]/10 border border-transparent hover:border-[#f08a00]/30 rounded-lg transition-all duration-200"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#f5f1e8] text-sm sm:text-base group-hover:text-[#f08a00] transition-colors">
                      {item.name}
                    </p>
                    <p className="text-xs sm:text-sm text-[#c9b8a6] mt-1.5 font-medium">
                      {formatCurrency(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="font-bold text-[#f08a00] text-base sm:text-lg whitespace-nowrap">
                      {formatCurrency(total)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Total */}
          <div className=" relative mt-2 border-t-2 border-[#f08a00]/30 bg-gradient-to-r from-[#f08a00]/25 via-[#f08a00]/10 to-transparent px-4 sm:px-6 py-5 sm:py-6 md:py-8 shadow-lg">
            <div className=" mx-auto flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-4">
              <span className="text-base sm:text-lg md:text-xl font-bold text-[#f5f1e8] tracking-wide">
                TỔNG CỘNG :
              </span>
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#f08a00] tracking-tight drop-shadow-lg mx-auto "
              >
                {formatCurrency(guestOrders.totalPrice)}
              </motion.span>
            </div>
          </div>
        </Card>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-4">
          <Button className="w-full py-4 sm:py-5 md:py-6 text-sm sm:text-base font-semibold bg-[#f08a00] hover:bg-[#e67e00] text-black flex items-center justify-center gap-2 rounded transition-colors flex-shrink-0">
            <Phone size={18} className="flex-shrink-0" />
            <span className="truncate">Liên Hệ Hỗ Trợ</span>
          </Button>

          <Button
            onClick={() => router.back()}
            disabled={isPaid || isCancelled}
            className={`w-full py-4 sm:py-5 md:py-6 text-sm sm:text-base font-semibold flex items-center justify-center gap-2 rounded transition-colors flex-shrink-0 ${
              isPaid || isCancelled
                ? "bg-[#2a1a12] text-[#8a7a6a] cursor-not-allowed border border-[#f08a00]/10"
                : "bg-[#f08a00] hover:bg-[#e67e00] text-black"
            }`}
          >
            <span className="truncate">Gọi Thêm Món</span>
            <ArrowRight size={18} className="flex-shrink-0" />
          </Button>
        </div>
      </div>
    </div>
  );
}
