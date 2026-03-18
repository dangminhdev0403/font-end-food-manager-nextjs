import {
  PaginationQuery,
  PaginationResponse,
} from "@/constants/types/page.type";
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COOKING"
  | "PAID"
  | "CANCELLED";
export type OrderItem = {
  id:number,
  name: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: number;
  tableName: string;
  guestName: string;
  status: "PENDING" | "CONFIRMED" | "COOKING" | "PAID" | "CANCELLED";
  total: number;
  itemCount: number;
  items: OrderItem[];
};

export interface UpdateOrderBody {
  orderId: number;
  status: "PENDING" | "CONFIRMED" | "COOKING" | "PAID" | "CANCELLED";
}

export interface FilterOrderQuery {
  search: string;
  status?: "PENDING" | "CONFIRMED" | "COOKING" | "PAID" | "CANCELLED" | "ALL";
}

export interface ListOrderResponse extends PaginationResponse<Order> {}

export type GetListOrderParams = PaginationQuery & FilterOrderQuery;

export type OrderStatusCount = Record<OrderStatus | "ALL", number>;
