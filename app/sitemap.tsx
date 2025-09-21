import { getNews } from "@feat/news/news-manager";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const news = await getNews();
  return [
    {
      url: "https://DyingStar.com",
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
    {
      url: "https://DyingStar.com/login",
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
    {
      url: "https://DyingStar.com/home",
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
    ...news.map(
      (post) =>
        ({
          url: `https://DyingStar.com/news/${post.slug}`,
          lastModified: new Date(post.attributes.date),
          changeFrequency: "monthly",
        }) as const,
    ),
  ];
}
