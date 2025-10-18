"use client";

import dynamic from "next/dynamic";

export const GlobalDialogLazy = dynamic(
  async () =>
    import("@feat/global-dialog/globalDialog").then((mod) => ({
      default: mod.GlobalDialog,
    })),
  { ssr: false },
);
