import { PaginationQuery } from "@/constants/types/page.type";
import { queryKeys } from "@/lib/queryKeys";
import productClient from "@/services/internal/products/product.client";
import { useQuery } from "@tanstack/react-query";

export const useGetListTableClientQuery = (params: PaginationQuery) => {
  return useQuery({
    queryKey: queryKeys.clientProduct(params),
    queryFn: () => productClient.getList(params).then((res) => res.data),
  });
};
