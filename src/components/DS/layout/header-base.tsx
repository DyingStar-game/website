//TODO: Remove use client when auth is implemented
"use client";

import { cn } from "@lib/utils";
import { Button } from "@ui/button";
import { Menu } from "lucide-react";
import { useState, type PropsWithChildren } from "react";

export function HeaderBase({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header
      className={cn(
        "from-background/90 to-background/20 sticky inset-x-0 top-0 z-50 flex items-start justify-center overflow-hidden bg-gradient-to-b p-4 shadow-md backdrop-blur md:items-center",
        "transition-all duration-300 ease-in-out",
        isOpen ? "max-h-screen" : "max-h-18 md:max-h-30",
      )}
    >
      <div className="visible flex size-10 flex-1 items-center md:invisible">
        <Menu
          className="hover:cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      <nav className="flex flex-1 flex-col items-center justify-start gap-6 uppercase md:flex-row md:justify-center">
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

