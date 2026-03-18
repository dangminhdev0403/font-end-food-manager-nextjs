import { httpServer } from "@/services/http/httpServer";
import {
  GetListOrderParams,
  ListOrderResponse,
  OrderStatusCount,
  UpdateOrderBody,
} from "@/services/internal/admin/orders/order.types";

const adminOrderServer = {
  getListOrder: (params?: GetListOrderParams) => {
    return httpServer.get<ListOrderResponse>("/admin/orders", {
      params,
      isAuth: true,
    });
  },
 getOrderCounts: () => {
    return httpServer.get<OrderStatusCount>("/admin/orders/status-count", {
      isAuth: true,
    });
  },
  updateOrder: (body: UpdateOrderBody) => {
    return httpServer.put("/admin/orders", body, {
      isAuth: true,
    });
  },
};

export default adminOrderServer;
