import fm from "front-matter";
import fs from "fs/promises";
import path from "path";
import { z } from "zod";

const newsDirectory = path.join(process.cwd(), "content/news");

const AttributeSchema = z.object({
  title: z.string(),
  description: z.string(),
  keywords: z.array(z.string()),
  status: z.enum(["draft", "published"]),
  coverUrl: z.string(),
  tags: z.array(z.string()).optional(),
  date: z.date(),
});

type NewsAttributes = z.infer<typeof AttributeSchema> & {
  date: Date;
};

export type News = {
  slug: string;
  attributes: NewsAttributes;
  content: string;
};

export const getNews = async (tags?: string[]) => {
  const fileNames = await fs.readdir(newsDirectory);
  const news: News[] = [];
  for await (const fileName of fileNames) {
    const fullPath = path.join(newsDirectory, fileName);
    const fileContents = await fs.readFile(fullPath, "utf8");

    const matter = fm(fileContents);

    const result = AttributeSchema.safeParse(matter.attributes);

    if (!result.success) {
      continue;
    }

    if (
      process.env.VERCEL_ENV === "production" &&
      result.data.status === "draft"
    ) {
      continue;
    }

    if (tags) {
      if (!result.data.tags?.some((tag) => tags.includes(tag))) {
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
    if (!post.attributes.tags) {
      continue;
    }
    for (const tag of post.attributes.tags) {
      tags.add(tag);
    }
  }
  return Array.from(tags);
};

export const getCurrentNews = async (slug: string) => {
  const news = await getNews();
  return news.find((p) => p.slug === slug);
};
