import { PaginationQuery } from "@/constants/types/page.type";

// src/lib/queryKeys.ts
export const queryKeys = {
  adminTables: (params?: PaginationQuery) =>
    ["admin-tables", params ?? {}] as const,
  profile: ["account-profile"],
};
