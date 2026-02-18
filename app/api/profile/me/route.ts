// app/api/auth/login/route.ts
import envConfig from "@/config/env.config";
import { responseError } from "@/lib/utils";
import { profileServerApi } from "@/services/internal/me/profile.server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const isProduction = envConfig.NEXT_PUBLIC_ENVIRONMENT === "production";
export async function GET(req: NextRequest) {
  try {
    // Lấy payload từ client
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value || "";
    // Gọi API login backend
    const res = await profileServerApi.getProfile(accessToken);

    return NextResponse.json(res);
  } catch (err: any) {
    return responseError(err);
  }
}
