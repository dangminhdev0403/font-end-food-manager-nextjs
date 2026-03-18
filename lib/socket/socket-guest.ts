import { backendApiEndpoint } from "@/services/internal/base-url.consants";
import { io } from "socket.io-client";

export const createGuestSocket = (tableId: number) =>
  io(backendApiEndpoint!, {
    transports: ["websocket"],
    query: {
      tableId,
    },
  });
