import { httpServer } from "@/services/http/httpServer";
import {
  ListProductResponse,
  ProductItem,
} from "@/services/internal/products/product.types";
import {
  CreateProductBody,
  GetListProductParams,
  UpdateProductBody,
} from "./products-admin.types";

const adminProductServer = {
  getListProducts: (params?: GetListProductParams) => {
    return httpServer.get<ListProductResponse>("/admin/products", {
      params,
      isAuth: true,
    });
  },

  addProduct: (body: CreateProductBody) => {
    return httpServer.post("/admin/products", body, {
      isAuth: true,
    });
  },

  updateProduct: (body: UpdateProductBody) => {
    return httpServer.put("/admin/products", body, {
      isAuth: true,
    });
  },

  deleteProduct: (id: number) => {
    return httpServer.delete(`/admin/products/${id}`, {
      isAuth: true,
    });
  },
  getProductById: (id: number) => {
    return httpServer.get<ProductItem>(`/admin/products/get-one/${id}`, {
      isAuth: true,
    });
  },
};

export default adminProductServer;
