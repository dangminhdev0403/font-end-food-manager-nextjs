"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LuxuryLoadingProps {
  text?: string;
  fullScreen?: boolean;
}

export default function LuxuryLoading({
  text = "Đang xử lý...",
  fullScreen = true,
}: Readonly<LuxuryLoadingProps>) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className={cn(
        "flex items-center justify-center bg-background/95 backdrop-blur-md",
        fullScreen ? "fixed inset-0 z-modal min-h-dvh" : "min-h-[40dvh]",
      )}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative size-16 sm:size-20">
          <div
            className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
            aria-hidden
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 1.6,
              ease: "linear",
            }}
            aria-hidden
            className="size-16 rounded-full border-4 border-primary/30 border-t-primary sm:size-20"
          />
        </div>

        <motion.p
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-xs uppercase tracking-[0.3em] text-primary sm:text-sm"
        >
          {text}
        </motion.p>
      </div>
    </div>
  );
}
