"use client";

import { LOCAL_STORAGE_KEY } from "@/constants/keys/localStorage.key";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCountdown, useReadLocalStorage } from "usehooks-ts";

export default function ScanTableExistError() {
  const router = useRouter();

  const [count, { startCountdown }] = useCountdown({
    countStart: 30,
    intervalMs: 1000,
  });
  const tableName = useReadLocalStorage<number | null>(
    LOCAL_STORAGE_KEY.TABLE_NAME,
  );
  const tableId = useReadLocalStorage<number | null>(
    LOCAL_STORAGE_KEY.TABLE_ID,
  );
  useEffect(() => {
    startCountdown();
  }, [startCountdown]);

  useEffect(() => {
    if (count === 0) {
      router.replace(`/tables/detail/${tableId}`);
    }
  }, [count, router, tableId]);
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
          Bạn đang được phục vụ tại bàn {tableName}
        </h2>

        <p className="text-[#c9b8a6] mb-6">
          Có vẻ bạn đã quét mã QR của một bàn trước đó. Để tránh nhầm lẫn trong
          quá trình gọi món, vui lòng quay lại bàn bạn đang sử dụng.
        </p>

        <button
          onClick={() => router.replace(`/tables/detail/${tableId}`)}
          className="px-6 py-2 rounded-lg bg-[#f08a00] text-black font-semibold hover:opacity-90 transition"
        >
          Quay lại bàn {tableName}
        </button>

        <p className="text-sm text-[#c9b8a6] mt-4">
          Tự động quay lại sau{" "}
          <span className="text-[#f08a00] font-semibold">{count}s</span>
        </p>

        <div className="mt-4 h-[2px] w-full bg-[#f08a00]/20 overflow-hidden rounded">
          <motion.div
            key={count}
            initial={{ width: "100%" }}
            animate={{ width: `${(count / 5) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-[#f08a00]"
          />
        </div>
      </motion.div>
    </div>
  );
}
