import { auth } from "@/config/authentication/auth";
import { privatePaths } from "@/lib/utils";
import { NextResponse } from "next/server";


export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const isPrivate = privatePaths.some((p) => pathname.startsWith(p));

  const isAuth = !!req.auth; // ⬅️ thay vì đọc cookie

  if (!isAuth && isPrivate) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuth && pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});
