import { PaginationQuery } from "@/constants/types/page.type";
import { GetListTableParams } from "@/services/internal/admin/tables/table.types";

export const queryKeys = {
  //!admin
  adminTables: Object.assign(
    (params?: GetListTableParams) =>
      [
        "admin-tables",
        {
          page: params?.page ?? 1,
          size: params?.size ?? 10,
          search: params?.search ?? "",
          statusFilter: params?.statusFilter ?? "ALL",
        },
      ] as const,
    {
      root: ["admin-tables"] as const,
    },
  ),

  profile: ["account-profile"] as const,
  adminTableCounts: ["admin-table-counts"] as const,

  //!client
  clientTables: Object.assign(
    (params?: PaginationQuery) =>
      [
        "client-list-tables",
        {
          page: params?.page ?? 1,
          size: params?.size ?? 10,
        },
      ] as const,
    {
      root: ["client-list-tables"] as const,
    },
  ),
  clientProduct: Object.assign(
    (params?: PaginationQuery) =>
      [
        "client-list-product",
        {
          page: params?.page ?? 1,
          size: params?.size ?? 10,
        },
      ] as const,
    {
      root: ["client-list-product"] as const,
    },
  ),
  listOrderGuest: Object.assign(["guest-list-order"] as const, {
    root: ["guest-list-order"] as const,
  }),
};
