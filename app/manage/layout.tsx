import DropdownAvatar from "@/app/manage/dropdown-avatar";
import MobileNavLinks from "@/app/manage/mobile-nav-links";
import NavLinks from "@/app/manage/nav-links";
import DarkModeToggle from "@/components/dark-mode-toggle";
import { auth } from "@/config/authentication/auth";
import type { Session } from "next-auth";

import type React from "react";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user) return null;
  return (
    <div
      className="flex min-h-screen w-full flex-col bg-linear-to-r
    
    dark:from-slate-950/90 dark:via-slate-900/80 dark:to-slate-950/90

    backdrop-blur-md"
    >
      {/* Main content area */}
      <div className="flex flex-col sm:gap-4  sm:pl-14">
        <header className=" sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border  backdrop-blur-sm  sm:static sm:h-auto sm:border-0  sm:backdrop-blur-none sm:px-6">
          <MobileNavLinks />
          <NavLinks />

          {/* Spacer */}
          <div className="ml-auto flex items-center gap-4 ">
            <DarkModeToggle />
            <DropdownAvatar user={session.user} />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 ">{children}</main>
      </div>
    </div>
  );
}
