import * as React from "react";

import { cn } from "@lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-xl border px-4 py-0.5 text-xs leading-5 font-normal whitespace-nowrap uppercase transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-4 md:[&>svg]:size-5",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/70 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        outlineWhite: "border-white text-white",
        category:
          "border-foreground bg-accent text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        easy: "border-easy bg-easy text-white",
        moderate: "border-moderate bg-moderate text-background",
        advance: "border-advance bg-advance text-background",
        expert: "border-expert bg-expert text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean };

function Badge({ className, asChild = false, variant, ...props }: BadgeProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
