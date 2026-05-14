"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function AuthUser() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div
        className="h-10 w-28 animate-pulse rounded-md bg-muted"
        aria-hidden
      />
    );
  }

  if (status === "unauthenticated") {
    return (
      <Button asChild className="h-10 px-5">
        <Link href="/login">Đăng nhập</Link>
      </Button>
    );
  }

  const user = session?.user;
  const initials = user?.name?.slice(0, 2).toUpperCase() ?? "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-10 items-center gap-3 px-2 sm:px-3"
          aria-label="Tài khoản của tôi"
        >
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden flex-col text-left sm:flex">
            <span className="text-sm font-medium leading-none text-foreground">
              {user?.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {user?.email}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-foreground">
              {user?.name}
            </span>
            <span className="text-xs text-muted-foreground">{user?.email}</span>
            <Badge variant="secondary" className="mt-1 w-fit text-xs">
              Role Name
            </Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">Hồ sơ</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/orders">Đơn hàng</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/manage/setting">Cài đặt</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut()}
          className="text-destructive focus:text-destructive"
        >
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
