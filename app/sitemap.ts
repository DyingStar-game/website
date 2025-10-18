import { LINKS } from "@feat/navigation/Links";
import { getNews } from "@feat/news/newsManager";
import { DEFAULT_LOCALE, LOCALES } from "@i18n/config";
import { createLocalizedUrl } from "@lib/serverUrl";
import type { MetadataRoute } from "next";

type SitemapEntry = MetadataRoute.Sitemap[number];

const createSitemapEntry = (
  url: string,
  lastModified: Date | string = new Date(),
  changeFrequency: "monthly" | "weekly" | "daily" = "monthly",
  alternatesLanguages?: Record<string, string>,
): SitemapEntry => {
  return {
    url,
    lastModified,
    changeFrequency,
    ...(alternatesLanguages && {
      alternates: {
        languages: alternatesLanguages,
      },
    }),
  };
};

const createSitemapEntries = (
  path: string,
  lastModified: Date | string = new Date(),
  changeFrequency: "monthly" | "weekly" | "daily" = "monthly",
): SitemapEntry[] => {
  // Create alternates entries
  const alternatesLanguages: Record<string, string> = {};
  LOCALES.forEach((locale) => {
    alternatesLanguages[locale] = createLocalizedUrl(locale, path);
  });
  alternatesLanguages["x-default"] = createLocalizedUrl(DEFAULT_LOCALE, path);

  return LOCALES.map((locale) =>
    createSitemapEntry(
      createLocalizedUrl(locale, path),
      lastModified,
      changeFrequency,
      alternatesLanguages,
    ),
  );
};

const generateHomePageEntries = (): SitemapEntry[] => {
  return createSitemapEntries(LINKS.Landing.Landing.href());
};

const generateNewsPageEntries = (): SitemapEntry[] => {
  return createSitemapEntries(LINKS.News.All.href());
};

const generateNewsDetailPageEntries = async (): Promise<SitemapEntry[][]> => {
  const allNews = LOCALES.map(async (locale) => {
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
  });

  return Promise.all(allNews);
};

const generateContributePageEntries = (): SitemapEntry[] => {
  return createSitemapEntries(
    LINKS.Project.Contribute.href(),
    new Date(),
    "daily",
  );
};

const generateProjectPageEntries = (): SitemapEntry[] => {
  return createSitemapEntries(LINKS.Project.Project.href());
};

const generatePrivacyPageEntries = (): SitemapEntry[] => {
  return createSitemapEntries(LINKS.Legal.privacy.href());
};

const generateTermsPageEntries = (): SitemapEntry[] => {
  return createSitemapEntries(LINKS.Legal.terms.href());
};

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const homepageEntries = generateHomePageEntries();
  const projectPageEntries = generateProjectPageEntries();
  const contributePageEntries = generateContributePageEntries();
  const newsPageEntries = generateNewsPageEntries();
  const newsDetailPageEntries = await generateNewsDetailPageEntries();
  const privacyPageEntries = generatePrivacyPageEntries();
  const termsPageEntries = generateTermsPageEntries();

  return [
    ...homepageEntries,
    ...projectPageEntries,
    ...contributePageEntries,
    ...newsPageEntries,
    ...newsDetailPageEntries.flat(),
    ...privacyPageEntries,
    ...termsPageEntries,
  ];
};

export default sitemap;
