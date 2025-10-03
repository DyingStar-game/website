import * as React from "react";

import { cn } from "@lib/utils";

type InputProps = React.ComponentProps<"input"> & {
  icon?: React.ReactNode;
};

function Input({ className, type, icon, ...props }: InputProps) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute flex h-full w-12 items-center justify-center">
          {icon}
        </div>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          "flex w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-base leading-9 shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
          className,
          icon && "pl-12",
        )}
        {...props}
      />
    </div>
  );
}

export { Input };
