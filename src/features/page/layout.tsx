import { Typography } from "@components/DS/typography";
import { cn } from "@lib/utils";
import type { ComponentPropsWithoutRef } from "react";

export const Layout = (
  props: ComponentPropsWithoutRef<"div"> & {
    size?: "sm" | "default" | "lg" | "xl" | "full";
  },
) => {
  return (
    <div
      {...props}
      className={cn(
        "m-auto mt-4 flex w-full max-w-4xl flex-wrap gap-4 px-4",
        {
          "max-w-[1400px]": props.size === "xl",
          "max-w-7xl": props.size === "lg",
          "max-w-3xl": props.size === "sm",
          "max-w-full": props.size === "full",
        },
        props.className,
      )}
    />
  );
};

export const LayoutHeader = (props: ComponentPropsWithoutRef<"div">) => {
  return (
    <div
      {...props}
      className={cn(
        "flex w-full min-w-[200px] flex-col items-start gap-2 md:flex-1",
        props.className,
      )}
    />
  );
};

export const LayoutTitle = (props: ComponentPropsWithoutRef<"h1">) => {
  return <Typography {...props} variant="h2" className={cn(props.className)} />;
};

export const LayoutDescription = (props: ComponentPropsWithoutRef<"p">) => {
  return <Typography {...props} className={cn(props.className)} />;
};

export const LayoutActions = (props: ComponentPropsWithoutRef<"div">) => {
  return (
    <div {...props} className={cn("flex items-center", props.className)} />
  );
};

export const LayoutContent = (props: ComponentPropsWithoutRef<"div">) => {
  return <div {...props} className={cn("w-full", props.className)} />;
};
