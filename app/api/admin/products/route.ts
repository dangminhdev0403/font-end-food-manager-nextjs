import { responseError, responseSuccess } from "@/lib/utils";
import adminProductServer from "@/services/internal/admin/products/products.server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number.parseInt(searchParams.get("page") || "1");
    const size = Number.parseInt(searchParams.get("size") || "10");
    const search = searchParams.get("search") || "";

    const res = await adminProductServer.getListProducts({
      page,
      size,
      search,
    });

    return responseSuccess(res);
  } catch (error: any) {
    return responseError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await adminProductServer.addProduct(body);

    return responseSuccess(res);
  } catch (error: any) {
    return responseError(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await adminProductServer.updateProduct(body);

    return responseSuccess(res);
  } catch (error: any) {
    return responseError(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await adminProductServer.deleteProduct(body.id);

    return responseSuccess(res);
  } catch (error: any) {
    return responseError(error);
  }
}
