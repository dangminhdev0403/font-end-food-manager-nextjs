import { PaginationQuery } from "@/constants/types/page.type";
import { queryKeys } from "@/lib/queryKeys";
import adminTableClient from "@/services/internal/admin/tables/table.client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAdminTableQuery = (params?: PaginationQuery) => {
  return useQuery({
    queryKey: queryKeys.adminTables(params),

    queryFn: () =>
      adminTableClient.getListTable(params).then((res) => res.data),
    staleTime: 30_000,
  });
};

export const useAdminAddTableMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminTableClient.addTable,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.adminTables.root,
      });
    },
  });
};
