import * as React from "react";

import { cn } from "@lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xs text-base font-light whitespace-nowrap uppercase transition-all outline-none focus-visible:border-ring focus-visible:ring focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 lg:w-auto dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 focus-visible:ring-primary",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
        outline:
          "border border-foreground text-foreground hover:bg-foreground/25",
        outlineWhite:
          "border border-white text-white hover:bg-white/25 [&.active]:bg-white/25",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "border border-transparent font-light hover:border-primary [&.active]:bg-foreground [&.active]:text-background",
        link: "text-primary underline-offset-4 hover:underline",
        invert:
          "border:transparent border bg-background text-foreground hover:border-background hover:bg-background/25 hover:text-background",
        success: "bg-success text-success-foreground hover:bg-success/90",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90",
        search:
          "group rounded-md border border-input bg-transparent text-muted-foreground hover:border-foreground hover:bg-white/10 [&.active]:bg-foreground [&.active]:text-background",
      },
      size: {
        default:
          "px-6 py-2 leading-9 has-[>svg:not(:only-child)]:p-3 lg:has-[>svg:not(:only-child)]:p-2.5 [&_svg:not([class*='size-'])]:size-7 lg:[&_svg:not([class*='size-'])]:size-8",
        sm: "px-5 py-2 has-[>svg]:px-5",
        lg: "px-8 py-5 text-lg leading-9 has-[>svg]:px-6 has-[>svg]:py-8 xl:px-10 xl:py-6 xl:text-2xl",
        xl: "gap-4 rounded px-5 py-5 text-3xl font-extralight md:text-4xl lg:px-10 lg:py-6 lg:text-5xl lg:has-[>svg]:px-4 [&_svg:not([class*='size-'])]:size-8 md:[&_svg:not([class*='size-'])]:size-9 lg:[&_svg:not([class*='size-'])]:size-12",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
