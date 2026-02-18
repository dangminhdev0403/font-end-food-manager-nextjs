import { Pageable } from "@/constants/types/page.type";

export type TableStatus = "EMPTY" | "OCCUPIED" | "RESERVED";

export interface OrderedDishDTO {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface TableItem {
  id: number;
  name: string;
  capacity: number;
  status: TableStatus;
  qrToken: string;

  orderedDishes: OrderedDishDTO[];
}
export interface ListTableResponse {
  items: TableItem[];
  meta: Pageable;
}
export interface TableAddBody {
  name: string;
  capacity: number;
}