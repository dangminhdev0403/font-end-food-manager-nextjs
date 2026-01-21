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

  return (
    <TooltipProvider>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 py-5">
          <Link
            href="#"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-br from-primary to-primary/80 text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-transform duration-300 hover:scale-110 md:h-9 md:w-9 md:text-base"
          >
            <Package2 className="h-5 w-5 transition-transform group-hover:rotate-12" />
            <span className="sr-only">Acme Inc</span>
          </Link>

          {menuItems.map((Item, index) => {
            const isActive = pathname === Item.href;
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    href={Item.href}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300 hover:scale-105 md:h-9 md:w-9",
                      {
                        "bg-primary text-primary-foreground shadow-md shadow-primary/20":
                          isActive,
                        "text-muted-foreground hover:bg-accent hover:text-foreground":
                          !isActive,
                      }
                    )}
                  >
                    <Item.Icon className="h-5 w-5" />
                    <span className="sr-only">{Item.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{Item.title}</TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/manage/setting"
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300 hover:scale-105 md:h-9 md:w-9",
                  {
                    "bg-primary text-primary-foreground shadow-md shadow-primary/20":
                      pathname === "/manage/setting",
                    "text-muted-foreground hover:bg-accent hover:text-foreground":
                      pathname !== "/manage/setting",
                  }
                )}
              >
                <Settings className="h-5 w-5 transition-transform group-hover:rotate-90" />
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
