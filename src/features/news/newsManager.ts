import { routing } from "@i18n/routing";
import fm from "front-matter";
import fs from "fs/promises";
import type { Locale } from "next-intl";
import path from "path";
import { z } from "zod";

const NewsAttributeSchema = z.object({
  title: z.string(),
  titleIcon: z.string().optional(),
  category: z.string(),
  description: z.string(),
  keywords: z.array(z.string()),
  coverUrl: z.string(),
  tags: z.array(z.string()).max(5),
  date: z.date(),
  author: z.string(),
  authorRoles: z.array(z.string()),
});

type NewsAttributes = z.infer<typeof NewsAttributeSchema>;

export type News = {
  slug: string;
  attributes: NewsAttributes;
  content: string;
  nextSlug?: string;
  previousSlug?: string;
};

export const getNews = async (
  locale: Locale,
  tags?: string[],
): Promise<News[]> => {
  const newsLocalizedDirectory = path.join(
    process.cwd(),
    "content",
    locale,
    "news",
  );
  const fileNames = await fs.readdir(newsLocalizedDirectory);
  const news: News[] = [];
  for await (const fileName of fileNames) {
    const fullPath = path.join(newsLocalizedDirectory, fileName);
    const fileContents = await fs.readFile(fullPath, "utf8");

    const matter = fm(fileContents);

    const result = NewsAttributeSchema.safeParse(matter.attributes);

    if (!result.success) {
      continue;
    }

    if (tags) {
      if (!result.data.tags.some((tag) => tags.includes(tag))) {
        continue;
      }
    }

    news.push({
      slug: fileName.replace(".mdx", ""),
      content: matter.body,
      attributes: {
        ...result.data,
      },
    });
  }

  // Sort by date
  news.sort(
    (a, b) => b.attributes.date.getTime() - a.attributes.date.getTime(),
  );

  // Next/Previous slug news
  return news.map((item, index) => {
    return {
      ...item,
      previousSlug: index > 0 ? news[index - 1].slug : undefined,
      nextSlug: index < news.length - 1 ? news[index + 1].slug : undefined,
    };
  });
};

export type PaginatedNews = {
  news: News[];
  pagination: {
    totalPages: number;
    currentPage: number;
    nextPage?: number;
    previousPage?: number;
  };
};

export const getPaginatedNews = async (
  locale: Locale,
  tags?: string[],
  page = 1,
  pageSize = 5,
): Promise<PaginatedNews> => {
  const news = await getNews(locale, tags);

  // Paginate
  const totalItems = news.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const currentPage = Math.min(Math.max(page, 1), totalPages); // clamp
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedNews = news.slice(startIndex, endIndex);

  return {
    news: paginatedNews,
    pagination: {
      totalPages,
      currentPage,
      previousPage: currentPage > 1 ? currentPage - 1 : undefined,
      nextPage: currentPage < totalPages ? currentPage + 1 : undefined,
    },
  };
};

export const getNewsTags = async (locale: Locale) => {
  const news = await getNews(locale);
  const tags = new Set<string>();
  for (const currentNews of news) {
    if (currentNews.attributes.tags.length === 0) {
      continue;
    }
    for (const tag of currentNews.attributes.tags) {
      tags.add(tag);
    }
  }
  return Array.from(tags);
};

export const getCurrentNews = async (slug: string, locale: Locale) => {
  const findNews = await findNewsByLocale(slug, locale);

  if (!findNews) {
    const fallBackFindNews = await findNewsByLocale(
      slug,
      routing.defaultLocale,
    );
    return fallBackFindNews;
  }

  return findNews;
};

const findNewsByLocale = async (slug: string, locale: Locale) => {
  const news = await getNews(locale);

  return news.find((p) => p.slug === slug);
};

export const getLastNews = async (
  locale: Locale,
  limit = 5,
  tags?: string[],
) => {
  const news = await getNews(locale, tags);

  if (news.length === 0) return [];

  return news
    .sort((a, b) => b.attributes.date.getTime() - a.attributes.date.getTime())
    .slice(0, limit);
};

export const getLatestNews = async (locale: Locale, tags?: string[]) => {
  const news = await getLastNews(locale, 1, tags);
  return news.length > 0 ? news[0] : null;
};
