"use client";

import { Spinner } from "@/components/ui/spinner";
import { useHandleLogout } from "@/lib/hooks/useHandleLogout";
import { useEffect } from "react";

export default function LogoutPage() {
  const { handleLogout, isLoading } = useHandleLogout();

  useEffect(() => {
    handleLogout();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-500">
      {/* Animated background elements - Dark mode only */}
      <div className="absolute inset-0 overflow-hidden dark:block hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute top-1/3 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
          style={{
            animation: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.5s",
          }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
          style={{
            animation: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite 1s",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8 px-4">
        {/* Spinner with glow effect */}
        <div className="flex items-center justify-center relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl w-32 h-32 dark:block hidden" />
          <div className="relative w-24 h-24">
            <Spinner className="size-24 text-primary dark:text-primary/80" />
          </div>
        </div>

        {/* Text content */}
        <div className="text-center space-y-3 max-w-sm">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Đang đăng xuất...
          </h1>
          <p className="text-base text-muted-foreground font-medium">
            Vui lòng chờ
          </p>
          <p className="text-sm text-muted-foreground/70">
            Đang chuẩn bị thoát khỏi phiên làm việc
          </p>
        </div>

        {/* Animated loading bars */}
        <div className="flex gap-2 justify-center items-end">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-primary rounded-full"
              style={{
                width: "8px",
                height: `${20 + i * 6}px`,
                animation: `loading-bar 0.8s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>

        {/* Progress indicator */}
      </div>

      <style>{`
        @keyframes loading-bar {
          0%, 100% {
            opacity: 0.4;
            transform: scaleY(0.5);
          }
          50% {
            opacity: 1;
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  );
}
