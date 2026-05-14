"use client";

import { Clock } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Clock className="size-5" aria-hidden />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground sm:text-xl">
              Quản lý đơn hàng
            </h1>
            <p className="text-xs text-muted-foreground sm:text-sm">Nhà hàng</p>
          </div>
        </div>
      </div>
    </header>
  );
}
