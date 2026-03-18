import { httpClient } from "@/services/http/httpClient";
import {
  GetListOrderParams,
  ListOrderResponse,
  OrderStatusCount,
  UpdateOrderBody,
} from "@/services/internal/admin/orders/order.types";

const adminOrderClient = {
  getListOrders: (params?: GetListOrderParams) => {
    return httpClient.get<ListOrderResponse>("api/admin/orders", {
      params,
    });
  },
  updateOrder: (body: UpdateOrderBody) => {
    return httpClient.put("api/admin/orders", body);
  },
  getOrderCounts: () => {
    return httpClient.get<OrderStatusCount>("api/admin/orders/status-count");
  },
};

export default adminOrderClient;
