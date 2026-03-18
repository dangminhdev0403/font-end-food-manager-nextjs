"use client";

import clsx from "clsx";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function AuthUser() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // click outside + ESC
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  // loading
  if (status === "loading") {
    return <div className="w-28 h-10 bg-muted animate-pulse rounded-xl" />;
  }

  // chưa login
  if (status === "unauthenticated") {
    return (
      <Link
        href="/login"
        className="px-5 py-2 rounded-xl bg-foreground text-background hover:opacity-90 transition font-medium "
      >
        Đăng nhập
      </Link>
    );
  }

  const user = session?.user;

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-3 group"
      >
        {/* Avatar */}
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border bg-amber-500 flex items-center justify-center text-white font-semibold">
          {
            //               user?.image ? (
            //     <Image
            //       src={user.image}
            //       alt="avatar"
            //       fill
            //       className="object-cover"
            //     />
            //   ) :
            user?.name?.charAt(0) || "U"
          }
        </div>

        {/* Name */}
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-sm font-medium text-foreground leading-none">
            {user?.name}
          </span>
          <span className="text-xs text-muted-foreground">{user?.email}</span>
        </div>
      </button>

      {/* Dropdown */}
      <div
        className={clsx(
          "absolute right-0 mt-3 w-56 origin-top-right rounded-2xl border border-border bg-background shadow-xl transition-all duration-200",
          open
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none",
        )}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm font-semibold text-foreground">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>

          {/* Role */}
          {/* {"role" in user && (
            <span className="inline-block mt-2 text-[10px] px-2 py-1 rounded bg-amber-500/20 text-amber-400">
              {String((user as any).role).toUpperCase()}
            </span>
          )} */}
          <span className="inline-block mt-2 text-[10px] px-2 py-1 rounded bg-amber-500/20 text-amber-400">
            {/* {String((user as any).role).toUpperCase()} */} Role Name
          </span>
        </div>

        {/* Menu */}
        <div className="py-2">
          <MenuItem href="/profile" onClick={() => setOpen(false)}>
            Hồ sơ
          </MenuItem>

          <MenuItem href="/orders" onClick={() => setOpen(false)}>
            Đơn hàng
          </MenuItem>

          <MenuItem href="/settings" onClick={() => setOpen(false)}>
            Cài đặt
          </MenuItem>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Logout */}
        <button
          onClick={() => signOut()}
          className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition rounded-b-2xl"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}

// reusable item
function MenuItem({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-2 text-sm hover:bg-muted transition"
    >
      {children}
    </Link>
  );
}
