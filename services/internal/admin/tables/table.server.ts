import { PaginationQuery } from "@/constants/types/page.type";
import { httpServer } from "@/services/http/httpServer";
import { ListTableResponse } from "@/services/internal/admin/tables/table.types";

const adminTableServer = {
  getListTable: async (params?: PaginationQuery) => {
    httpServer.get<ListTableResponse>("/admin/tables", {
      params,
      isAuth: true,
    });
  },
};
export default adminTableServer;
