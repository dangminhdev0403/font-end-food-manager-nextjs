import { responseError, responseSuccess } from "@/lib/utils";
import adminOrderServer from "@/services/internal/admin/orders/order.server";
import { NextRequest } from "next/server";
import z from "zod";

const statusOrderSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "COOKING",
  "PAID",
  "CANCELLED",
]);
// 👇 GET filter cho phép ALL
const filterStatusSchema = statusOrderSchema.or(z.literal("ALL"));
const UpdateOrderSchema = z.object({
  orderId: z.number(),
  status: statusOrderSchema,
});
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number.parseInt(searchParams.get("page") || "1");
    const size = Number.parseInt(searchParams.get("size") || "10");
    const statusParam = searchParams.get("status") || "ALL";
    const status = filterStatusSchema.parse(statusParam);
    const res = await adminOrderServer.getListOrder({
      page,
      size,
      status: status === "ALL" ? undefined : status,
      search: searchParams.get("search") || "",
    });

    return responseSuccess(res);
  } catch (error: any) {
    return responseError(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const json = await req.json();
    const body = UpdateOrderSchema.parse(json);
    const res = await adminOrderServer.updateOrder(body);

    return responseSuccess(res);
  } catch (error: any) {
    return responseError(error);
  }
}
