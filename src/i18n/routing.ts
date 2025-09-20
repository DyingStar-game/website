import { defineRouting } from "next-intl/routing";
import { AVAILABLE_LOCALES, DEFAULT_LOCALE, LOCALE_COOKIE_NAME } from "i18n";

export const routing = defineRouting({
  locales: AVAILABLE_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "as-needed",
  localeCookie: {
    // Custom cookie name
    name: LOCALE_COOKIE_NAME,
    // Expire in one year
    maxAge: 60 * 60 * 24 * 365,
  },
});
