import fm from "front-matter";
import fs from "fs/promises";
import path from "path";
import { z } from "zod";

const newsDirectory = path.join(process.cwd(), "content/news");

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
};

/** TODO : Update with i18n (locale) */
export const getNews = async (locale: "en" | "fr" = "en", tags?: string[]) => {
  const newsLocalizedDirectory = path.join(newsDirectory, locale);
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

  return news;
};

export const getNewsTags = async () => {
  const news = await getNews();
  const tags = new Set<string>();
  for (const post of news) {
    if (post.attributes.tags.length === 0) {
      continue;
    }
    for (const tag of post.attributes.tags) {
      tags.add(tag);
    }
  }
  return Array.from(tags);
};

export const getCurrentNews = async (
  slug: string,
  locale: "en" | "fr" = "en",
) => {
  const findNews = await findNewsByLocale(slug, locale);

  if (!findNews) {
    const fallBackFindNews = await findNewsByLocale(
      slug,
      "en",
    ); /** TODO: Change with fallback i18n config */
    return fallBackFindNews;
  }

  return findNews;
};

const findNewsByLocale = async (slug: string, locale: "en" | "fr" = "en") => {
  const news = await getNews(locale);

  return news.find((p) => p.slug === slug);
};

export const getLastNews = async (
  limit = 5,
  locale: "en" | "fr" = "en",
  tags?: string[],
) => {
  const news = await getNews(locale, tags);

  if (news.length === 0) return [];

  return news
    .sort((a, b) => b.attributes.date.getTime() - a.attributes.date.getTime())
    .slice(0, limit);
};

export const getLatestNews = async (
  locale: "en" | "fr" = "en",
  tags?: string[],
) => {
  const news = await getLastNews(1, locale, tags);
  return news.length > 0 ? news[0] : null;
};
