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
        "border-foreground bg-foreground flex items-center gap-4 overflow-hidden rounded-md border-2",
        className,
      )}
      {...props}
    >
      <div className="text-background inline-flex flex-1 items-center justify-start gap-2 overflow-hidden py-2 pl-2 text-base font-medium sm:text-xl">
        {icon && (
          <DynamicIcon name={icon} className="size-8 shrink-0 sm:size-10" />
        )}
        <span className="truncate">{title}</span>
      </div>

      <div className="bg-background text-foreground flex min-w-24 items-center justify-center rounded-sm p-4 text-xl font-extrabold sm:text-3xl md:min-w-28">
        {count ? (
          format.number(count)
        ) : (
          <span className="bg-foreground/20 h-7 w-full animate-pulse rounded-md sm:h-9" />
        )}
      </div>
    </div>
  );
};
