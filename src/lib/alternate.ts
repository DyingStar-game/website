import { LINKS } from "@feat/navigation/Links";
import type { News } from "@feat/news/newsManager";
import type { Locale } from "@i18n/config";
import { DEFAULT_LOCALE, LOCALES } from "@i18n/config";

import { createLocalizedUrl } from "./serverUrl";

export type Languages = Partial<Record<Locale | "x-default", string>>;

export const alternateLanguages = (path: string): Languages => {
  const alternatesLanguages: Languages = {} as Languages;
  LOCALES.forEach((locale) => {
    alternatesLanguages[locale] = createLocalizedUrl(locale, path);
  });
  alternatesLanguages["x-default"] = createLocalizedUrl(DEFAULT_LOCALE, path);

  return alternatesLanguages;
};

export const alternatesLanguagesNewsDetail = (
  locale: Locale,
  news: News,
): Languages => {
  const alternatesLanguages: Languages = {} as Languages;

  const addAlternateLanguage = (currentLocale: Locale, slug: string) => {
    const localizedNews = createLocalizedUrl(
      currentLocale,
      LINKS.News.Detail.href({ newsSlug: slug }),
    );
    alternatesLanguages[currentLocale] = localizedNews;

    if (currentLocale === DEFAULT_LOCALE) {
      alternatesLanguages["x-default"] = localizedNews;
    }
  };

  addAlternateLanguage(locale, news.slug);

  Object.entries(news.attributes.alternates).forEach(
    ([alternateLocale, alternate]) => {
      addAlternateLanguage(alternateLocale as Locale, alternate);
    },
  );

  return alternatesLanguages;
};
