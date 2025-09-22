import { Typography } from "@components/DS/typography";
import { NewCard } from "@feat/news/new-card";
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

export async function generateMetadata(
  props: PageProps<"/[locale]/news/categories/[category]">,
): Promise<Metadata> {
  const params = await props.params;
  return {
    title: `${SiteConfig.title}'s Blog about ${params.category}`,
    description: SiteConfig.description,
    openGraph: {
      title: `${SiteConfig.title}'s Blog about ${params.category}`,
      description: SiteConfig.description,
      url: `https://DyingStar.com/news/categories/${params.category}`,
      type: "article",
    },
  };
}

export default async function RoutePage(
  props: PageProps<"/[locale]/news/categories/[category]">,
) {
  const tags = await getNewsTags();
  const params = await props.params;
  const news = await getNews([params.category]);

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Blog post about {params.category}</LayoutTitle>
      </LayoutHeader>
      <LayoutContent className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag}
            href={{
              pathname: `/news/categories/${tag}`,
            }}
          >
            <Badge variant={params.category === tag ? "default" : "outline"}>
              {tag}
            </Badge>
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
        <LayoutContent className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {news.map((news) => (
            <NewCard key={news.slug} news={news} />
          ))}
        </LayoutContent>
      )}
    </Layout>
  );
}
