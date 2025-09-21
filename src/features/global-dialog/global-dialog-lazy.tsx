"use client";

import dynamic from "next/dynamic";

export const GlobalDialogLazy = dynamic(
  async () =>
    import("./global-dialog").then((mod) => ({
      default: mod.GlobalDialog,
    })),
  { ssr: false },
);
