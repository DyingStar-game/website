//TODO: Remove use client when auth is implemented
"use client";

import { Button } from "@ui/button";
import { type PropsWithChildren } from "react";

export function HeaderBase({ children }: PropsWithChildren) {
  return (
    <header
      className={
        "from-background/90 to-background/20 sticky inset-x-0 top-0 z-50 flex h-30 items-center justify-center bg-gradient-to-b px-4 shadow-md backdrop-blur"
      }
    >
      <div className="flex-1" />
      <nav className="flex flex-1 items-center justify-center gap-6 uppercase">
        {children}
      </nav>
      <div className="flex flex-1 justify-end">
        <Button
          variant="ghost"
          size="lg"
          onClick={() => alert("Todo wait for auth tasks")}
        >
          Auth
        </Button>
      </div>
    </header>
  );
}

