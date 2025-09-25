import type { News } from "@feat/news/news-manager";
import { Typography } from "../../components/DS/typography";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Minus, Tag } from "lucide-react";
import { buttonVariants } from "@ui/button";
import { Avatar, AvatarFallback } from "@ui/avatar";
import { Badge } from "@ui/badge";
import { cn } from "@lib/utils";

import { useTranslations } from "next-intl";

export type NewsItemProps = {
  news: News;
  className?: string;
};

const NewsItem = ({ news, className }: NewsItemProps) => {
  const t = useTranslations("news.newsItem");

  return (
    <article className={cn("flex flex-col gap-8", className)}>
      <Typography
        variant="h3"
        className="flex items-center gap-4 text-3xl font-medium"
      >
        <span className="text-5xl">{news.attributes.titleIcon}</span>
        {news.attributes.title}
      </Typography>
      <div className="flex flex-col gap-7 xl:max-h-72 xl:flex-row">
        <div className="relative aspect-video w-full max-w-128 self-center">
          <Image
            src={news.attributes.coverUrl}
            alt={news.attributes.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col gap-4">
          <Typography
            variant="p"
            className="line-clamp-6 flex-1 overflow-hidden text-justify text-2xl font-light text-ellipsis text-white"
            title={news.attributes.description}
          >
            {news.attributes.description}
          </Typography>
          <div className="flex w-full flex-col gap-4 lg:gap-2">
            <NewsItemTags tags={news.attributes.tags} />
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
              <NewsItemAuthor
                className="flex-1"
                author={news.attributes.author}
                date={news.attributes.date}
              />
              <Link
                href={`/news/${news.slug}`}
                className={buttonVariants({
                  variant: "outlineWhite",
                })}
              >
                {t("moreInfo")}
                <ChevronRight />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

type NewsItemAuthorProps = {
  author: string;
  date: Date;
  className?: string;
};

export const NewsItemAuthor = ({
  author,
  date,
  className,
}: NewsItemAuthorProps) => {
  const t = useTranslations("news.newsItem");

  return (
    <div
      className={cn(
        "text-foreground flex items-center gap-3 font-light uppercase",
        className,
      )}
    >
      <Avatar>
        <AvatarFallback>{author.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      {author}
      <Minus className="text-input rotate-90" />
      {t("publishedAt", { date })}
    </div>
  );
};

type NewsItemTagsProps = {
  tags: string[];
};

export const NewsItemTags = ({ tags }: NewsItemTagsProps) => {
  return (
    <div className="flex gap-4">
      {tags.map((tag) => {
        return (
          <Badge key={tag} variant="category">
            <Tag /> {tag}
          </Badge>
        );
      })}
    </div>
  );
};

export default NewsItem;
