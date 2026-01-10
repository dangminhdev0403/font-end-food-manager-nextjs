// app/api/auth/login/route.ts
import { responseError, responseSuccess } from "@/lib/utils";
import authRequest from "@/services/internal/auth";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Lấy payload từ client
    const body = await req.json();

    // Gọi API login backend
    const res = await authRequest.serverLogin(body);

    // Chỉ trả data, không trả nguyên AxiosResponse
    return responseSuccess(res);
  } catch (err: any) {
    return responseError(err);
  }
}
