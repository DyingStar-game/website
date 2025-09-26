import { Typography } from "@components/DS/typography";
import { ServerMdx } from "@feat/markdown/server-mdx";
import { LINKS } from "@feat/navigation/Links";
import { NewsItemAuthor, NewsItemTags } from "@feat/news/NewsItem";
import { getCurrentNews, getNews } from "@feat/news/news-manager";
import { Layout, LayoutMain, LayoutSection } from "@feat/page/layout";
import { DEFAULT_LOCALE, LOCALES } from "@i18n/config";
import { cn } from "@lib/utils";
import { buttonVariants } from "@ui/button";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import type { Locale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

export async function generateMetadata(
  props: PageProps<"/[locale]/news/[slug]">,
): Promise<Metadata> {
  const params = await props.params;
  const news = await getCurrentNews(params.slug);

  if (!news) {
    notFound();
  }

  // TODO: To factorise
  const host =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dyingstar-game.com";

  const localePrefix =
    params.locale === DEFAULT_LOCALE ? "" : `/${params.locale}`;

  const url = `${host}${localePrefix}/news/${params.slug}`;

  return {
    title: news.attributes.title,
    description: news.attributes.description,
    keywords: news.attributes.keywords,
    authors: {
      name: "DyingStar",
      url: host,
    },
    openGraph: {
      title: news.attributes.title,
      description: news.attributes.description,
      url,
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
        Back to news
      </Link>
      <LayoutSection className="gap-8 border-b border-input pb-8">
        <Typography
          variant="h1"
          className="flex items-center gap-4 text-3xl font-medium"
        >
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
    </LayoutMain>
  );
}
