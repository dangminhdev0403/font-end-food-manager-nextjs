import { queryKeys } from "@/constants/keys/queryKeys";
import { GetListProductParams } from "@/services/internal/admin/products/products-admin.types";
import adminProductClient from "@/services/internal/admin/products/products.client";
import productClient from "@/services/internal/products/product.client";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useGetListProductClientQuery = (params: GetListProductParams) => {
  return useQuery({
    queryKey: queryKeys.clientProduct(params),
    queryFn: () => productClient.getList(params).then((res) => res.data),
    placeholderData: keepPreviousData,
  });
};

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminProductClient.addProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.adminProducts.root,
      });
    },
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminProductClient.updateProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.adminProducts.root,
      });
    },
  });
};
export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminProductClient.deleteProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.adminProducts.root,
      });
    },
  });
};
