import { PaginationQuery } from "@/constants/types/page.type";
import { ApiResponse } from "@/services/http/apiError";
import { backendApiEndpoint } from "@/services/internal/base-url.consants";
import { ListProductResponse } from "@/services/internal/products/product.types";

export async function getProductsISR(
  params?: PaginationQuery,
): Promise<ApiResponse<ListProductResponse>> {
  const searchParams = new URLSearchParams();

  if (params?.page !== undefined) {
    searchParams.append("page", params.page.toString());
  }

  if (params?.size !== undefined) {
    searchParams.append("size", params.size.toString());
  }

  const res = await fetch(
    `${backendApiEndpoint}/products?${searchParams.toString()}`,
    {
      next: { tags: ["products"] },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}
