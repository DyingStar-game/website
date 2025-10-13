import * as React from "react";

import { cn } from "@lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xs text-sm leading-7 font-light whitespace-nowrap uppercase transition-all outline-none focus-visible:border-ring focus-visible:ring focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-base lg:w-auto xl:leading-8 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0",
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
          "border:transparent border-background bg-background text-foreground hover:border-background-3 hover:bg-linear-to-br hover:from-background-1 hover:to-background-3 hover:text-foreground",
        success: "bg-success text-success-foreground hover:bg-success/90",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90",
        filter:
          "group h-13 rounded-md border border-input bg-transparent text-muted-foreground hover:border-foreground hover:bg-white/10 [&.active]:bg-foreground [&.active]:text-background",
      },
      size: {
        default:
          "px-6 py-2 has-[>svg:not(:only-child)]:p-3 [&_svg:not([class*='size-'])]:size-5 xl:[&_svg:not([class*='size-'])]:size-6",
        sm: "px-5 py-2 leading-none has-[>svg]:px-5",
        lg: "px-8 py-5 text-base has-[>svg:not(:only-child)]:px-6 2xl:px-10 2xl:py-6 2xl:text-xl 2xl:has-[>svg:not(:only-child)]:px-6",
        xl: "gap-4 rounded px-5 py-5 text-2xl font-extralight sm:text-3xl md:text-4xl lg:px-10 lg:py-6 lg:text-5xl lg:has-[>svg]:px-4 [&_svg:not([class*='size-'])]:size-8 md:[&_svg:not([class*='size-'])]:size-9 lg:[&_svg:not([class*='size-'])]:size-12",
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

const Button = ({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
};

export { Button, buttonVariants };
