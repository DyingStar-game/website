import { getNews } from "@feat/news/news-manager";
import { DEFAULT_LOCALE, LOCALES } from "@i18n/config";
import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dyingstar-game.com";

type SitemapEntry = MetadataRoute.Sitemap[number];

const createLocalizedUrl = (path: string, locale: string): string => {
  return locale === DEFAULT_LOCALE
    ? `${BASE_URL}${path}`
    : `${BASE_URL}/${locale}${path}`;
};

const createSitemapEntry = (
  url: string,
  lastModified: Date,
  changeFrequency: "monthly" | "weekly" | "daily" = "monthly",
): SitemapEntry => ({
  url,
  lastModified,
  changeFrequency,
});

const generateHomePageEntries = (): SitemapEntry[] => {
  return LOCALES.map((locale) =>
    createSitemapEntry(createLocalizedUrl("", locale), new Date()),
  );
};

const generateNewsEntries = async (locale: string): Promise<SitemapEntry[]> => {
  const news = await getNews(locale);

  return news.map((post) =>
    createSitemapEntry(
      createLocalizedUrl(`/news/${post.slug}`, locale),
      post.attributes.date,
    ),
  );
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const homepageEntries = generateHomePageEntries();
  const newsEntries = await Promise.all(
    LOCALES.map(async (locale) => generateNewsEntries(locale)),
  );

  return [...homepageEntries, ...newsEntries.flat()];
}
