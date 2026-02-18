import { PaginationQuery } from "@/constants/types/page.type";

export const queryKeys = {
  adminTables: Object.assign(
    (params?: PaginationQuery) =>
      [
        "admin-tables",
        {
          page: params?.page ?? 1,
          size: params?.size ?? 10,
        },
      ] as const,
    {
      root: ["admin-tables"] as const,
    },
  ),

  profile: ["account-profile"] as const,
};
