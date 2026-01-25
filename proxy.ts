import { NextRequest, NextResponse } from "next/server";

const privatePaths = ["/manage", "/profile", "/admin"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // bỏ qua asset & api
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }
  const refresh = req.cookies.get("refreshToken");

  const isAuth = Boolean(refresh?.value);
  const isPrivate = privatePaths.some((p) => pathname.startsWith(p));

  // ❌ chưa login mà vào private
  if (!isAuth && isPrivate) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ✅ đã login mà vẫn vào login
  if (isAuth && pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}
