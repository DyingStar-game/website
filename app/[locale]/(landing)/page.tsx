import { CtaWithButton } from "@components/DS/CTA/ctaWithButton";
import ContentTitle from "@feat/landing/content-title";

import NewsItem from "@feat/news/newsItem";
import NewsItemLight from "@feat/news/newsItemLight";
import { getLastNews } from "@feat/news/news-manager";
import { getLocale } from "next-intl/server";

export default async function HomePage() {
  const locale = await getLocale();
  const lastNews = await getLastNews(5, locale as "fr" | "en");

  return (
    <>
      <CtaWithButton
        size="sm"
        title="Join us and contribute to the project!"
        btContent="How to contribute"
      />
      <main className="container mx-auto px-4 py-20 lg:py-22">
        <section className="flex flex-col gap-14">
          <ContentTitle title="News" btnTitle="Toutes les news" href="/news" />
          <div className="divide-solide divide-input border-input flex flex-col gap-7 divide-y border-b">
            {lastNews.map((news, index) =>
              index < 2 ? (
                <NewsItem key={news.slug} news={news} className="pb-7" />
              ) : (
                <NewsItemLight key={news.slug} news={news} className="pb-7" />
              ),
            )}
          </div>
        </section>
      </main>
    </>
  );
}
