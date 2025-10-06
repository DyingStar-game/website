"use client";

import { type PropsWithChildren } from "react";

import { Toaster } from "@components/ui/sonner";
import { DialogManagerRenderer } from "@feat/dialog-manager/dialog-manager-renderer";
import { GlobalDialogLazy } from "@feat/global-dialog/global-dialog-lazy";
import { getQueryClient } from "@lib/tanstack/getQueryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";

export const Providers = ({ children }: PropsWithChildren) => {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();

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
