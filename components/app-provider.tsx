"use client";
import RefreshToken from "@/components/refresh-token";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { useState } from "react";

// Create a client

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retryOnMount: false,
            staleTime: 5 * 60 * 1000,
          },
        },
      }),
  );
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      {children}
      <RefreshToken/>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
