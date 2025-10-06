"use client";

import { Suspense } from "react";

import { routing } from "@i18n/routing";
import { cn } from "@lib/utils";
import * as SelectPrimitive from "@radix-ui/react-select";
import { buttonVariants } from "@ui/button";
import { Select } from "@ui/select";
import type { VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import {
  LocaleSwitcherSelect,
  type LocaleSwitcherSelectItemsType,
  type LocaleSwitcherSelectProps,
} from "./LocaleSwitcherSelect";

type LocaleSwitcherProps = VariantProps<typeof buttonVariants> & {
  className?: string;
};

export const LocaleSwitcher = ({ className, size }: LocaleSwitcherProps) => {
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
      <LocaleSwitcherSelect size={size} {...commonProps} />
    </Suspense>
  );
};

const LocaleSwitcherFallback = ({
  label,
  className,
  size,
}: LocaleSwitcherSelectProps) => {
  return (
    <Select disabled>
      <SelectPrimitive.Trigger
        className={cn(buttonVariants({ variant: "ghost", size, className }))}
      >
        <LoaderCircle className="size-6 animate-spin" aria-label={label} />
      </SelectPrimitive.Trigger>
    </Select>
  );
};
