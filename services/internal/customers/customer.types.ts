import { Pageable } from "@/constants/types/page.type";

export type TableStatus = "EMPTY" | "OCCUPIED" | "RESERVED";

export interface Table {
  id: number;
  name: string;
  capacity: number;
  status: TableStatus;
}
export interface ListTableResponse {
  items: Table[];
  meta: Pageable;
}
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COOKING"
  | "PAID"
  | "CANCELLED";

export interface TableScanedResponse {
  table: {
    id: number;
    name: string;
    status: TableStatus;
    isActive: boolean;
  };
}

export interface CustomerCreateOrderBody {
  tableId: number;
  guestName: string;
}
export interface CustomerCreateOrderResponse {
  id: number;
  guestName: string;
  status: "PENDING";
  guestToken: string;
}
