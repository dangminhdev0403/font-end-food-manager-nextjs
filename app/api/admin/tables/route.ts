import { responseError, responseSuccess } from "@/lib/utils";
import adminTableServer from "@/services/internal/admin/tables/table.server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number.parseInt(searchParams.get("page") || "1");
    const size = Number.parseInt(searchParams.get("size") || "10");
    const statusFilter = searchParams.get("statusFilter") || ("ALL" as any);
    const search = searchParams.get("search") || "";
    const res = await adminTableServer.getListTable({
      page,
      size,
      search,
      statusFilter,
    });

    return responseSuccess(res);
  } catch (error: any) {
    return responseError(error);
  }
}
