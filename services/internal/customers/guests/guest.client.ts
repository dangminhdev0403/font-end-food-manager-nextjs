import { httpClient } from "@/services/http/httpClient";
import { backendApiEndpoint } from "@/services/internal/base-url.consants";
import { ListTableResponse } from "@/services/internal/customers/customer.types";
import { GuestOrderRequestBody, ListOrderGuestResponse } from "@/services/internal/customers/guests/guest.types";

const guestClient = {
  updateOrder: ({
    guestToken,
    body,
  }: {
    guestToken: string;
    body: GuestOrderRequestBody;
  }) =>
    httpClient.post<ListOrderGuestResponse>(`guest/orders/choose-items`, {
      baseURL: backendApiEndpoint,
      data: body,
      headers: {
        "x-table-session": guestToken,
        "Content-Type": "application/json",
      },
    }),
  getListOrder: (guestToken: string) =>
    httpClient.get<ListOrderGuestResponse>(`guest/orders`, {
      baseURL: backendApiEndpoint,
      headers: {
        "x-table-session": guestToken,
        "Content-Type": "application/json",
      },
    }),
};

export default guestClient;
