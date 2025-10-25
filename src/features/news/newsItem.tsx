import { Typography } from "@components/DS/typography";
import { LINKS } from "@feat/navigation/Links";
import type { News } from "@feat/news/newsManager";
import { Link } from "@i18n/navigation";
import { cn } from "@lib/utils";
import { buttonVariants } from "@ui/button";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { NewsItemAuthor } from "./newsItemAuthor";
import { NewsItemTags } from "./newsItemTags";

export type NewsItemProps = {
  news: News;
  className?: string;
  priority?: boolean;
};

export const NewsItem = ({ news, className, priority }: NewsItemProps) => {
  const t = useTranslations("News.NewsItem");

  return (
    <article className={cn("flex flex-col gap-8", className)}>
      <Typography variant="h3" className="flex items-center gap-4 font-medium">
        <span className="text-3xl md:text-4xl lg:text-5xl">
          {news.attributes.titleIcon}
        </span>
        <Link href={LINKS.News.Detail.href({ newsSlug: news.slug })}>
          {news.attributes.title}
        </Link>
      </Typography>
      <div className="flex flex-col gap-7 xl:max-h-72 xl:flex-row">
        <div className="relative aspect-video w-full max-w-128 self-center">
          <Image
            src={news.attributes.coverUrl}
            alt={news.attributes.title}
            fill
            className="object-cover"
            sizes="512px"
            priority={priority}
          />
        </div>
        <div className="flex flex-1 flex-col gap-4">
          <Typography
            variant="p"
            className="line-clamp-6 flex-1 overflow-hidden text-justify text-ellipsis"
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
                href={LINKS.News.Detail.href({ newsSlug: news.slug })}
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
