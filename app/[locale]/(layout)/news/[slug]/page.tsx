import { Typography } from "@components/DS/typography";
import { ServerMdx } from "@feat/markdown/server-mdx";
import { LINKS } from "@feat/navigation/Links";
import { NewsItemAuthor, NewsItemTags } from "@feat/news/NewsItem";
import { getCurrentNews, getNews } from "@feat/news/news-manager";
import { LayoutMain, LayoutSection } from "@feat/page/layout";
import { LOCALES } from "@i18n/config";
import { Link } from "@i18n/navigation";
import { createLocalizedUrl, getServerUrl } from "@lib/server-url";
import { cn } from "@lib/utils";
import { buttonVariants } from "@ui/button";
import { ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import { type Locale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

export async function generateMetadata(
  props: PageProps<"/[locale]/news/[slug]">,
): Promise<Metadata> {
  const params = await props.params;
  const news = await getCurrentNews(params.slug, params.locale);

  if (!news) {
    notFound();
  }

  return {
    title: news.attributes.title,
    description: news.attributes.description,
    keywords: news.attributes.keywords,
    authors: {
      name: news.attributes.author,
      url: getServerUrl(params.locale),
    },
    openGraph: {
      title: news.attributes.title,
      description: news.attributes.description,
      url: createLocalizedUrl(
        params.locale,
        LINKS.News.Detail.href({ newsSlug: news.slug }),
      ),
      type: "article",
    },
  };
}

export async function generateStaticParams() {
  const allNews = await Promise.all(
    LOCALES.map(async (locale) => {
      const newsItems = await getNews(locale);
      return newsItems.map((newsItem) => ({
        slug: newsItem.slug,
        locale,
      }));
    }),
  );

  return allNews.flat();
}

export default async function RoutePage(
  props: PageProps<"/[locale]/news/[slug]">,
) {
  const params = await props.params;
  const news = await getCurrentNews(params.slug, params.locale as Locale);

  if (!news) {
    notFound();
  }

  const t = await getTranslations("News");
  const attributes = news.attributes;

  return (
    <LayoutMain>
      <Link
        href={LINKS.News.All.href()}
        className={cn(
          buttonVariants({
            variant: "outline",
          }),
          "self-end",
        )}
      >
        <ChevronLeft />
        {t("button.viewAll")}
      </Link>
      <LayoutSection className="gap-8 border-b border-input pb-8">
        <Typography variant="h3" as="h1" className="flex items-center gap-4">
          <span className="text-5xl">{attributes.titleIcon}</span>
          {attributes.title}
        </Typography>
        <div className="relative aspect-video w-full self-center">
          <Image
            src={attributes.coverUrl}
            alt={attributes.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        <ServerMdx className="mb-8" source={news.content} />
        <NewsItemTags tags={attributes.tags} />
        <NewsItemAuthor author={attributes.author} date={attributes.date} />
      </LayoutSection>
      <NewsDetailPagination
        previousSlug={news.previousSlug}
        nextSlug={news.nextSlug}
      />
    </LayoutMain>
  );
}

type NewsDetailPaginationProps = {
  previousSlug?: string;
  nextSlug?: string;
};

const NewsDetailPagination = ({
  previousSlug,
  nextSlug,
}: NewsDetailPaginationProps) => {
  const t = useTranslations("News.NewsDetailPagination");

  return (
    <LayoutSection className="mt-6 flex flex-row justify-between">
      <div className="flex flex-1 justify-start">
        {previousSlug && (
          <Link
            href={{
              pathname: LINKS.News.Detail.href({ newsSlug: previousSlug }),
            }}
            className={cn(buttonVariants({ variant: "outline" }), "group")}
            prefetch
          >
            <ArrowLeft className="transition-transform group-hover:-translate-x-1 group-hover:animate-pulse" />
            {t("button.previous")}
          </Link>
        )}
      </div>

      <div className="flex flex-1 justify-end">
        {nextSlug && (
          <Link
            href={{
              pathname: LINKS.News.Detail.href({ newsSlug: nextSlug }),
            }}
            className={cn(buttonVariants({ variant: "outline" }), "group")}
            prefetch
          >
            {t("button.next")}
            <ArrowRight className="transition-transform group-hover:translate-x-1 group-hover:animate-pulse" />
          </Link>
        )}
      </div>
    </LayoutSection>
  );
};
