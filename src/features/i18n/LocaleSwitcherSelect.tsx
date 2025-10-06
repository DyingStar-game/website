"use client";

import { useTransition } from "react";

import type { Locale } from "@i18n/config";
import { usePathname, useRouter } from "@i18n/navigation";
import { cn } from "@lib/utils";
import * as SelectPrimitive from "@radix-ui/react-select";
import { buttonVariants } from "@ui/button";
import { Select, SelectContent, SelectItem } from "@ui/select";
import type { VariantProps } from "class-variance-authority";
import { LanguagesIcon, LoaderCircle } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";

export type LocaleSwitcherSelectProps = VariantProps<typeof buttonVariants> & {
  defaultValue: string;
  items: LocaleSwitcherSelectItemsType[];
  label: string;
  className?: string;
};

export type LocaleSwitcherSelectItemsType = { value: string; label: string };

export const LocaleSwitcherSelect = ({
  defaultValue,
  items,
  label,
  className,
  size,
}: LocaleSwitcherSelectProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();

  function onChange(value: string) {
    const locale = value as Locale;
    startTransition(() => {
      const currentSearchParams = new URLSearchParams(searchParams.toString());
      const searchString = currentSearchParams.toString();

      const urlWithParams = searchString
        ? `${pathname}?${searchString}`
        : pathname;

      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname: urlWithParams, params },
        { locale },
      );
    });
  }

  return (
    <Select
      onValueChange={onChange}
      defaultValue={defaultValue}
      disabled={isPending}
    >
      <SelectPrimitive.Trigger
        className={cn(buttonVariants({ variant: "ghost", size, className }))}
      >
        {isPending ? (
          <LoaderCircle className="size-6 animate-spin" aria-label={label} />
        ) : (
          <>
            <span className="sr-only">{label}</span>
            <LanguagesIcon />
          </>
        )}
      </SelectPrimitive.Trigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
