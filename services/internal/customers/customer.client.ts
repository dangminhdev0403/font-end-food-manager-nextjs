import { PaginationQuery } from "@/constants/types/page.type";
import { httpClient } from "@/services/http/httpClient";
import { backendApiEndpoint } from "@/services/internal/base-url.consants";
import {
  CustomerCreateOrderBody,
  CustomerCreateOrderResponse,
  ListTableResponse,
  TableScanedResponse,
} from "@/services/internal/customers/customer.types";

const customerClient = {
  getListTable: (params: PaginationQuery) =>
    httpClient.get<ListTableResponse>(`tables/list`, {
      baseURL: backendApiEndpoint,
      params,
    }),
  scanQrCode: (token: string) =>
    httpClient.get<TableScanedResponse>(`tables/scan/${token}`, {
      baseURL: backendApiEndpoint,
    }),
  findTableById: (id: number) =>
    httpClient.get<TableScanedResponse>(`tables/detail/${id}`, {
      baseURL: backendApiEndpoint,
    }),
  createOrder: (body: CustomerCreateOrderBody) =>
    httpClient.post<CustomerCreateOrderResponse>(`guest/orders`, body, {
      baseURL: backendApiEndpoint,
    }),
};

export default customerClient;
