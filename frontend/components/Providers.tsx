"use client";

import { useState } from "react";
import { MantineProvider, createTheme } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const theme = createTheme({
  primaryColor: "gray",
  defaultRadius: "sm",
  fontFamily: 'Arial, "Microsoft YaHei", "PingFang SC", sans-serif',
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: false, refetchOnWindowFocus: false },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} forceColorScheme="light">
        {children}
      </MantineProvider>
    </QueryClientProvider>
  );
}
