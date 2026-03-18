import {
  keepPreviousData,
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { AxiosResponse } from "axios";

/* ---------------- TYPE HELPERS ---------------- */

type InferResponse<T> = T extends (
  ...args: any
) => Promise<AxiosResponse<infer R>>
  ? R
  : never;

type InferParams<T> = T extends (params?: infer P) => any ? P : never;

type InferBody<T> = T extends (body: infer B) => any ? B : never;

/* ---------------- CLIENT TYPE ---------------- */

type ResourceClient = {
  getList?: (params?: any) => Promise<AxiosResponse<any>>;
  getById?: (id: number) => Promise<AxiosResponse<any>>;
  create?: (body: any) => Promise<any>;
  update?: (body: any) => Promise<any>;
  delete?: (id: number) => Promise<any>;
};

/* ---------------- RESOURCE TYPE ---------------- */

type Resource<TClient extends ResourceClient> = {
  queryKeys: {
    root: readonly [string];
    list: (params?: InferParams<TClient["getList"]>) => readonly unknown[];
    detail: (id: number) => readonly unknown[];
  };
} & (TClient["getList"] extends undefined
  ? {}
  : {
      useListQuery: (
        params?: InferParams<TClient["getList"]>,
      ) => UseQueryResult<InferResponse<TClient["getList"]>>;
    }) &
  (TClient["getById"] extends undefined
    ? {}
    : {
        useGetByIdQuery: (
          id?: number,
        ) => UseQueryResult<InferResponse<TClient["getById"]> | null>;
      }) &
  (TClient["create"] extends undefined
    ? {}
    : {
        useCreateMutation: () => UseMutationResult<
          unknown,
          unknown,
          InferBody<TClient["create"]>
        >;
      }) &
  (TClient["update"] extends undefined
    ? {}
    : {
        useUpdateMutation: () => UseMutationResult<
          unknown,
          unknown,
          InferBody<TClient["update"]>
        >;
      }) &
  (TClient["delete"] extends undefined
    ? {}
    : {
        useDeleteMutation: () => UseMutationResult<unknown, unknown, number>;
      });

/* ---------------- MAIN ---------------- */

export function createResource<TClient extends ResourceClient>(config: {
  key: string;
  client: TClient;
}): Resource<TClient> {
  const { key, client } = config;

  const queryKeys = {
    root: [key] as const,
    list: (params?: any) => [key, "list", params] as const,
    detail: (id: number) => [key, "detail", id] as const,
  };

  const resource: any = { queryKeys };

  /* ---------------- LIST ---------------- */

  if (client.getList) {
    resource.useListQuery = (params?: InferParams<TClient["getList"]>) =>
      useQuery({
        queryKey: queryKeys.list(params),
        queryFn: async () => {
          const res = await client.getList!(params);
          return res.data;
        },
        placeholderData: keepPreviousData,
      });
  }

  /* ---------------- DETAIL ---------------- */

  if (client.getById) {
    resource.useGetByIdQuery = (id?: number) =>
      useQuery({
        queryKey: id ? queryKeys.detail(id) : [],
        queryFn: async () => {
          if (!id) return null;
          const res = await client.getById!(id);
          return res.data;
        },
        enabled: !!id,
      });
  }

  /* ---------------- CREATE ---------------- */

  if (client.create) {
    resource.useCreateMutation = () => {
      const queryClient = useQueryClient();

      return useMutation({
        mutationFn: (body: InferBody<TClient["create"]>) =>
          client.create!(body),

        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: queryKeys.root,
          });
        },
      });
    };
  }

  /* ---------------- UPDATE ---------------- */

  if (client.update) {
    resource.useUpdateMutation = () => {
      const queryClient = useQueryClient();

      return useMutation({
        mutationFn: (body: InferBody<TClient["update"]>) =>
          client.update!(body),

        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: queryKeys.root,
          });
        },
      });
    };
  }

  /* ---------------- DELETE ---------------- */

  if (client.delete) {
    resource.useDeleteMutation = () => {
      const queryClient = useQueryClient();

      return useMutation({
        mutationFn: (id: number) => client.delete!(id),

        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: queryKeys.root,
          });
        },
      });
    };
  }

  return resource as Resource<TClient>;
}
