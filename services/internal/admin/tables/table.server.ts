import { httpServer } from "@/services/http/httpServer";
import {
  GetListTableParams,
  ListTableResponse,
  TableItemResponse,
  TableStatusCount,
} from "@/services/internal/admin/tables/table.types";

const adminTableServer = {
  getListTable: (params?: GetListTableParams) => {
    return httpServer.get<ListTableResponse>("/admin/tables", {
      params,
      isAuth: true,
    });
  },
  getTableCounts: () => {
    return httpServer.get<TableStatusCount>("/admin/tables/status-count", {
      isAuth: true,
    });
  },
  addTable: async (data: { name: string; capacity: number }) => {
    return httpServer.post<ListTableResponse>("/admin/tables", data, {
      isAuth: true,
    });
  },
  updateTable: async (data: {
    id: number;
    name: string;
    capacity: number;
    status: any;
  }) => {
    return httpServer.put<TableItemResponse>("/admin/tables", data, {
      isAuth: true,
    });
  },
  deleteTable: async (data: { id: number }) => {
    return httpServer.delete<TableItemResponse>("/admin/tables", {
      isAuth: true,
      data: data,
    });
  },
};
export default adminTableServer;
