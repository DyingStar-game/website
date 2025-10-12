import { LINKS } from "@feat/navigation/Links";
import { getNews } from "@feat/news/newsManager";
import { LOCALES } from "@i18n/config";
import { createLocalizedUrl } from "@lib/serverUrl";
import type { MetadataRoute } from "next";
import type { Locale } from "next-intl";

type SitemapEntry = MetadataRoute.Sitemap[number];

const createSitemapEntry = (
  url: SitemapEntry["url"],
  lastModified: SitemapEntry["lastModified"],
  changeFrequency: SitemapEntry["changeFrequency"] = "monthly",
): SitemapEntry => ({
  url,
  lastModified,
  changeFrequency,
});

const generateHomePageEntries = (): SitemapEntry[] => {
  return LOCALES.map((locale) =>
    createSitemapEntry(createLocalizedUrl(locale), new Date()),
  );
};

const generateNewsEntries = async (locale: Locale): Promise<SitemapEntry[]> => {
  const news = await getNews(locale);

  return news.map((news) =>
    createSitemapEntry(
      createLocalizedUrl(
        locale,
        LINKS.News.Detail.href({ newsSlug: news.slug }),
      ),
      news.attributes.date,
    ),
  );
};

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const homepageEntries = generateHomePageEntries();
  const newsEntries = await Promise.all(
    LOCALES.map(async (locale) => generateNewsEntries(locale)),
  );

  return [...homepageEntries, ...newsEntries.flat()];
};
export default sitemap;
