import type { ComponentProps } from "react";

import { cn } from "@lib/utils";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { useFormatter } from "next-intl";

type CountInfoProps = ComponentProps<"div"> & {
  icon?: IconName;
  title: string;
  count?: number;
};

export const CountInfo = ({
  icon,
  title,
  count,
  className,
  ...props
}: CountInfoProps) => {
  const format = useFormatter();
  return (
    <div
      className={cn(
        "flex items-center gap-4 overflow-hidden rounded-md border-2 border-foreground bg-foreground",
        className,
      )}
      {...props}
    >
      <div className="inline-flex flex-1 items-center justify-start gap-2 overflow-hidden py-2 pl-2 text-xl font-medium text-background">
        {icon && <DynamicIcon name={icon} className="size-10 shrink-0" />}
        <span className="truncate">{title}</span>
      </div>

      <div className="flex min-w-43 items-center justify-center rounded-sm bg-background p-4 text-3xl font-extrabold text-foreground md:min-w-28">
        {count ? (
          format.number(count)
        ) : (
          <span className="h-9 w-full animate-pulse rounded-md bg-foreground/20" />
        )}
      </div>
    </div>
  );
};
