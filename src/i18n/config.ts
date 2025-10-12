export type Locale = (typeof LOCALES)[number];

export const LOCALES = ["en", "fr"] as const;
export const DEFAULT_LOCALE: Locale = "en";
