export const AVAILABLE_LOCALES = ["en", "fr"] as const;
export type Locale = (typeof AVAILABLE_LOCALES)[number];

export function isLocale(locale: string): locale is Locale {
  return AVAILABLE_LOCALES.includes(locale as Locale);
}

export function getValidLocale(locale: string | undefined): Locale {
  if (locale && isLocale(locale)) {
    return locale;
  }
  return DEFAULT_LOCALE;
}

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_COOKIE_NAME = "USER_LOCALE";

export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
