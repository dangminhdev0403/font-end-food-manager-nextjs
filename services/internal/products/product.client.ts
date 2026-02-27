import { PaginationQuery } from "@/constants/types/page.type";
import { httpClient } from "@/services/http/httpClient";
import { backendApiEndpoint } from "@/services/internal/base-url.consants";
import { ListProductResponse } from "@/services/internal/products/product.types";

const productClient = {
  getList: (params?: PaginationQuery) =>
    httpClient.get<ListProductResponse>("/products", {
      baseURL: backendApiEndpoint,
      params,
    }),
};

export default productClient;
