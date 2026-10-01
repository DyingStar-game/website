import { cn } from "@lib/utils";

type PulseIndicatorProps = {
  className?: string;
  label?: string;
};

/**
 * Pulsing dot placed on the top-right corner of its (relative) parent
 */
export const PulseIndicator = ({ className, label }: PulseIndicatorProps) => {
  return (
    <span
      data-slot="pulse-indicator"
      className={cn(
        "pointer-events-none absolute -top-1 -right-1 flex size-3",
        className,
      )}
    >
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
      <span className="relative inline-flex size-3 rounded-full bg-primary ring-2 ring-background" />
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
};
