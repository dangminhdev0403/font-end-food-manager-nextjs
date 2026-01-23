// app/api/auth/login/route.ts
import envConfig from "@/config";
import { responseError, responseSuccess } from "@/lib/utils";
import authRequest from "@/services/internal/auth";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const isProduction = envConfig.NEXT_PUBLIC_ENVIRONMENT === "production";
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessTokenOld = cookieStore.get("accessToken")?.value || "";
    const refreshTokenOld = cookieStore.get("refreshToken")?.value || "";

    const res = await authRequest.serverRefreshToken(accessTokenOld, {
      refreshToken: refreshTokenOld,
    });

    const { accessToken, refreshToken } = res.data;

    const decodedAccessToken = jwt.decode(accessToken) as { exp: number };
    const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number };
    cookieStore.set("accessToken", accessToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
      expires: decodedAccessToken.exp * 1000,
    });
    cookieStore.set("refreshToken", refreshToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
      expires: decodedRefreshToken.exp * 1000,
    });

    return responseSuccess(res);
  } catch (err: any) {
    console.log(err);

    return responseError(err);
  }
}
