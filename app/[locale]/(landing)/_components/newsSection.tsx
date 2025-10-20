import { LINKS } from "@feat/navigation/Links";
import NewsItem from "@feat/news/newsItem";
import NewsItemLight from "@feat/news/newsItemLight";
import { getLastNews } from "@feat/news/newsManager";
import { LayoutContentTitle, LayoutSection } from "@feat/page/layout";
import type { Locale } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";

export const NewsSection = async () => {
  const t = await getTranslations("Landing.News");
  const locale = await getLocale();
  const lastNews = await getLastNews(locale as Locale, 5);
  return (
    <LayoutSection className="gap-14" size="container">
      <LayoutContentTitle
        title={t("title")}
        action={{ label: t("action"), href: LINKS.News.All.href() }}
      />
      <div className="divide-solide divide-input border-input flex flex-col gap-7 divide-y border-b">
        {lastNews.map((news, index) =>
          index < 2 ? (
            <NewsItem key={news.slug} news={news} className="pb-7" />
          ) : (
            <NewsItemLight key={news.slug} news={news} className="pb-7" />
          ),
        )}
      </div>
    </LayoutSection>
  );
};
