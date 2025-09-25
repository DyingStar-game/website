import { getNews } from "@feat/news/news-manager";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const news = await getNews();
  return [
    {
      url: "https://www.dyingstar-game.com",
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
    ...news.map(
      (post) =>
        ({
          url: `https://www.dyingstar-game.com/news/${post.slug}`,
          lastModified: post.attributes.date,
          changeFrequency: "monthly",
        }) as const,
    ),
  ];
}
