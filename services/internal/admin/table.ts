import envConfig from "@/config";
import { Pageable, PaginationQuery } from "@/constants/types/page.type";
import { httpClient } from "@/services/http/httpClient";

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
interface ListTableResponse {
  items: TableItem[];
  meta: Pageable;
}
const adminTableRequest = {
  getListTable: async (params?: PaginationQuery) =>
    httpClient.get<ListTableResponse>("/admin/tables", {
      baseURL: envConfig.NEXT_PUBLIC_API_ENDPOINT,
      params,
    }),
};

export default adminTableRequest;
