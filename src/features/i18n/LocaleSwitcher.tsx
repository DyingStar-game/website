import { routing } from "@i18n/routing";
import { useLocale, useTranslations } from "next-intl";

import type { LocaleSwitcherSelectItemsType } from "./LocaleSwitcherSelect";
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

  return (
    <LocaleSwitcherSelect
      className={className}
      defaultValue={locale}
      items={items}
      label={t("label")}
    />
  );
}
