import { DEFAULT_LOCALE } from "@i18n/config";
import type { Locale } from "next-intl";

const hostUrl =
  process.env.NEXT_ENV === "production"
    ? (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dyingstar-game.com")
    : "http://localhost:3000";

/**
 * This method return the server URL based on the environment.
 */
export const getServerUrl = (locale: Locale = DEFAULT_LOCALE): string => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return locale === DEFAULT_LOCALE ? hostUrl : `${hostUrl}/${locale}`;
};

export const createLocalizedUrl = (locale: Locale, path?: string) => {
  return `${getServerUrl(locale)}${path ?? ""}`;
};

export const getServerDomain = (): string => {
  let host: string;

  if (typeof window !== "undefined") {
    host = window.location.hostname;
  } else {
    host = new URL(hostUrl).hostname;
  }

  return host;
};
