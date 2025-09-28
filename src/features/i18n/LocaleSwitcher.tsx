import { Suspense } from "react";

import { routing } from "@i18n/routing";
import { cn } from "@lib/utils";
import * as SelectPrimitive from "@radix-ui/react-select";
import { buttonVariants } from "@ui/button";
import { Select } from "@ui/select";
import { LoaderCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import type {
  LocaleSwitcherSelectItemsType,
  LocaleSwitcherSelectProps,
} from "./LocaleSwitcherSelect";
import LocaleSwitcherSelect from "./LocaleSwitcherSelect";

type LocaleSwitcherProps = {
  className?: string;
};

export default function LocaleSwitcher({ className }: LocaleSwitcherProps) {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();

  const items: LocaleSwitcherSelectItemsType[] = routing.locales.map(
    (locale) => ({
      value: locale,
      label: t(locale),
    }),
  );

  const commonProps = {
    className,
    defaultValue: locale,
    items,
    label: t("label"),
  };

  return (
    <Suspense fallback={<LocaleSwitcherFallback {...commonProps} />}>
      <LocaleSwitcherSelect {...commonProps} />
    </Suspense>
  );
}

function LocaleSwitcherFallback({
  label,
  className,
}: LocaleSwitcherSelectProps) {
  return (
    <div className={className}>
      <Select disabled>
        <SelectPrimitive.Trigger
          className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
        >
          <LoaderCircle className="size-6 animate-spin" aria-label={label} />
        </SelectPrimitive.Trigger>
      </Select>
    </div>
  );
}
