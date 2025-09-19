"use client";

import { Dialog } from "@components/ui/dialog";
import { useRouter } from "next/navigation";
import type { PropsWithChildren } from "react";

export function InterceptDialog({ children }: PropsWithChildren) {
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
}
