import { responseError, responseSuccess } from "@/lib/utils";
import adminTableServer from "@/services/internal/admin/tables/table.server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const res = await adminTableServer.getTableCounts();

    return responseSuccess(res);
  } catch (error: any) {
    return responseError(error);
  }
}
