import { Typography } from "@components/DS/typography";
import { LINKS } from "@feat/navigation/Links";
import type { News } from "@feat/news/newsManager";
import { Link } from "@i18n/navigation";
import { cn } from "@lib/utils";
import { Avatar, AvatarFallback } from "@ui/avatar";
import { Badge } from "@ui/badge";
import { buttonVariants } from "@ui/button";
import { ChevronRight, Minus, Tag } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import Image from "next/image";

export type NewsItemProps = {
  news: News;
  className?: string;
  priority?: boolean;
};

const NewsItem = ({ news, className, priority }: NewsItemProps) => {
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
  const format = useFormatter();

  return (
    <div
      className={cn(
        "flex items-center gap-3 font-light text-foreground uppercase",
        className,
      )}
    >
      <Avatar>
        <AvatarFallback>{author.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      {author}
      <Minus className="rotate-90 text-input" />
      {format.dateTime(date, { dateStyle: "short" })}
    </div>
  );
};

type NewsItemTagsProps = {
  tags: string[];
};

export const NewsItemTags = ({ tags }: NewsItemTagsProps) => {
  return (
    <div className="flex flex-wrap gap-4">
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
