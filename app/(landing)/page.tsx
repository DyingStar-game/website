import { CtaWithButton } from "@components/DS/CTA/ctaWithButton";
import { NewCard } from "@feat/news/new-card";
import { getLatestNews } from "@feat/news/news-manager";
import { Layout, LayoutContent } from "@feat/page/layout";

export default async function HomePage() {
  const latestNews = await getLatestNews();

  return (
    <Layout>
      {latestNews && (
        <LayoutContent>
          <NewCard key={latestNews.slug} news={latestNews} />
        </LayoutContent>
      )}
      <CtaWithButton
        size="xs"
        title="Join us and contribute to the project!"
        btContent="How to contribute"
      />
    </Layout>
  );
}

