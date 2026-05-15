import NavItems from "@/app/(public)/nav-items";
import DarkModeToggle from "@/components/dark-mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import envConfig from "@/config/env.config";
import { Menu, Package2 } from "lucide-react";
import Link from "next/link";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-dvh w-full flex-col bg-background text-foreground">
      <header className="sticky top-0 z-sticky flex h-14 items-center gap-3 border-b border-border bg-background/95 px-4 shadow-sm sm:h-16 sm:px-6 lg:px-8">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="size-10 shrink-0 md:hidden"
              aria-label="Mở menu điều hướng"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-3/4 max-w-xs sm:max-w-sm">
            <SheetHeader>
              <SheetTitle>{envConfig.NEXT_PUBLIC_NAME_RESTARANT}</SheetTitle>
            </SheetHeader>
            <nav
              aria-label="Menu chính (mobile)"
              className="mt-2 grid gap-2 p-4 text-base font-medium"
            >
              <NavItems className="block min-h-10 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" />
            </nav>
          </SheetContent>
        </Sheet>

        <Link
          href="/"
          className="flex items-center gap-2 text-base font-semibold text-foreground"
          aria-label="Trang chủ"
        >
          <Package2 className="size-5" />
          <span className="hidden sm:inline">
            {envConfig.NEXT_PUBLIC_NAME_RESTARANT}
          </span>
        </Link>

        <nav
          aria-label="Menu chính"
          className="ml-6 hidden flex-1 items-center gap-5 text-sm font-medium md:flex lg:gap-6"
        >
          <NavItems className="text-muted-foreground transition-colors hover:text-foreground" />
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <DarkModeToggle />
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 md:gap-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
