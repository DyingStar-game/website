import type { ComponentProps } from "react";

import { Typography } from "@components/DS/typography";
import { Layout, LayoutSection } from "@feat/page/layout";
import { Link } from "@i18n/navigation";
import { cn } from "@lib/utils";
import { buttonVariants } from "@ui/button";

type CtaButtonProps = ComponentProps<typeof Link> & {
  label: string;
  icon?: React.ReactNode;
};

export type CtaWithButtonProps = React.ComponentProps<"section"> & {
  title: string;
  action?: CtaButtonProps;
};

export const CtaWithButton = ({
  title,
  action,
  className,
  ...props
}: CtaWithButtonProps) => {
  return (
    <LayoutSection
      className={cn("bg-foreground uppercase", className)}
      {...props}
    >
      <Layout asChild padding="default">
        <div className="flex max-w-4xl flex-col justify-center gap-10 lg:gap-22">
          <Typography
            variant="h2"
            className="text-center text-4xl font-medium text-primary-foreground md:text-5xl lg:text-6xl"
          >
            {title}
          </Typography>
          {action && (
            <Link
              className={cn(buttonVariants({ variant: "invert", size: "xl" }))}
              {...action}
            >
              {action.icon && action.icon}
              {action.label}
            </Link>
          )}
        </div>
      </Layout>
    </LayoutSection>
  );
};
