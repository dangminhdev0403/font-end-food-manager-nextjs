import DropdownAvatar from "@/app/manage/dropdown-avatar";
import NavLinks from "@/app/manage/nav-links";
import DarkModeToggle from "@/components/dark-mode-toggle";
import AdminRealtimeListener from "@/components/listener/admin-realtime-listener";
import { auth } from "@/config/authentication/auth";
import type React from "react";
import MobileNavLinks from "./mobile-nav-links";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user) return null;

  return (
    <div className="flex min-h-dvh w-full flex-col bg-background text-foreground">
      <NavLinks />

      <div className="flex flex-1 flex-col sm:pl-14">
        <header className="sticky top-0 z-sticky flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
          <MobileNavLinks />
          <div className="flex-1" />
          <div className="flex items-center gap-2 sm:gap-3">
            <DarkModeToggle />
            <DropdownAvatar user={session.user} />
          </div>
        </header>

        <AdminRealtimeListener />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
