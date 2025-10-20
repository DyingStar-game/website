"use client";

import type { ComponentProps } from "react";

import { useIsClient } from "@hooks/useIsClient";
import { cn } from "@lib/utils";
import { type VariantProps, cva } from "class-variance-authority";

const keyboardShortcutVariants = cva(
  "bg-accent inline-flex items-center justify-center rounded border-y border-b-gray-200 border-t-white px-1.5 font-sans text-[11px] text-gray-800 ring-1 ring-gray-300 dark:border-b-gray-950 dark:border-t-transparent dark:text-white dark:ring-white/15",
  {
    variants: {
      size: {
        sm: "h-4 px-1 text-xs font-medium",
        default: "h-5 min-w-5",
        lg: "h-6 px-2 text-sm font-medium",
      },
      isKeyDown: {
        true: "bg-accent translate-y-0.5 shadow-none",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);
export type KeyboardShortcutProps = ComponentProps<"kbd"> &
  VariantProps<typeof keyboardShortcutVariants> & {
    eventKey?: string;
  };

export const KeyboardShortcut = ({
  children,
  size,
  eventKey,
  ref,
  ...props
}: KeyboardShortcutProps) => {
  return (
    <kbd
      ref={ref}
      {...props}
      className={cn(
        keyboardShortcutVariants({
          size,
          className: props.className,
        }),
      )}
    >
      {children}
    </kbd>
  );
};

export const CmdOrOption = () => {
  const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const isClient = useIsClient();

  if (!isClient) return "⌘";

  if (userAgent.includes("Mac OS X")) {
    return "⌘";
  }

  return "Ctrl";
};
