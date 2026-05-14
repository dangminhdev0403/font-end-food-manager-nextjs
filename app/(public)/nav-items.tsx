"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const menuItems = [
  { title: "Trang chủ", href: "/" },
  { title: "Món ăn", href: "/menu" },
  { title: "Đơn hàng", href: "/orders" },
  { title: "Quản lý", href: "/manage/dashboard", authRequired: true },
  { title: "Đăng nhập", href: "/login", authRequired: false },
];

export default function NavItems({ className }: { className?: string }) {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const { data } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    setIsAuth(Boolean(data?.user));
  }, [data?.user]);

  return menuItems.map((item) => {
    if (
      (item.authRequired === false && isAuth) ||
      (item.authRequired === true && !isAuth)
    )
      return null;

    const isActive =
      item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);

    return (
      <Link
        href={item.href}
        key={item.href}
        aria-current={isActive ? "page" : undefined}
        className={className}
      >
        {item.title}
      </Link>
    );
  });
}
