export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COOKING"
  | "PAID"
  | "CANCELLED";

export interface GuestOrderRequestBody {
  orderId: number;
  items: {
    productId: number;
    quantity: number;
  }[];
}
export interface OrderGuestItem {
  id: number;
  name: string;
  description: string;

  price: number;
  quantity: number;
  total: number;
}

export interface ListOrderGuestResponse {
  id: number;
  guestName: string;
  status: OrderStatus;
  items: OrderGuestItem[];
  totalPrice: number;
}
