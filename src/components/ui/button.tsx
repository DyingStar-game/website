import * as React from "react";

import { cn } from "@lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";

const buttonVariants = cva(
  "uppercase focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xs text-sm outline-none transition-all focus-visible:ring disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer font-light w-full lg:w-auto",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 focus-visible:ring-primary",
        destructive:
          "bg-destructive shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 text-white",
        outline:
          "hover:bg-foreground/25 border border-foreground text-foreground",
        outlineWhite: "hover:bg-white/25 border border-white text-white",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "border border-transparent hover:border-primary [&.active]:bg-foreground [&.active]:text-background font-light",
        link: "text-primary underline-offset-4 hover:underline",
        invert:
          "bg-background text-foreground hover:bg-background/25 hover:text-background border border:transparent hover:border-background",
        success: "bg-success text-success-foreground hover:bg-success/90",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90",
      },
      size: {
        default: "px-6 py-2 has-[>svg]:px-6 leading-9",
        sm: "px-5 py-2 has-[>svg]:px-5",
        lg: "py-6 px-10 has-[>svg]:px-6 has-[>svg]:py-8 text-2xl leading-9",
        xl: "py-6 px-10 has-[>svg]:px-4 text-5xl font-extralight rounded",
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
