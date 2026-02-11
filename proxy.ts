import { NextRequest, NextResponse } from "next/server";

export const privatePaths = ["/manage", "/profile", "/admin", "/logout"];

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

  const refresh = req.cookies.get("refreshToken")?.value;
  const isAuth = Boolean(refresh);

  const isPrivate = privatePaths.some((p) => pathname.startsWith(p));

  // ❌ chưa login mà vào private (hoặc refreshToken đã hết hạn )
  if (!isAuth && isPrivate) {
    const url = new URL("/login", req.url);

    return NextResponse.redirect(url);
  }
  const isLogout = pathname === "/logout";

  // ✅ đã login mà vẫn vào login
  console.log("pathname:", pathname);
  console.log("isPrivate:", isPrivate);
  console.log("isAuth:", isAuth);

  if (!isLogout && isAuth && pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}
