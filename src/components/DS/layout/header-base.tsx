//TODO: Remove use client when auth is implemented
"use client";

import { Button } from "@ui/button";
import type { PropsWithChildren } from "react";

export function HeaderBase({ children }: PropsWithChildren) {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between px-4">
      <nav className="absolute top-1/2 left-1/2 mx-auto flex -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-2 px-4 uppercase">
        {children}
      </nav>
      <div className="ml-auto">
        <Button size="icon" onClick={() => alert("Todo wait for auth tasks")}>
          Auth
        </Button>
      </div>
    </header>
  );
}
