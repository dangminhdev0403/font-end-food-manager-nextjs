// app/api/auth/login/route.ts
import { responseError, responseSuccess } from "@/lib/utils";
import authRequest from "@/services/internal/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get("accessToken")?.value;
  const refreshToken = (await cookieStore).get("refreshToken")?.value;
  (await cookieStore).delete("accessToken");
  (await cookieStore).delete("refreshToken");
  if (!accessToken || !refreshToken) {
    return NextResponse.json(
      {
        status: 200,
        error: "không nhận được token",
        message: "Chưa có accessToken hoặc refreshToken",
        data: null,
      },
      { status: 200 }
    );
  }
  try {
    const res = await authRequest.serverLogout({ accessToken, refreshToken });
    return responseSuccess(res);
  } catch (err: any) {
    return responseError(err);
  }
}
