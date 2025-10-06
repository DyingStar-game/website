import React from "react";

import { LINKS } from "@feat/navigation/Links";
import type { News } from "@feat/news/news-manager";
import { Link } from "@i18n/navigation";
import { cn } from "@lib/utils";
import { buttonVariants } from "@ui/button";
import { ChevronRight } from "lucide-react";

import { Typography } from "../../components/DS/typography";
import { NewsItemAuthor, NewsItemTags } from "./NewsItem";

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
        className="flex flex-1 items-center gap-4 overflow-hidden font-medium md:text-xl lg:text-2xl"
        title={news.attributes.title}
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
          href={LINKS.News.Detail.href({ newsSlug: news.slug })}
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
