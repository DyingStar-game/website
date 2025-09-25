import { CtaWithButton } from "@components/DS/CTA/ctaWithButton";
import { Typography } from "@components/DS/typography";

import NewsItem from "@feat/news/news-item";
import NewsItemLight from "@feat/news/news-item-light";
import { getLastNews } from "@feat/news/news-manager";

export default async function HomePage() {
  const lastNews = await getLastNews(5);

  return (
    <>
      <CtaWithButton
        size="sm"
        title="Join us and contribute to the project!"
        btContent="How to contribute"
      />
      <main className="container mx-auto px-4 py-20 lg:py-22">
        <Typography variant="h2" className="mb-4">
          Last News
        </Typography>
        <section className="divide-solide divide-foreground flex flex-col gap-7 divide-y border-b">
          {lastNews.map((news, index) =>
            index < 2 ? (
              <NewsItem key={news.slug} news={news} className="pb-7" />
            ) : (
              <NewsItemLight key={news.slug} news={news} className="pb-7" />
            ),
          )}
        </section>
      </main>
    </>
  );
}
