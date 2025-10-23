import { JsonLd } from "@components/DS/jsonLd";
import { OptimizedImage } from "@components/DS/optimizedImage/optimizeImage";
import { Typography } from "@components/DS/typography";
import { ServerMdx } from "@feat/markdown/serverMdx";
import { LINKS } from "@feat/navigation/Links";
import { NewsItemAuthor, NewsItemTags } from "@feat/news/newsItem";
import {
  getAlternateNews,
  getCurrentNews,
  getNews,
} from "@feat/news/newsManager";
import { LayoutMain, LayoutSection } from "@feat/page/layout";
import { LOCALES } from "@i18n/config";
import { Link } from "@i18n/navigation";
import { combineWithParentMetadata } from "@lib/metadata";
import { createLocalizedUrl, getServerUrl } from "@lib/serverUrl";
import { cn } from "@lib/utils";
import { buttonVariants } from "@ui/button";
import { ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";
import type { ResolvingMetadata } from "next";
import { type Locale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import type { NewsArticle, WithContext } from "schema-dts";

export const dynamic = "force-static";

export const generateMetadata = async (
  props: {
    params: Record<string, string>;
    searchParams?: Record<string, string | string[] | undefined>;
  },
  parent: ResolvingMetadata,
) => {
  const params = await props.params;
  const news = await getCurrentNews(params.slug, params.locale);
  if (!news) {
    notFound();
  }

  const t = await getTranslations("News");

  const mergeFn = combineWithParentMetadata({
    title: `${t("Metadata.title")} · ${news.attributes.title}`,
    description: news.attributes.description,
    keywords: news.attributes.keywords,
    authors: {
      name: news.attributes.author,
      url: getServerUrl(params.locale),
    },
    openGraph: {
      url: LINKS.News.Detail.href({ newsSlug: news.slug }),
      type: "article",
    },
    alternates: {
      canonical: LINKS.News.Detail.href({ newsSlug: news.slug }),
    },
  });
  return mergeFn(props, parent);
};

export const generateStaticParams = async () => {
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
};

const RoutePage = async (props: PageProps<"/[locale]/news/[slug]">) => {
  const params = await props.params;
  const news = await getCurrentNews(params.slug, params.locale as Locale);

  if (!news) {
    const alternateNews = await getAlternateNews(
      params.slug,
      params.locale as Locale,
    );

    if (!alternateNews) {
      notFound();
    }

    redirect(LINKS.News.Detail.href({ newsSlug: alternateNews.slug }));
  }

  const t = await getTranslations("News");
  const attributes = news.attributes;

  const newsDetailPageJsonLd: WithContext<NewsArticle> = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: attributes.title,
    about: attributes.description,
    keywords: attributes.keywords,
    dateCreated: attributes.date.toISOString(),
    publisher: {
      "@type": "Person",
      name: attributes.author,
    },
    inLanguage: params.locale,
    url: createLocalizedUrl(
      params.locale,
      LINKS.News.Detail.href({ newsSlug: news.slug }),
    ),
  };

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
        <OptimizedImage
          src={attributes.coverUrl}
          alt={attributes.title}
          priority
          loading="eager"
        />
        <ServerMdx className="mb-8" source={news.content} />
        <NewsItemTags tags={attributes.tags} />
        <NewsItemAuthor author={attributes.author} date={attributes.date} />
      </LayoutSection>
      <NewsDetailPagination
        previousSlug={news.previousSlug}
        nextSlug={news.nextSlug}
      />
      <JsonLd data={newsDetailPageJsonLd} />
    </LayoutMain>
  );
};

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

export default RoutePage;
