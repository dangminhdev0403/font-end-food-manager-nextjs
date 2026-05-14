"use client";

import dynamic from "next/dynamic";
import DropdownAvatar from "@/app/manage/dropdown-avatar";
import DarkModeToggle from "@/components/dark-mode-toggle";

const MobileNavLinks = dynamic(() => import("./mobile-nav-links"), {
  ssr: false,
});

export default function HeaderClient({ user }: { user: any }) {
  return (
    <header className="sticky top-0 z-sticky flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
      <MobileNavLinks />
      <div className="flex-1" />
      <div className="flex items-center gap-2 sm:gap-3">
        <DarkModeToggle />
        <DropdownAvatar user={user} />
      </div>
    </header>
  );
}
