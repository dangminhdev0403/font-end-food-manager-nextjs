"use client";

import dynamic from "next/dynamic";
import NavLinks from "@/app/manage/nav-links";
import DarkModeToggle from "@/components/dark-mode-toggle";
import DropdownAvatar from "@/app/manage/dropdown-avatar";

const MobileNavLinks = dynamic(() => import("./mobile-nav-links"), {
  ssr: false,
});

export default function HeaderClient({ user }: { user: any }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border backdrop-blur-sm sm:static sm:h-auto sm:border-0 sm:backdrop-blur-none sm:px-6">
      <MobileNavLinks />
      <NavLinks />

      <div className="ml-auto flex items-center gap-4">
        <DarkModeToggle />
        <DropdownAvatar user={user} />
      </div>
    </header>
  );
}
