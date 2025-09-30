import { DEFAULT_LOCALE } from "@i18n/config";
import type { Locale } from "next-intl";

/**
 * This method return the server URL based on the environment.
 */
export const getServerUrl = (locale: Locale = DEFAULT_LOCALE): string => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  const host =
    process.env.NEXT_ENV === "production"
      ? (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dyingstar-game.com")
      : "http://localhost:3000";

  return locale === DEFAULT_LOCALE ? host : `${host}/${locale}`;
};

export const createLocalizedUrl = (locale: Locale, path?: string) => {
  return `${getServerUrl(locale)}${path ?? ""}`;
};
