import { CtaWithButton } from "@components/DS/CTA/ctaWithButton";
import { Typography } from "@components/DS/typography";
import { SectionLayout } from "@feat/landing/section-layout";
import { NewCard } from "@feat/news/new-card";
import { getLatestNews } from "@feat/news/news-manager";
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const latestNews = await getLatestNews();
  const t = await getTranslations("Landing");

  return (
    <>
      <CtaWithButton
        size="sm"
        title="Join us and contribute to the project!"
        btContent="How to contribute"
      />
      <SectionLayout variant="transparent">
        <Typography variant="h2" className="mb-4">
          {t("latest-news")}
        </Typography>
        {latestNews && <NewCard key={latestNews.slug} news={latestNews} />}
      </SectionLayout>
    </>
  );
}
