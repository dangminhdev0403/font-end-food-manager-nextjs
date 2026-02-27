"use client";

import { motion } from "framer-motion";

interface LuxuryLoadingProps {
  text?: string;
  fullScreen?: boolean;
}

export default function LuxuryLoading({
  text = "Đang xử lý...",
  fullScreen = true,
}: LuxuryLoadingProps) {
  return (
    <div
      className={`${
        fullScreen
          ? "fixed inset-0 z-50 flex items-center justify-center"
          : "flex items-center justify-center"
      } bg-[#1a120c]/95 backdrop-blur-md`}
    >
      <div className="flex flex-col items-center gap-8">
        {/* Golden Ring Spinner */}
        <div className="relative w-20 h-20">
          {/* Outer glow */}
          <div className="absolute inset-0 rounded-full bg-[#f08a00]/20 blur-xl" />

          {/* Rotating border */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 1.6,
              ease: "linear",
            }}
            className="w-20 h-20 rounded-full border-4 border-[#f08a00]/30 border-t-[#f08a00]"
          />
        </div>

        {/* Text */}
        <motion.p
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-[#f08a00] tracking-[0.3em] uppercase text-sm font-serif"
        >
          {text}
        </motion.p>
      </div>
    </div>
  );
}
