import { queryKeys } from "@/lib/queryKeys";
import adminTableClient from "@/services/internal/admin/tables/table.client";
import { GetListTableParams } from "@/services/internal/admin/tables/table.types";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
export const useAdminTableQuery = (params: GetListTableParams) => {
  return useQuery({
    queryKey: queryKeys.adminTables(params),
    queryFn: () =>
      adminTableClient.getListTable(params).then((res) => res.data),
    staleTime: 30_000,
    placeholderData: keepPreviousData, // Giữ dữ liệu cũ khi params thay đổi
  });
};

export const useAdminGetTableCountsQuery = () => {
  return useQuery({
    queryKey: queryKeys.adminTableCounts,
    queryFn: () => adminTableClient.getTableCounts(),
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
