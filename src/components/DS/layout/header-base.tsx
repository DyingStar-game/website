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
        "bg-background sticky inset-x-0 top-0 z-50 flex items-start justify-center overflow-hidden p-4 shadow-md lg:items-center lg:p-7",
        "transition-all duration-300 ease-in-out",
        "border-border border-b",
        isOpen ? "max-h-screen" : "max-h-18 lg:max-h-35",
      )}
    >
      <div className="visible flex size-10 flex-1 items-center lg:invisible">
        <Menu
          className="hover:cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      <nav className="flex flex-1 flex-col items-center justify-start gap-4 uppercase lg:flex-row lg:justify-center lg:gap-8">
        {children}
      </nav>
      <div className="flex flex-1 justify-end">
        <Button
          variant="ghost"
          size="lg"
          onClick={() => alert("Todo wait for auth tasks")}
          className="hidden lg:inline"
        >
          Auth
        </Button>
      </div>
    </header>
  );
}
