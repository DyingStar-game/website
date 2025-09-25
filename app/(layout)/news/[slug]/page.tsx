import { ServerMdx } from "@feat/markdown/server-mdx";
import { calculateReadingTime } from "@feat/news/calculate-reading-time";
import { getCurrentNews, getNews } from "@feat/news/news-manager";
import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@feat/page/layout";
import { formatDate } from "@lib/format/date";

import { Badge } from "@ui/badge";
import { buttonVariants } from "@ui/button";
import { Separator } from "@ui/separator";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

export async function generateMetadata(
  props: PageProps<"/news/[slug]">,
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

export default async function RoutePage(props: PageProps<"/news/[slug]">) {
  const params = await props.params;
  const news = await getCurrentNews(params.slug); // TODO: Add locale from i18n

  if (!news) {
    notFound();
  }

  const attributes = news.attributes;

  return (
    <Layout>
      <LayoutContent>
        <Link className={buttonVariants({ variant: "link" })} href="/news">
          <ArrowLeft size={16} /> Back
        </Link>
      </LayoutContent>
      <LayoutHeader
        style={{
          backgroundImage: `url(${attributes.coverUrl})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
        className="overflow-hidden rounded-lg"
      >
        <div className="flex w-full flex-col gap-2 bg-black/50 p-10 backdrop-blur">
          <LayoutTitle className="drop-shadow-sm">
            {attributes.titleIcon} {attributes.title}
          </LayoutTitle>
          <LayoutDescription className="drop-shadow-sm">
            Published at {formatDate(new Date(attributes.date))} · Reading time{" "}
            {calculateReadingTime(news.content)} minutes · Created by{" "}
            {attributes.author}
          </LayoutDescription>
          <div className="flex flex-wrap gap-2">
            {attributes.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </div>
      </LayoutHeader>
      <Separator />
      <LayoutContent>
        <ServerMdx className="mb-8" source={news.content} />
      </LayoutContent>
    </Layout>
  );
}
