import type React from "react";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <main className="flex-1">{children}</main>
    </div>
  );
}
