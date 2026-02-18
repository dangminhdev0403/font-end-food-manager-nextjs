// app/api/auth/login/route.ts
import { auth } from "@/config/authentication/auth";
import { responseError, responseSuccess } from "@/lib/utils";
import authServer from "@/services/internal/auth/auth.server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.refreshToken) {
    return NextResponse.json({ ok: true });
  }

  const refreshToken = session?.refreshToken;
  try {
    const res = await authServer.serverLogout({ refreshToken });
    return responseSuccess(res);
  } catch (err: any) {
    return responseError(err);
  }
}
