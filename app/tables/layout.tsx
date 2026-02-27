import { auth } from "@/config/authentication/auth";
import type React from "react";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div>
      {/* Main content area */}

      {/* Page content */}
      <main className="flex-1 ">{children}</main>
    </div>
  );
}
