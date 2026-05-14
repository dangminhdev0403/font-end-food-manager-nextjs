"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

export default function DarkModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-10 rounded-full"
          aria-label="Chuyển đổi chế độ giao diện"
        >
          <SunIcon
            aria-hidden
            className="size-5 rotate-0 scale-100 transition-transform duration-base dark:-rotate-90 dark:scale-0"
          />
          <MoonIcon
            aria-hidden
            className="absolute size-5 rotate-90 scale-0 transition-transform duration-base dark:rotate-0 dark:scale-100"
          />
          <span className="sr-only">Chuyển đổi giao diện</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Sáng
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Tối
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          Hệ thống
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
