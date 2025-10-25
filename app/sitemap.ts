import { LINKS } from "@feat/navigation/Links";
import { getNews } from "@feat/news/newsManager";
import { LOCALES } from "@i18n/config";
import {
  alternateLanguages,
  alternatesLanguagesNewsDetail,
} from "@lib/alternate";
import { createLocalizedUrl } from "@lib/serverUrl";
import type { MetadataRoute } from "next";
import type { Languages } from "next/dist/lib/metadata/types/alternative-urls-types";

type SitemapEntry = MetadataRoute.Sitemap[number];

const createSitemapEntry = (
  url: string,
  lastModified: Date | string = new Date(),
  changeFrequency: "monthly" | "weekly" | "daily" = "monthly",
  alternatesLanguages?: Languages<string>,
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
  return LOCALES.map((locale) =>
    createSitemapEntry(
      createLocalizedUrl(locale, path),
      lastModified,
      changeFrequency,
      alternateLanguages(path),
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
        "monthly",
        alternatesLanguagesNewsDetail(locale, news),
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
