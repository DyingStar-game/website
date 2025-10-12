"use client";

import type { PropsWithChildren } from "react";

import { Dialog } from "@components/ui/dialog";
import { useRouter } from "next/navigation";

export const InterceptDialog = ({ children }: PropsWithChildren) => {
  const router = useRouter();

  return (
    <Dialog
      defaultOpen={true}
      onOpenChange={() => {
        router.back();
      }}
    >
      {children}
    </Dialog>
  );
};
