import { responseError, responseSuccess } from "@/lib/utils";
import adminOrderServer from "@/services/internal/admin/orders/order.server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const res = await adminOrderServer.getOrderCounts();

    return responseSuccess(res);
  } catch (error: any) {
    return responseError(error);
  }
}
