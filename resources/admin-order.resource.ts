import { queryKeys } from "@/constants/keys/queryKeys";
import { createResource } from "@/lib/createResource";

import adminOrderClient from "@/services/internal/admin/orders/order.client";

export const adminOrderResource = createResource({
  key: queryKeys.adminOrders.root[0],

  client: {
    getList: adminOrderClient.getListOrders,
    update: adminOrderClient.updateOrder,
  },

  extraQueries: {
    statusCounts: {
      fn: adminOrderClient.getOrderCounts,
      key: queryKeys.adminOrders,
    },
  },

  extraMutations: {
    updateStatus: {
      fn: adminOrderClient.updateOrder,
      invalidate: queryKeys.adminOrders.statusCounts(),
    },
  },
});
