import type { ComponentProps } from "react";

import { cn } from "@lib/utils";
import type { IconName } from "lucide-react/dynamic";
import { DynamicIcon } from "lucide-react/dynamic";

type IconFadeAnimateProps = ComponentProps<"svg"> & {
  name: IconName;
  animation: "fadeIn" | "fadeOut";
};

const IconFadeAnimate = ({
  name,
  animation,
  className,
  ...props
}: IconFadeAnimateProps) => {
  return (
    <DynamicIcon
      name={name}
      className={cn(
        "transition-all duration-300 ease-in-out",
        className,
        animation === "fadeOut"
          ? "rotate-45 scale-75 opacity-0"
          : "rotate-0 scale-100 opacity-100",
      )}
      {...props}
    />
  );
};

export default IconFadeAnimate;
