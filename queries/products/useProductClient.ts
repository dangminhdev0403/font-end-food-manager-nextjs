import { queryKeys } from "@/constants/keys/queryKeys";
import { PaginationQuery } from "@/constants/types/page.type";
import productClient from "@/services/internal/products/product.client";
import { useQuery } from "@tanstack/react-query";

export const useGetListProductClientQuery = (params: PaginationQuery) => {
  return useQuery({
    queryKey: queryKeys.clientProduct(params),
    queryFn: () => productClient.getList(params).then((res) => res.data),
  });
};
