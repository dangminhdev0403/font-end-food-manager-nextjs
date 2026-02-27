export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COOKING"
  | "PAID"
  | "CANCELLED";

export interface GuestOrderRequestBody {
  orderId: number;
  items: [
    {
      productId: number;
      quantity: number;
    },
  ];
}
export interface OrderGuestItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface ListOrderGuestResponse {
  orderId: number;
  status: OrderStatus;
  items: OrderGuestItem[];
  totalPrice: number;
}
