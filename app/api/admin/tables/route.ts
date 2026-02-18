import { responseError, responseSuccess } from "@/lib/utils";
import adminTableServer from "@/services/internal/admin/tables/table.server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number.parseInt(searchParams.get("page") || "1");
    const size = Number.parseInt(searchParams.get("size") || "10");

    const res = await adminTableServer.getListTable({
      page,
      size,
    });

    return responseSuccess(res);
  } catch (error: any) {
    return responseError(error);
  }
}
