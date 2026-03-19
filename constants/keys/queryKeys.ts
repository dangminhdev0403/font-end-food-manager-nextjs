import { PaginationQuery } from "@/constants/types/page.type";
import { GetListProductParams } from "@/services/internal/admin/products/products-admin.types";
import { GetListTableParams } from "@/services/internal/admin/tables/table.types";

export const queryKeys = {
  //!admin
  //? table
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
  adminOrders: Object.assign(() => ["admin-orders", "status-count"] as const, {
    root: ["admin-orders"] as const,
    statusCounts: () => ["admin-orders", "status-count"] as const,
  }),
  profile: ["account-profile"] as const,
  adminTableCounts: ["admin-table-counts"] as const,
  //? product
  adminProducts: Object.assign(
    (params?: GetListProductParams) =>
      [
        "admin-products",
        {
          page: params?.page ?? 1,
          size: params?.size ?? 10,
          search: params?.search ?? "",
        },
      ] as const,
    {
      root: ["admin-products"] as const,
    },
  ),
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
