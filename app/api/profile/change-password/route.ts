// app/api/auth/login/route.ts
import envConfig from "@/config";
import { responseError, responseSuccess } from "@/lib/utils";
import { profileApiRequest } from "@/services/internal/account";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const isProduction = envConfig.NEXT_PUBLIC_ENVIRONMENT === "production";
export async function PUT(req: NextRequest) {
  try {
    // Lấy payload từ client
    const body = await req.json();
    const cookieStore = await cookies();
    const accessTokenOld = cookieStore.get("accessToken")?.value || "";
    // Gọi API login backend
    console.log("token raw:", accessTokenOld);

    const res = await profileApiRequest.updatePasswordServer(
      body,
      accessTokenOld,
    );
    const { accessToken, refreshToken } = res.data.tokens;
    console.log("Route pass-chang here :", { accessToken, refreshToken });

    const decodedAccessToken = jwt.decode(accessToken) as { exp: number };
    const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number };
    cookieStore.set("accessToken", accessToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
      expires: decodedAccessToken.exp * 100000,
    });
    cookieStore.set("refreshToken", refreshToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
      expires: decodedRefreshToken.exp * 100000,
    });

    return responseSuccess(res);
  } catch (err: any) {
    return responseError(err);
  }
}
