import type { ComponentProps } from "react";

import { cn } from "@lib/utils";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { useFormatter } from "next-intl";

type CountInfoProps = ComponentProps<"div"> & {
  icon?: IconName;
  title: string;
  count: number;
};

const CountInfo = ({
  icon,
  title,
  count,
  className,
  ...props
}: CountInfoProps) => {
  const format = useFormatter();
  return (
    <div
      {...props}
      className={cn(
        "flex items-center gap-4 overflow-hidden rounded-md border-2 border-foreground bg-foreground",
        className,
      )}
    >
      <div className="inline-flex flex-1 items-center justify-start gap-2 overflow-hidden py-2 pl-2 text-xl font-medium text-background">
        {icon && <DynamicIcon name={icon} className="size-10 shrink-0" />}
        <span className="truncate">{title}</span>
      </div>
      <div className="flex min-w-43 items-center justify-center rounded-sm bg-background p-4 text-3xl font-extrabold text-foreground md:min-w-28">
        {format.number(count)}
      </div>
    </div>
  );
};

export default CountInfo;
