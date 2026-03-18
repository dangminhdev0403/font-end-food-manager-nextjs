"use client";

import { Clock } from "lucide-react";

export function Header() {
  const currentTime = new Date().toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <header className="border-b ">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-300">
              Quản Lí Đơn Hàng
            </h1>
            <p className="text-xs text-gray-500">Nhà hàng</p>
          </div>
        </div>
      </div>
    </header>
  );
}
