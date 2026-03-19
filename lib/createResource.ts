import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosResponse } from "axios";

/* ---------------- TYPE HELPERS ---------------- */

type AwaitedReturn<T> = T extends Promise<infer R> ? R : T;

type ExtractAxios<T> = T extends AxiosResponse<infer R> ? R : T;

type InferResponse<T> = T extends (...args: any) => any
  ? ExtractAxios<AwaitedReturn<ReturnType<T>>>
  : never;

type InferParams<T> = T extends (params?: infer P) => any ? P : never;

type InferBody<T> = T extends (body: infer B) => any ? B : never;

/* ---------------- CLIENT ---------------- */

type ResourceClient = {
  getList?: (params?: any) => Promise<AxiosResponse<any>>;
  getById?: (id: number) => Promise<AxiosResponse<any>>;
  create?: (body: any) => Promise<any>;
  update?: (body: any) => Promise<any>;
  delete?: (id: number) => Promise<any>;
};

/* ---------------- EXTRA TYPES ---------------- */

type ExtraQuery<TFn extends (...args: any) => Promise<any>> = {
  fn: TFn;
  key: (...args: Parameters<TFn>) => readonly any[];
};

type ExtraMutation<TFn extends (...args: any) => Promise<any>> = {
  fn: TFn;
  invalidate?: readonly any[] | readonly any[][];
};

type ExtraQueries = Record<string, ExtraQuery<any>>;
type ExtraMutations = Record<string, ExtraMutation<any>>;

type ResourceReturn<
  TClient extends ResourceClient,
  TExtraQ extends ExtraQueries,
  TExtraM extends ExtraMutations,
> = {
  queryKeys: {
    root: readonly [string];
    list: (params?: InferParams<TClient["getList"]>) => readonly unknown[];
    detail: (id: number) => readonly unknown[];
  };
} & (TClient["getList"] extends (...args: any) => any
  ? {
      useListQuery: (
        params?: InferParams<TClient["getList"]>,
      ) => ReturnType<typeof useQuery<InferResponse<TClient["getList"]>>>;
    }
  : {}) &
  (TClient["getById"] extends (...args: any) => any
    ? {
        useGetByIdQuery: (
          id?: number,
        ) => ReturnType<
          typeof useQuery<InferResponse<TClient["getById"]> | null>
        >;
      }
    : {}) &
  (TClient["create"] extends (...args: any) => any
    ? {
        useCreateMutation: () => ReturnType<
          typeof useMutation<
            AwaitedReturn<ReturnType<TClient["create"]>>,
            unknown,
            InferBody<TClient["create"]>
          >
        >;
      }
    : {}) &
  (TClient["update"] extends (...args: any) => any
    ? {
        useUpdateMutation: () => ReturnType<
          typeof useMutation<
            AwaitedReturn<ReturnType<TClient["update"]>>,
            unknown,
            InferBody<TClient["update"]>
          >
        >;
      }
    : {}) &
  (TClient["delete"] extends (...args: any) => any
    ? {
        useDeleteMutation: () => ReturnType<
          typeof useMutation<
            AwaitedReturn<ReturnType<TClient["delete"]>>,
            unknown,
            number
          >
        >;
      }
    : {}) & {
    extraQueries: {
      [K in keyof TExtraQ]: (
        ...args: Parameters<TExtraQ[K]["fn"]>
      ) => ReturnType<typeof useQuery<InferResponse<TExtraQ[K]["fn"]>>>;
    };
    extraMutations: {
      [K in keyof TExtraM]: () => ReturnType<
        typeof useMutation<
          AwaitedReturn<ReturnType<TExtraM[K]["fn"]>>,
          unknown,
          Parameters<TExtraM[K]["fn"]>[0]
        >
      >;
    };
  };

/* ---------------- MAIN ---------------- */
export function createResource<
  TClient extends ResourceClient,
  TExtraQ extends ExtraQueries = {},
  TExtraM extends ExtraMutations = {},
>(config: {
  key: string;
  client: TClient;
  extraQueries?: TExtraQ;
  extraMutations?: TExtraM;
}): ResourceReturn<TClient, TExtraQ, TExtraM> {
  const { key, client, extraQueries, extraMutations } = config;

  const queryKeys = {
    root: [key] as const,
    list: (params?: any) => [key, "list", params] as const,
    detail: (id: number) => [key, "detail", id] as const,
  };

  const resource: any = { queryKeys };

  /* LIST */
  if (client.getList) {
    resource.useListQuery = (params: any) =>
      useQuery({
        queryKey: queryKeys.list(params),
        queryFn: async () => {
          const res = await client.getList!(params);
          return res.data;
        },
        placeholderData: keepPreviousData,
      });
  }

  /* UPDATE */
  if (client.update) {
    resource.useUpdateMutation = () => {
      const qc = useQueryClient();

      return useMutation({
        mutationFn: (body: any) => client.update!(body),
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: queryKeys.root });
        },
      });
    };
  }

  /* EXTRA QUERY */
  if (extraQueries) {
    resource.extraQueries = {};

    for (const k in extraQueries) {
      const q = extraQueries[k];

      resource.extraQueries[k] = (...args: any[]) =>
        useQuery({
          queryKey: q.key(...args),
          queryFn: async () => {
            const res = await q.fn(...args);
            return res.data;
          },
        });
    }
  }

  /* EXTRA MUTATION */
  if (extraMutations) {
    resource.extraMutations = {};

    for (const k in extraMutations) {
      const m = extraMutations[k];

      resource.extraMutations[k] = () => {
        const qc = useQueryClient();

        return useMutation({
          mutationFn: (...args: any[]) => m.fn(...args),
          onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.root });
          },
        });
      };
    }
  }

  return resource;
}