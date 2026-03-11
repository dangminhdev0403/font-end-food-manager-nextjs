import { logger } from "@/lib/logger";
import { responseError, responseSuccess } from "@/lib/utils";
import adminProductServer from "@/services/internal/admin/products/products.server";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const params = await context.params;
    const id = Number(params.id);

    logger.info({ id, params: context.params }, "Check ID +++");
    logger.info(context, "Route context");
    const res = await adminProductServer.getProductById(id);

    return responseSuccess(res);
  } catch (error: any) {
    return responseError(error);
  }
}
