"use client";
import envConfig from "@/config";
import { privatePaths } from "@/proxy";
import authRequest from "@/services/internal/auth";
import jwt from "jsonwebtoken";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RefreshToken() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const isPrivate = privatePaths.some((p) => pathname.startsWith(p));
    if (!isPrivate) return;

    let interval: any = null;
    const checkAndRefresh = async () => {
      const refreshToken = localStorage.getItem("refreshToken");
      const accessToken = localStorage.getItem("accessToken");
      if (!refreshToken || !accessToken) return;
      const accessTokenDecoded = jwt.decode(accessToken) as {
        exp: number;
        iat: number;
      };
      const refreshTokenDecoded = jwt.decode(refreshToken) as {
        exp: number;
        iat: number;
      };
      const now = Date.now() / 1000 - 1;
      if (refreshTokenDecoded.exp <= now) return;
      if (
        accessTokenDecoded.exp - now <=
        (refreshTokenDecoded.exp - refreshTokenDecoded.iat) / 3
      ) {
        try {
          const res = await authRequest.refreshToken();

          localStorage.setItem("accessToken", res.data.accessToken);
          localStorage.setItem("refreshToken", res.data.refreshToken);
        } catch (err: any) {
          if (err?.status === 401) {
            const params = new URLSearchParams({
              refreshToken: refreshToken ?? "",
            });

            router.push(`/logout?${params.toString()}`);
          }

          clearInterval(interval);
        }
      }
    };
    checkAndRefresh();
    interval = setInterval(
      checkAndRefresh,
      Number.parseInt(envConfig.NEXT_PUBLIC_CHECK_REFRESH_IN_MINISECONDS),
    );
    return () => clearInterval(interval);
  }, [pathname]);
  return <div></div>;
}
