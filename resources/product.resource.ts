import { queryKeys } from "@/constants/keys/queryKeys";
import { createResource } from "@/lib/createResource";
import adminProductClient from "@/services/internal/admin/products/products.client";

export const productResource = createResource({
  key: queryKeys.adminProducts.root[0],

  client: {
    getList: adminProductClient.getListProducts,
    create: adminProductClient.addProduct,
    update: adminProductClient.updateProduct,
    delete: adminProductClient.deleteProduct,
    getById: adminProductClient.getProductById,
  },
});
