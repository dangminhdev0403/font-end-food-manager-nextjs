import { createResource } from "@/lib/createResource";
import adminProductClient from "@/services/internal/admin/products/products.client";

export const productResource = createResource({
  key: "admin-products",

  client: {
    getList: adminProductClient.getListProducts,
    create: adminProductClient.addProduct,
    update: adminProductClient.updateProduct,
    delete: adminProductClient.deleteProduct,
    getById: adminProductClient.getProductById,
  },
});
