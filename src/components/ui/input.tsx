import * as React from "react";

import { cn } from "@lib/utils";

type InputProps = React.ComponentProps<"input"> & {
  icon?: React.ReactNode;
};

const Input = ({ className, type, icon, ...props }: InputProps) => {
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
          "h-13 border-input shadow-xs selection:bg-primary selection:text-primary-foreground file:text-foreground placeholder:text-muted-foreground dark:bg-input/30 flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
          className,
          icon && "pl-12",
        )}
        {...props}
      />
    </div>
  );
};

export { Input };
