"use client";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";

type Props = {
  total: number;
  onCheckout: () => void;
};

export default function CheckoutBar({ total, onCheckout }: Readonly<Props>) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-sticky border-t border-border bg-background/90 px-4 py-3 shadow-lg backdrop-blur-md sm:px-6">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            Tổng cộng
          </span>
          <motion.span
            key={total}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg font-bold tabular-nums text-foreground sm:text-xl"
          >
            {formatCurrency(total)}
          </motion.span>
        </div>

        <Button
          onClick={onCheckout}
          className="h-11 px-6 font-semibold"
          aria-label="Thanh toán đơn hàng"
        >
          Thanh toán
        </Button>
      </div>
    </div>
  );
}
