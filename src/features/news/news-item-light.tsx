import type { News } from "@feat/news/news-manager";
import { Typography } from "../../components/DS/typography";
import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { buttonVariants } from "@ui/button";
import { cn } from "@lib/utils";
import { NewsItemAuthor, NewsItemTags } from "./news-item";

export type NewsItemLightProps = {
  news: News;
  className?: string;
};

const NewsItemLight = ({ news, className }: NewsItemLightProps) => {
  return (
    <article
      className={cn(
        "flex flex-col gap-4 lg:flex-row lg:items-center",
        className,
      )}
    >
      <Typography
        variant="h3"
        className="flex flex-1 items-center gap-4 overflow-hidden text-2xl font-medium"
      >
        <span className="text-3xl">{news.attributes.titleIcon}</span>
        <span className="lg:truncate"> {news.attributes.title}</span>
      </Typography>

      <NewsItemTags tags={news.attributes.tags} />

      <div className="flex w-full justify-between gap-4 lg:w-auto lg:justify-end">
        <NewsItemAuthor
          author={news.attributes.author}
          date={news.attributes.date}
        />
        <Link
          href={`/news/${news.slug}`}
          className={cn(
            buttonVariants({
              variant: "outline",
              size: "sm",
            }),
            "w-auto",
          )}
        >
          <ChevronRight />
        </Link>
      </div>
    </article>
  );
};

export default NewsItemLight;
