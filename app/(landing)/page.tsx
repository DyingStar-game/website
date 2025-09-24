import { CtaWithButton } from "@components/DS/CTA/ctaWithButton";
import { Typography } from "@components/DS/typography";
import { SectionLayout } from "@feat/landing/section-layout";
import { NewCard } from "@feat/news/new-card";
import { getLatestNews } from "@feat/news/news-manager";

export default async function HomePage() {
  const latestNews = await getLatestNews();

  return (
    <>
      <CtaWithButton
        size="sm"
        title="Join us and contribute to the project!"
        btContent="How to contribute"
      />
      <SectionLayout variant="transparent">
        <Typography variant="h2" className="mb-4">
          Last News
        </Typography>
        {latestNews && <NewCard key={latestNews.slug} news={latestNews} />}
      </SectionLayout>
    </>
  );
}

