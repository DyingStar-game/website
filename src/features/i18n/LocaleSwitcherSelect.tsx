"use client";

import { useTransition } from "react";

import type { Locale } from "@i18n/config";
import { usePathname, useRouter } from "@i18n/navigation";
import { cn } from "@lib/utils";
import * as SelectPrimitive from "@radix-ui/react-select";
import { buttonVariants } from "@ui/button";
import { Select, SelectContent, SelectItem } from "@ui/select";
import { LanguagesIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useParams } from "next/navigation";

export type LocaleSwitcherSelectProps = {
  defaultValue: string;
  items: LocaleSwitcherSelectItemsType[];
  label: string;
  className?: string;
};

export type LocaleSwitcherSelectItemsType = { value: string; label: string };

export default function LocaleSwitcherSelect({
  defaultValue,
  items,
  label,
  className,
}: LocaleSwitcherSelectProps) {
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
    <div className={className}>
      <Select
        onValueChange={onChange}
        defaultValue={defaultValue}
        disabled={isPending}
      >
        <SelectPrimitive.Trigger
          className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
        >
          <LanguagesIcon className="size-6" aria-label={label} />
        </SelectPrimitive.Trigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
