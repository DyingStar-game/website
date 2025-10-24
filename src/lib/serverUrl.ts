import { DEFAULT_LOCALE } from "@i18n/config";
import type { Locale } from "next-intl";

const hostUrl =
  process.env.NODE_ENV === "production"
    ? (process.env.NEXT_PUBLIC_SITE_URL ?? "https://dyingstar-game.com")
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

export const createLocalizedUrl = (
  locale: Locale,
  path?: string,
  queryParams?: Record<string, string | number>,
) => {
  let url = `${getServerUrl(locale)}${path ?? ""}`;
  if (queryParams && Object.keys(queryParams).length > 0) {
    // Conversion des valeurs en string :
    const stringParams: Record<string, string> = {};
    for (const [key, value] of Object.entries(queryParams)) {
      stringParams[key] = String(value);
    }
    const search = new URLSearchParams(stringParams).toString();
    url += `?${search}`;
  }
  return url;
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
