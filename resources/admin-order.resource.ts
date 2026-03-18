import { createResource } from "@/lib/createResource";
import adminOrderClient from "@/services/internal/admin/orders/order.client";

export const adminOrderResource = createResource({
  key: "admin-order",

  client: {
    getList: adminOrderClient.getListOrders,
    update: adminOrderClient.updateOrder,
  },
});
