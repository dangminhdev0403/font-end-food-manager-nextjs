"use client";

import { getAccessTokenFromLocalStorage } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

const menuItems = [
  {
    title: "Trang chủ",
    href: "/home",
  },
  {
    title: "Món ăn",
    href: "/menu",
  },
  {
    title: "Đơn hàng",
    href: "/orders",
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    authRequired: true,
  },
  {
    title: "Đăng nhập",
    href: "/login",
    authRequired: false,
  },
];

export default function NavItems({ className }: { className?: string }) {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  useEffect(() => {
    setIsAuth(Boolean(getAccessTokenFromLocalStorage()));
  }, [isAuth]);

  return menuItems.map((item) => {
    if (
      (item.authRequired === false && isAuth) ||
      (item.authRequired === true && !isAuth)
    )
      return null;
    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    );
  });
}
