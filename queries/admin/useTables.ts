import { PaginationQuery } from "@/constants/types/page.type";
import { queryKeys } from "@/lib/queryKeys";
import adminTableRequest from "@/services/internal/admin/table";
import { useQuery } from "@tanstack/react-query";

export const useAdminTableQuery = (params?: PaginationQuery) => {
  return useQuery({
    queryKey: queryKeys.adminTables(params),
    queryFn: async () => {
      try {
        const res = await adminTableRequest.getListTable(params);
        return res.data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  });
};
