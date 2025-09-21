"use client";

import { Toaster } from "@components/ui/sonner";
import { DialogManagerRenderer } from "@feat/dialog-manager/dialog-manager-renderer";
import { GlobalDialogLazy } from "@feat/global-dialog/global-dialog-lazy";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import type { PropsWithChildren } from "react";

const queryClient = new QueryClient();

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <DialogManagerRenderer />
        <GlobalDialogLazy />
        {children}
        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </ThemeProvider>
  );
};
