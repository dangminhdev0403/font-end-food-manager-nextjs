import { GetListTableParams } from "@/services/internal/admin/tables/table.types";

export const queryKeys = {
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
};
