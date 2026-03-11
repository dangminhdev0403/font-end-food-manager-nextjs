import { createResource } from "@/lib/createResource";
import {
  CreateProductBody,
  GetListProductParams,
  ProductItem,
  UpdateProductBody,
} from "@/services/internal/admin/products/products-admin.types";
import adminProductClient from "@/services/internal/admin/products/products.client";
import { ListProductResponse } from "@/services/internal/products/product.types";

export const productResource = createResource<
  GetListProductParams,
  CreateProductBody,
  UpdateProductBody,
  ListProductResponse,
  ProductItem
>({
  key: "admin-products",

  client: {
    getList: adminProductClient.getListProducts,

    create: adminProductClient.addProduct,

    update: adminProductClient.updateProduct,

    delete: adminProductClient.deleteProduct,
    getById: adminProductClient.getProductById,
  },
});
