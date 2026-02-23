import envConfig from "@/config/env.config";
import { PaginationQuery } from "@/constants/types/page.type";
import { httpClient } from "@/services/http/httpClient";
import {
  FilterTableQuery,
  GetListTableParams,
  ListTableResponse,
  TableAddBody,
  TableStatus,
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
    httpClient.post<ListTableResponse>("/admin/tables", data, {
      baseURL: envConfig.NEXT_PUBLIC_BACKEND_API_ENDPOINT,
    }),
  editTable: async (params?: PaginationQuery) =>
    httpClient.get<ListTableResponse>("/admin/tables", {
      baseURL: envConfig.NEXT_PUBLIC_BACKEND_API_ENDPOINT,
      params,
    }),
};

export default adminTableClient;
