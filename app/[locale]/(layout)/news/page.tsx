import { Typography } from "@components/DS/typography";
import NewsItem from "@feat/news/newsItem";
import { getNews, getNewsTags } from "@feat/news/news-manager";
import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@feat/page/layout";
import { Badge } from "@ui/badge";
import { buttonVariants } from "@ui/button";
import { FileQuestion } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { SiteConfig } from "site-config";

export const metadata: Metadata = {
  title: `${SiteConfig.title}'s Blog`,
  description: SiteConfig.description,
  keywords: ["news"],
  openGraph: {
    title: `${SiteConfig.title}'s Blog`,
    description: SiteConfig.description,
    url: SiteConfig.prodUrl,
    type: "website",
  },
};

export default async function RoutePage(props: PageProps<"/[locale]/news">) {
  const tags = await getNewsTags();
  const news = await getNews();

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>News</LayoutTitle>
      </LayoutHeader>
      <LayoutContent className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag}
            href={{
              pathname: `/news/categories/${tag}`,
            }}
          >
            <Badge variant="outline">{tag}</Badge>
          </Link>
        ))}
      </LayoutContent>

      {news.length === 0 ? (
        <LayoutContent className="flex flex-col items-center justify-center">
          <div className="flex flex-col items-center rounded-lg border-2 border-dashed p-4 lg:gap-6 lg:p-8">
            <FileQuestion />
            <Typography variant="h2">No news found</Typography>
            <Link className={buttonVariants({ variant: "link" })} href="/news">
              View all news
            </Link>
          </div>
        </LayoutContent>
      ) : (
        <LayoutContent className="flex flex-col gap-16">
          {news.map((post) => (
            <NewsItem key={post.slug} news={post} />
          ))}
        </LayoutContent>
      )}
    </Layout>
  );
}
