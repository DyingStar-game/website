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
import { getTranslations } from "next-intl/server";
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
  const params = await props.params;

  const tags = await getNewsTags(params.locale);
  const news = await getNews(params.locale);

  const t = await getTranslations("News");

  return (
    <LayoutMain>
      <LayoutHeader>
        <LayoutTitle>{t("title")}</LayoutTitle>
      </LayoutHeader>

      <LayoutSection className="flex-row gap-2">
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
          {news.map((post) => (
            <NewsItem key={post.slug} news={post} className="pb-7" />
          ))}
        </LayoutSection>
      )}
    </LayoutMain>
  );
}
