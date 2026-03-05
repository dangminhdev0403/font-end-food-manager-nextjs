import { httpClient } from "@/services/http/httpClient";
import { backendApiEndpoint } from "@/services/internal/base-url.consants";
import {
  GuestOrderRequestBody,
  ListOrderGuestResponse,
} from "@/services/internal/customers/guests/guest.types";

const guestClient = {
  updateOrder: (body: GuestOrderRequestBody) =>
    httpClient.post<ListOrderGuestResponse>(`guest/orders/choose-items`, body, {
      baseURL: backendApiEndpoint,
      isGuest: true,
    }),

  getListOrder: () =>
    httpClient.get<ListOrderGuestResponse>(`guest/orders`, {
      baseURL: backendApiEndpoint,
      isGuest: true,
    }),
};

export default guestClient;
