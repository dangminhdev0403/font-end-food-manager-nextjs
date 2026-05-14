"use client";

import { Button } from "@/components/ui/button";
import { MoonIcon } from "@radix-ui/react-icons";

export default function DarkModeToggle() {
  return (
    <Button
      variant="outline"
      size="icon"
      className="size-10 rounded-full"
      aria-label="Dark mode đang bật"
      disabled
    >
      <MoonIcon aria-hidden className="size-5" />
      <span className="sr-only">Dark mode đang bật</span>
    </Button>
  );
}
