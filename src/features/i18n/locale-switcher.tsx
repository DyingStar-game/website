import { useLocale } from "next-intl";
import { routing } from "@i18n/routing";
import LocaleSwitcherSelect from "@feat/i18n/locale-switcher-select";

export default function LocaleSwitcher() {
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect defaultValue={locale}>
      {routing.locales.map((cur: string) => (
        <option key={cur} value={cur}>
          {cur}
        </option>
      ))}
    </LocaleSwitcherSelect>
  );
}
