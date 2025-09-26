import { Typography } from "@components/DS/typography";
import NewsItem from "@feat/news/NewsItem";
import { getNews, getNewsTags } from "@feat/news/news-manager";
import {
  LayoutHeader,
  LayoutMain,
  LayoutSection,
  LayoutTitle,
} from "@feat/page/layout";
import { Link } from "@i18n/navigation";
import { Badge } from "@ui/badge";
import { buttonVariants } from "@ui/button";
import { FileQuestion } from "lucide-react";
import type { Metadata } from "next";
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
  const params = await props.params;
  const tags = await getNewsTags(params.locale);
  const news = await getNews(params.locale, [params.category]);

  return (
    <LayoutMain>
      <LayoutHeader>
        <LayoutTitle>Blog post about {params.category}</LayoutTitle>
      </LayoutHeader>
      <LayoutSection className="flex-row gap-2">
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
      </LayoutSection>

      {news.length === 0 ? (
        <LayoutSection>
          <FileQuestion />
          <Typography variant="h2">No news found</Typography>
          <Link className={buttonVariants({ variant: "link" })} href="/news">
            View all news
          </Link>
        </LayoutSection>
      ) : (
        <LayoutSection className="divide-solide flex flex-col gap-7 divide-y divide-input border-b border-input">
          {news.map((news) => (
            <NewsItem key={news.slug} news={news} className="pb-7" />
          ))}
        </LayoutSection>
      )}
    </LayoutMain>
  );
}
