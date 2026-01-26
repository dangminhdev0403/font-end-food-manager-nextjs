"use client";
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
    if (!isPrivate) {
      router.replace("/login");
      return;
    }
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
      const now = Math.round(Date.now() / 1000);
      if (refreshTokenDecoded.exp <= now) return;
      if (
        accessTokenDecoded.exp - now <=
        (refreshTokenDecoded.exp - refreshTokenDecoded.iat) / 3
      ) {
        try {
          const res = await authRequest.refreshToken();
          console.log("Data refresh ==", res);

          localStorage.setItem("accessToken", res.data.accessToken);
          localStorage.setItem("refreshToken", res.data.refreshToken);
        } catch (err) {
          console.log(err);

          clearInterval(interval);
        }
      }
    };
    checkAndRefresh();
    interval = setInterval(checkAndRefresh, 5 * 1000);
    return () => clearInterval(interval);
  }, [pathname]);
  return <div></div>;
}
