import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export function createResource<
  TListParams,
  TCreateBody,
  TUpdateBody,
  TListResponse,
  TDetailResponse,
>(config: {
  key: string;
  client: {
    getList: (params?: TListParams) => Promise<AxiosResponse<TListResponse>>;
    create: (body: TCreateBody) => Promise<any>;
    getById: (id: number) => Promise<AxiosResponse<TDetailResponse>>;
    update: (body: TUpdateBody) => Promise<any>;
    delete: (id: number) => Promise<any>;
  };
}) {
  const { key, client } = config;

  const queryKeys = {
    root: [key] as const,
    list: (params?: TListParams) => [key, "list", params] as const,
    detail: (id: number) => [key, "detail", id] as const,
  };

  const useListQuery = (params?: TListParams) =>
    useQuery({
      queryKey: queryKeys.list(params),
      queryFn: async () => {
        const res = await client.getList(params);
        return res.data;
      },
      placeholderData: keepPreviousData,
    });
  const useGetByIdQuery = (id?: number) =>
    useQuery<TDetailResponse | null>({
      queryKey: id ? queryKeys.detail(id) : [],
      queryFn: async () => {
        if (!id) return null;
        const res = await client.getById(id);
        return res.data;
      },
      enabled: !!id,
    });
  const useCreateMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: client.create,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.root });
      },
    });
  };

  const useUpdateMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: client.update,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.root });
      },
    });
  };

  const useDeleteMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: client.delete,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.root });
      },
    });
  };

  return {
    useListQuery,
    useCreateMutation,
    useUpdateMutation,
    useDeleteMutation,
    useGetByIdQuery,
  };
}
