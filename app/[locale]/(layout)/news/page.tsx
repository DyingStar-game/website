import { Paginate } from "@components/DS/paginate/paginate";
import { Typography } from "@components/DS/typography";
import { LINKS } from "@feat/navigation/Links";
import NewsItem from "@feat/news/newsItem";
import { getNewsTags, getPaginatedNews } from "@feat/news/newsManager";
import {
  LayoutHeader,
  LayoutMain,
  LayoutSection,
  LayoutTitle,
} from "@feat/page/layout";
import { Link } from "@i18n/navigation";
import { combineWithParentMetadata } from "@lib/metadata";
import { Badge } from "@ui/badge";
import { buttonVariants } from "@ui/button";
import { FileQuestion } from "lucide-react";
import type { ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

export const generateMetadata = async (
  props: {
    params: Record<string, string>;
    searchParams?: Record<string, string | string[] | undefined>;
  },
  parent: ResolvingMetadata,
) => {
  const t = await getTranslations("News.Metadata");

  const mergeFn = combineWithParentMetadata({
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    openGraph: {
      url: LINKS.News.All.href(),
      type: "article",
    },
    alternates: {
      canonical: LINKS.News.All.href(),
    },
  });
  return mergeFn(props, parent);
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
          <Paginate
            pageInfo={paginatedNews.pagination}
            mode="link"
            getPageHref={(page) => ({
              pathname: LINKS.News.All.href(),
              query: { page: page },
            })}
          />
        </>
      )}
    </LayoutMain>
  );
}
