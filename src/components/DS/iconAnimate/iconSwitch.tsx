import type { ComponentProps } from "react";

import IconFadeAnimate from "@components/DS/iconAnimate/iconFadeAnimate";
import { cn } from "@lib/utils";
import type { IconName } from "lucide-react/dynamic";

type IconSwitchProps = ComponentProps<"div"> & {
  icon: IconName;
  switchIcon: IconName;
  isSwitch: boolean;
};

const IconSwitch = ({
  icon,
  switchIcon,
  isSwitch,
  className,
  ...props
}: IconSwitchProps) => {
  return (
    <div className={cn("relative size-6", className)} {...props}>
      <IconFadeAnimate
        name={icon}
        animation={isSwitch ? "fadeOut" : "fadeIn"}
        className="absolute inset-0 hover:cursor-pointer"
      />
      <IconFadeAnimate
        name={switchIcon}
        animation={isSwitch ? "fadeIn" : "fadeOut"}
        className="absolute inset-0 hover:cursor-pointer"
      />
    </div>
  );
};

export default IconSwitch;
