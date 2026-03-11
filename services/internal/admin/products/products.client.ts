import { httpClient } from "@/services/http/httpClient";
import { ListProductResponse, ProductItem } from "@/services/internal/products/product.types";
import {
  CreateProductBody,
  GetListProductParams,
  UpdateProductBody,
} from "./products-admin.types";

const adminProductClient = {
  getListProducts: (params?: GetListProductParams) => {
    return httpClient.get<ListProductResponse>("api/admin/products", {
      params,
    });
  },
  getProductById: (id: number) => {
    return httpClient.get<ProductItem>("api/admin/products/" + id);
  },
  addProduct: (body: CreateProductBody) => {
    return httpClient.post("api/admin/products", body);
  },

  updateProduct: (body: UpdateProductBody) => {
    return httpClient.put("api/admin/products", body);
  },

  deleteProduct: (id: number) => {
    return httpClient.delete("api/admin/products", {
      data: { id },
    });
  },
};

export default adminProductClient;
