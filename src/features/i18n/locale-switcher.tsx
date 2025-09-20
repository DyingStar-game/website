import { useLocale, useTranslations } from "next-intl";
import { routing } from "@i18n/routing";
import LocaleSwitcherSelect from "@feat/i18n/locale-switcher-select";

export default function LocaleSwitcher() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect defaultValue={locale} label={t("label")}>
      {routing.locales.map((cur: string) => (
        <option key={cur} value={cur}>
          {cur}
        </option>
      ))}
    </LocaleSwitcherSelect>
  );
}
