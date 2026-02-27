import { httpServer } from "@/services/http/httpServer";
import {
  Table,
  TableScanedResponse,
} from "@/services/internal/customers/customer.types";

const customerServer = {
  ScanQrCode: (token: string) =>
    httpServer.get<TableScanedResponse>("/tables/scan", {
      params: { token },
    }),
  findTableById: (id: number) => httpServer.get<Table>(`tables/detail/${id}`),
};

export default customerServer;
