import { TableStatus } from "@/services/internal/admin/tables/table.types";
import { z } from "zod";

export const tableSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  capacity: z
    .number("Số lượng không để trống")
    .min(1, "Tối thiểu 1")
    .max(20, "Tối đa 20"),
  status: z.enum(["EMPTY", "OCCUPIED", "RESERVED"]),
});

export type TableFormValues = z.infer<typeof tableSchema>;

export interface TableItemForm {
  id?: number;
  name: string;
  capacity: number;
  status: TableStatus;
  
}