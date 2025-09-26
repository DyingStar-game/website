import type { ComponentPropsWithoutRef } from "react";

import { Typography } from "@components/DS/typography";
import { Link } from "@i18n/navigation";
import { cn } from "@lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { buttonVariants } from "@ui/button";
import { type VariantProps, cva } from "class-variance-authority";

const layoutVariants = cva("flex flex-col gap-8", {
  variants: {
    size: {
      container: "container mx-auto px-4",
      full: "w-full",
    },
    padding: {
      default: "py-20 lg:py-22",
      none: "",
    },
  },
  defaultVariants: {
    size: "container",
    padding: "default",
  },
});

type LayoutProps = React.ComponentProps<"div"> &
  VariantProps<typeof layoutVariants> & {
    asChild?: boolean;
  };

export const Layout = ({
  size,
  padding,
  className,
  asChild = false,
  ...props
}: LayoutProps) => {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      data-slot="div"
      className={cn(layoutVariants({ size, padding, className }))}
      {...props}
    />
  );
};

type LayoutMainProps = React.ComponentProps<"main"> &
  VariantProps<typeof layoutVariants>;

export const LayoutMain = ({ className, ...props }: LayoutMainProps) => {
  return (
    <Layout asChild className={className} data-slot="main">
      <main {...props} />
    </Layout>
  );
};

type LayoutSectionProps = React.ComponentProps<"section"> &
  VariantProps<typeof layoutVariants>;

export const LayoutSection = ({ className, ...props }: LayoutSectionProps) => {
  return (
    <Layout
      asChild
      className={className}
      padding={"none"}
      data-slot="section"
      size="full"
    >
      <section {...props} />
    </Layout>
  );
};

type LayoutHeaderProps = React.ComponentProps<"div"> &
  VariantProps<typeof layoutVariants>;

export const LayoutHeader = ({ className, ...props }: LayoutHeaderProps) => {
  return (
    <Layout
      className={className}
      size="full"
      padding={"none"}
      {...props}
      data-slot="header"
    />
  );
};

export const LayoutTitle = (props: ComponentPropsWithoutRef<"h1">) => {
  return <Typography {...props} variant="h1" className={cn(props.className)} />;
};

export type LayoutContentTitleProps = {
  title: string;
  btnTitle?: string;
  href?: string;
  className?: string;
};

export const LayoutContentTitle = ({
  title,
  btnTitle,
  href,
  className,
}: LayoutContentTitleProps) => {
  return (
    <Layout
      className={cn("gap-4 lg:flex-row lg:items-center", className)}
      size="full"
      padding={"none"}
    >
      <Typography
        variant="h2"
        className="flex flex-1 items-center gap-4 overflow-hidden text-6xl font-normal uppercase"
      >
        {title}
      </Typography>

      {btnTitle && href && (
        <Link
          href={href}
          className={buttonVariants({
            variant: "outline",
          })}
        >
          {btnTitle}
        </Link>
      )}
    </Layout>
  );
};
