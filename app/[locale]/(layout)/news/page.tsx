import { Typography } from "@components/DS/typography";
import { LINKS } from "@feat/navigation/Links";
import NewsItem from "@feat/news/NewsItem";
import type { PaginatedNews } from "@feat/news/news-manager";
import { getNewsTags, getPaginatedNews } from "@feat/news/news-manager";
import {
  LayoutHeader,
  LayoutMain,
  LayoutSection,
  LayoutTitle,
} from "@feat/page/layout";
import { Link } from "@i18n/navigation";
import { Badge } from "@ui/badge";
import { buttonVariants } from "@ui/button";
import { ArrowLeft, ArrowRight, FileQuestion } from "lucide-react";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
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

export default async function NewsPage(props: PageProps<"/[locale]/news">) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const page = parseInt(searchParams.page as string) || 1;
  if (isNaN(page) || page < 1) notFound();

  const tags = searchParams.tag
    ? Array.isArray(searchParams.tag)
      ? searchParams.tag
      : [searchParams.tag]
    : undefined;

  const allTags = await getNewsTags(params.locale);
  const paginatedNews = await getPaginatedNews(params.locale, tags, page);

  const t = await getTranslations("News");

  return (
    <LayoutMain>
      <LayoutHeader>
        <LayoutTitle>{t("title")}</LayoutTitle>
      </LayoutHeader>

      <LayoutSection className="flex-row flex-wrap gap-2">
        {allTags.map((tag) => {
          const isSelected = tags?.includes(tag) ?? false;

          // Toggle tag
          const newTags = isSelected
            ? tags?.filter((t) => t !== tag)
            : [...(tags ?? []), tag];

          return (
            <Link
              key={tag}
              href={{
                pathname: LINKS.News.All.href(),
                query: {
                  ...(newTags && newTags.length > 0 && { tag: newTags }),
                  page: 1,
                },
              }}
              prefetch
            >
              <Badge variant={isSelected ? "default" : "outline"}>{tag}</Badge>
            </Link>
          );
        })}
      </LayoutSection>

      {paginatedNews.news.length === 0 ? (
        <LayoutSection className="items-center" padding="default">
          <FileQuestion className="size-20" />
          <Typography variant="h2">{t("notFound")}</Typography>
          <Link
            className={buttonVariants({ variant: "outline" })}
            href={LINKS.News.All.href()}
          >
            {t("button.viewAll")}
          </Link>
        </LayoutSection>
      ) : (
        <>
          <LayoutSection className="divide-solide flex flex-col gap-7 divide-y divide-input border-b border-input">
            {paginatedNews.news.map((post) => (
              <NewsItem key={post.slug} news={post} className="pb-7" />
            ))}
          </LayoutSection>
          <NewsPagination
            pagination={paginatedNews.pagination}
            tags={tags}
            page={page}
          />
        </>
      )}
    </LayoutMain>
  );
}

type NewsPaginationProps = {
  pagination: PaginatedNews["pagination"];
  tags?: string[];
  page: number;
};

const NewsPagination = ({ pagination, tags, page }: NewsPaginationProps) => {
  const t = useTranslations("News.NewsPagination");

  const buildQuery = (pageNum: number) => ({
    ...(tags && tags.length > 0 && { tag: tags }),
    page: pageNum,
  });

  return (
    <LayoutSection className="mt-6 flex flex-row justify-between">
      <div className="flex flex-1 justify-start">
        {pagination.previousPage && (
          <Link
            href={{
              pathname: LINKS.News.All.href(),
              query: buildQuery(page - 1),
            }}
            className={buttonVariants({ variant: "outline" })}
            prefetch
          >
            <ArrowLeft /> {t("button.previous")}
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        {Array.from({ length: pagination.totalPages }).map((_, i) => {
          const pageNumber = i + 1;
          const isActive = pageNumber === pagination.currentPage;

          return (
            <Link
              key={pageNumber}
              href={{
                pathname: LINKS.News.All.href(),
                query: buildQuery(pageNumber),
              }}
              className={buttonVariants({
                variant: isActive ? "default" : "outline",
                size: "sm",
              })}
              prefetch
            >
              {pageNumber}
            </Link>
          );
        })}
      </div>

      <div className="flex flex-1 justify-end">
        {pagination.nextPage && (
          <Link
            href={{
              pathname: LINKS.News.All.href(),
              query: buildQuery(page + 1),
            }}
            className={buttonVariants({ variant: "outline" })}
            prefetch
          >
            {t("button.next")} <ArrowRight />
          </Link>
        )}
      </div>
    </LayoutSection>
  );
};
