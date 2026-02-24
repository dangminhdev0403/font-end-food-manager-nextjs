import { queryKeys } from "@/lib/queryKeys";
import adminTableClient from "@/services/internal/admin/tables/table.client";
import {
  GetListTableParams,
  TableAddBody,
  TableItem,
} from "@/services/internal/admin/tables/table.types";
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

    placeholderData: keepPreviousData, // Giữ dữ liệu cũ khi params thay đổi
  });
};

export const useAdminGetTableCountsQuery = () => {
  return useQuery({
    queryKey: queryKeys.adminTableCounts,
    queryFn: () => adminTableClient.getTableCounts(),
  });
};

export const useAdminAddTableMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TableAddBody) =>
      adminTableClient.addTable(data).then((res) => res.data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.adminTables.root,
        refetchType: "active",
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.adminTableCounts,
        refetchType: "active",
      });
    },
  });
};

export const useAdminEditTableMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TableItem) =>
      adminTableClient.editTable(data).then((res) => res.data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.adminTables.root,
        refetchType: "active",
      });
    },
  });
};

export const useAdminDeleteTableMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      adminTableClient.deleteTable(id).then((res) => res.data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.adminTables.root,
        refetchType: "active",
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.adminTableCounts,
        refetchType: "active",
      });
    },
  });
};