import type { PaginateModeType } from "@components/DS/paginate/paginate";
import { Link } from "@i18n/navigation";
import { cn } from "@lib/utils";
import { Button, buttonVariants } from "@ui/button";
import type { VariantProps } from "class-variance-authority";
import type { UrlObject } from "url";

type PaginateActionProps = VariantProps<typeof Button> & {
  mode: PaginateModeType;
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  href?: string | UrlObject;
  className?: string;
  prefetch?: boolean;
};

export const PaginateAction = ({
  mode,
  children,
  disabled,
  onClick,
  href,
  variant = "outline",
  size = "default",
  className,
  prefetch,
}: PaginateActionProps) => {
  if (mode === "link" && href) {
    return (
      <Link
        href={href}
        prefetch={prefetch}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        className={cn(
          buttonVariants({ variant, size }),
          disabled && "pointer-events-none opacity-50",
          className,
        )}
      >
        {children}
      </Link>
    );
  }
  return (
    <Button
      variant={variant}
      disabled={disabled}
      onClick={onClick}
      className={className}
      size={size}
    >
      {children}
    </Button>
  );
};
