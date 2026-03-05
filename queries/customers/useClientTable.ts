import { queryKeys } from "@/constants/keys/queryKeys";
import { PaginationQuery } from "@/constants/types/page.type";
import customerClient from "@/services/internal/customers/customer.client";
import { useQuery } from "@tanstack/react-query";

export const useClientListTableQuery = (params: PaginationQuery) => {
  return useQuery({
    queryKey: queryKeys.clientTables(params),
    queryFn: () => customerClient.getListTable(params).then((res) => res.data),
  });
};
