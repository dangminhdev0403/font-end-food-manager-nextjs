"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

type Props = {
  total: number;
  onCheckout: () => void;
};

export default function CheckoutBar({ total, onCheckout }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* nền blur */}
      <div className="bg-[#1a120b]/90 backdrop-blur-md border-t border-[#f08a00]/20 px-4 py-3 shadow-2xl">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {/* LEFT */}
          <div className="flex flex-col">
            <span className="text-xs text-[#f5f1e8]/60 tracking-wide">
              TỔNG CỘNG
            </span>

            <motion.span
              key={total}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-bold text-[#f08a00] tabular-nums"
            >
              {formatCurrency(total)}
            </motion.span>
          </div>

          {/* RIGHT */}
          <Button
            onClick={onCheckout}
            className="bg-[#f08a00] hover:bg-[#ff9d1a] text-black font-semibold px-6 py-2 rounded-xl shadow-lg"
          >
            Thanh toán
          </Button>
        </div>
      </div>
    </div>
  );
}
