"use client";

import menuItems from "@/app/manage/menuItems";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { PanelLeft, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function MobileNavLinks() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (!mounted) return null;

  const isSettingActive = pathname === "/manage/setting";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="size-10 shrink-0 sm:hidden"
          aria-label="Mở menu quản lý"
        >
          <PanelLeft className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-3/4 max-w-xs sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Menu quản lý</SheetTitle>
        </SheetHeader>
        <nav
          aria-label="Menu quản lý (mobile)"
          className="mt-2 grid gap-1 p-4 text-sm font-medium"
        >
          {menuItems.map((Item) => {
            const isActive = pathname === Item.href;
            return (
              <Link
                key={Item.href}
                href={Item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex min-h-10 items-center gap-3 rounded-md px-3 py-2 transition-colors duration-base ease-out-quart focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <Item.Icon className="size-5" />
                <span>{Item.title}</span>
              </Link>
            );
          })}

          <Link
            href="/manage/setting"
            aria-current={isSettingActive ? "page" : undefined}
            className={cn(
              "mt-2 flex min-h-10 items-center gap-3 rounded-md px-3 py-2 transition-colors duration-base ease-out-quart focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isSettingActive
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <Settings className="size-5" />
            <span>Cài đặt</span>
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
