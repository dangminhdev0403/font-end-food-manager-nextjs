"use client";

import menuItems from "@/app/manage/menuItems";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Package2, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks() {
  const pathname = usePathname();
  const isSettingActive = pathname === "/manage/setting";

  return (
    <TooltipProvider delayDuration={150}>
      <aside
        aria-label="Menu quản lý"
        className="fixed inset-y-0 left-0 z-sticky hidden w-14 flex-col border-r border-border bg-background sm:flex"
      >
        <nav className="flex flex-col items-center gap-3 px-2 py-5">
          <Link
            href="/manage/dashboard"
            aria-label="Trang chủ quản lý"
            className="group flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform duration-base ease-out-quart hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:scale-100"
          >
            <Package2 className="size-5 transition-transform duration-base ease-out-quart group-hover:rotate-12 motion-reduce:transition-none motion-reduce:group-hover:rotate-0" />
            <span className="sr-only">Bảng điều khiển</span>
          </Link>

          {menuItems.map((Item) => {
            const isActive = pathname === Item.href;
            return (
              <Tooltip key={Item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={Item.href}
                    aria-label={Item.title}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex size-9 items-center justify-center rounded-md transition-colors duration-base ease-out-quart focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    <Item.Icon className="size-5" />
                    <span className="sr-only">{Item.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{Item.title}</TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        <nav className="mt-auto flex flex-col items-center gap-3 px-2 py-5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/manage/setting"
                aria-label="Cài đặt"
                aria-current={isSettingActive ? "page" : undefined}
                className={cn(
                  "flex size-9 items-center justify-center rounded-md transition-colors duration-base ease-out-quart focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isSettingActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <Settings className="size-5" />
                <span className="sr-only">Cài đặt</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Cài đặt</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
    </TooltipProvider>
  );
}
