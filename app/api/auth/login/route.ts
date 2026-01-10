import { responseError, responseSuccess } from "@/lib/utils";
import { ApiError } from "@/services/http/httpClient";
import authRequest from "@/services/internal/auth";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = cookies();
  try {
    const body = await req.json();
    const res = await authRequest.serverLogin(body);
    const refreshTokenDecode = jwt.decode(res.data.refreshToken) as {
      exp: number;
    };
    const maxAge = refreshTokenDecode?.exp
      ? refreshTokenDecode.exp - Math.floor(Date.now() / 1000) // exp là timestamp (giây)
      : 3600; // fallback 1h
    (await cookieStore).set("refreshToken", res.data.refreshToken, {
      httpOnly: true,
      maxAge,
      path: "/",
      expires: maxAge,
      secure: true,
    });
    return responseSuccess(res);
  } catch (error: unknown) {
    const apiError = error as ApiError;

    return responseError(apiError);
  }
}
