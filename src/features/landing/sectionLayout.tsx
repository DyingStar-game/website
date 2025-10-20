import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@lib/utils";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

const sectionLayoutContainerVariants = cva("", {
  variants: {
    variant: {
      default: "bg-background text-foreground",
      card: "bg-card text-card-foreground",
      primary: "bg-primary text-primary-foreground",
      invert: "bg-foreground text-background",
      image: "text-foreground backdrop-blur-sm backdrop-brightness-75",
      transparent: "text-foreground bg-transparent",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const sectionLayoutVariants = cva("", {
  variants: {
    size: {
      xs: "max-w-3xl",
      sm: "max-w-4xl",
      base: "max-w-5xl",
      lg: "max-w-6xl",
      full: "max-w-full",
    },
  },
  defaultVariants: {
    size: "base",
  },
});

export type SectionLayoutProps = ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof sectionLayoutContainerVariants> &
  VariantProps<typeof sectionLayoutVariants> & {
    containerClassName?: string;
  };

export const SectionLayout = ({
  className,
  containerClassName,
  variant,
  size,
  children,
  ...props
}: SectionLayoutProps) => {
  return (
    <div
      className={cn(
        sectionLayoutContainerVariants({ variant }),
        containerClassName,
      )}
      {...props}
    >
      <div
        className={cn(
          "lg:py-22 m-auto px-4 py-20",
          sectionLayoutVariants({ size }),
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
};
