"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSessionStore } from "@/lib/stores/session.store";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCountdown } from "usehooks-ts";

export default function ScanTableExistError() {
  const router = useRouter();

  const [count, { startCountdown }] = useCountdown({
    countStart: 30,
    intervalMs: 1000,
  });
  const { tableId, tableName, hasHydrated } = useSessionStore();

  useEffect(() => {
    if (!hasHydrated) return;
    startCountdown();
  }, [startCountdown, hasHydrated]);

  useEffect(() => {
    if (count === 0) {
      router.replace(`/tables/detail/${tableId}`);
    }
  }, [count, router, tableId]);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-6 text-foreground sm:px-6 sm:py-8">
      <motion.div
        initial={{ opacity: 0, filter: "blur(8px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
        role="alert"
        aria-live="assertive"
      >
        <Card>
          <CardContent className="space-y-4 p-6 text-center sm:p-8">
            <div className="flex justify-center">
              <div className="flex size-16 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10 text-destructive sm:size-20">
                <AlertTriangle aria-hidden className="size-8 sm:size-9" />
              </div>
            </div>

            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Bạn đang được phục vụ tại bàn {tableName}
            </h2>

            <p className="text-sm text-muted-foreground sm:text-base">
              Có vẻ bạn đã quét mã QR của một bàn trước đó. Để tránh nhầm lẫn
              trong quá trình gọi món, vui lòng quay lại bàn bạn đang sử dụng.
            </p>

            <div className="flex justify-center">
              <Button
                onClick={() => router.replace(`/tables/detail/${tableId}`)}
                className="h-11"
              >
                Quay lại bàn {tableName}
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Tự động quay lại sau{" "}
              <span className="font-semibold text-destructive tabular-nums">
                {count}s
              </span>
            </p>

            <div
              className="h-[2px] w-full overflow-hidden rounded-full bg-destructive/20"
              aria-hidden
            >
              <motion.div
                key={count}
                initial={{ width: "100%" }}
                animate={{ width: `${(count / 30) * 100}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-destructive"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
