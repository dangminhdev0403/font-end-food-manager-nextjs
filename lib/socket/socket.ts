import { backendApiEndpoint } from "@/services/internal/base-url.consants";
import { io } from "socket.io-client";

export const socket = io(backendApiEndpoint!, {
  transports: ["websocket"],
  autoConnect: false,
});
