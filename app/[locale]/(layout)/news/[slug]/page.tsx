import { Typography } from "@components/DS/typography";
import { ServerMdx } from "@feat/markdown/server-mdx";
import { LINKS } from "@feat/navigation/Links";
import { NewsItemAuthor, NewsItemTags } from "@feat/news/newsItem";
import { getCurrentNews, getNews } from "@feat/news/news-manager";
import { cn } from "@lib/utils";
import { buttonVariants } from "@ui/button";
import { ChevronLeft } from "lucide-react";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { notFound } from "next/navigation";

export const dynamic = "force-static";

export async function generateMetadata(
  props: PageProps<"/[locale]/news/[slug]">,
): Promise<Metadata> {
  const params = await props.params;
  const post = await getCurrentNews(params.slug);

  if (!post) {
    notFound();
  }

  return {
    title: post.attributes.title,
    description: post.attributes.description,
    keywords: post.attributes.keywords,
    authors: {
      name: "DyingStar",
      url: "https://www.dyingstar-game.com",
    },
    openGraph: {
      title: post.attributes.title,
      description: post.attributes.description,
      url: `https://www.dyingstar-game.com/news/${params.slug}`,
      type: "article",
    },
  };
}

export async function generateStaticParams() {
  const news = await getNews();

  return news.map((newsItem) => ({
    slug: newsItem.slug,
  }));
}

export default async function RoutePage(
  props: PageProps<"/[locale]/news/[slug]">,
) {
  const params = await props.params;
  const news = await getCurrentNews(params.slug, params.locale);

  if (!news) {
    notFound();
  }

  const attributes = news.attributes;

  return (
    <main className="container mx-auto flex flex-col gap-8 px-4 py-20 lg:py-22">
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
      <section className="border-input flex flex-col gap-8 border-b pb-8">
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
          />
        </div>
        <ServerMdx className="mb-8" source={news.content} />
        <NewsItemTags tags={attributes.tags} />
        <NewsItemAuthor author={attributes.author} date={attributes.date} />
      </section>
    </main>
  );
}
