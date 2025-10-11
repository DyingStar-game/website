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
          ? "scale-75 rotate-45 opacity-0"
          : "scale-100 rotate-0 opacity-100",
      )}
      {...props}
    />
  );
};

export default IconFadeAnimate;
