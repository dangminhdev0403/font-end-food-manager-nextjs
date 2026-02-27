"use client";

import { motion } from "framer-motion";

import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCountdown } from "usehooks-ts";

export default function ScanTableError() {
  const router = useRouter();
  const [count, { startCountdown }] = useCountdown({
    countStart: 5,
    intervalMs: 1000,
  });
  useEffect(() => {
    startCountdown();
  }, [startCountdown]);
  useEffect(() => {
    if (count === 0) {
      router.replace("/tables");
    }
  }, [count, router]);
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#1a120c] overflow-hidden">
      <motion.div
        initial={{ opacity: 0, filter: "blur(8px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full text-center px-6"
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center bg-[#f08a00]/10 border border-[#f08a00]/30">
            <AlertTriangle size={36} className="text-[#f08a00]" />
          </div>
        </div>

        <h2 className="text-3xl font-serif text-[#f08a00] mb-4">
          Bàn đã được sử dụng
        </h2>

        <p className="text-[#c9b8a6] mb-6">
          Bàn này hiện đang được sử dụng hoặc đã được đặt trước. Vui lòng chọn
          bàn khác.
        </p>

        <p className="text-sm text-[#c9b8a6]">
          Tự động chuyển về trang chọn bàn sau{" "}
          <span className="text-[#f08a00] font-semibold">{count}s</span>
        </p>

        <div className="mt-4 h-[2px] w-full bg-[#f08a00]/20 overflow-hidden rounded">
          <motion.div
            key={count}
            initial={{ width: "100%" }}
            animate={{ width: `${(count / 3) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-[#f08a00]"
          />
        </div>
      </motion.div>
    </div>
  );
}
