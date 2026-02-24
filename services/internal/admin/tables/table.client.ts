import { httpClient } from "@/services/http/httpClient";
import {
  GetListTableParams,
  ListTableResponse,
  TableAddBody,
  TableItem,
  TableItemResponse,
  TableStatusCount,
} from "@/services/internal/admin/tables/table.types";

const adminTableClient = {
  getListTable: (params?: GetListTableParams) =>
    httpClient.get<ListTableResponse>("/api/admin/tables", {
      params,
    }),
  getTableCounts: () =>
    httpClient.get<TableStatusCount>("/api/admin/tables/status-count"),
  addTable: async (data: TableAddBody) =>
    httpClient.post<TableItem>("api/admin/tables", data),
  editTable: async (data: TableItem) =>
    httpClient.put<TableItemResponse>("api/admin/tables", data),
  deleteTable: async (id: number) =>
    httpClient.delete<TableItemResponse>("/api/admin/tables", {
      data: { id },
    }),
};

export default adminTableClient;
