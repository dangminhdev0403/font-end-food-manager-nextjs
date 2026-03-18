"use client";

import { useAdminOrdersRealtime } from "@/lib/hooks/sockets/use-admin-orders-realtime";

export default function AdminRealtimeListener() {
  useAdminOrdersRealtime();
  return null;
}
