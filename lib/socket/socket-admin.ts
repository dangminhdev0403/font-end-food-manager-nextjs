import { backendApiEndpoint } from "@/services/internal/base-url.consants";
import { io } from "socket.io-client";

export const adminSocket = io(backendApiEndpoint!, {
  transports: ["websocket"],
  query: {
    role: "admin",
  },
});
