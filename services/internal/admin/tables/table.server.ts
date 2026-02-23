import { httpServer } from "@/services/http/httpServer";
import {
  GetListTableParams,
  ListTableResponse,
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
};
export default adminTableServer;
