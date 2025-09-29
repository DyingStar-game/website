import { CtaWithButton } from "@components/DS/CTA/ctaWithButton";
import { LINKS } from "@feat/navigation/Links";
import NewsItem from "@feat/news/NewsItem";
import NewsItemLight from "@feat/news/NewsItemLight";
import { getLastNews } from "@feat/news/news-manager";
import {
  Layout,
  LayoutContentTitle,
  LayoutMain,
  LayoutSection,
} from "@feat/page/layout";
import type { Locale } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("Landing");
  const locale = await getLocale();
  const lastNews = await getLastNews(locale as Locale, 5);

  return (
    <>
      <Layout size="full" asChild>
        <CtaWithButton title={t("CTA.title")} btContent={t("CTA.action")} />
      </Layout>
      <LayoutMain>
        <LayoutSection className="gap-14">
          <LayoutContentTitle
            title={t("News.title")}
            btnTitle={t("News.action")}
            href={LINKS.News.All.href()}
          />
          <div className="divide-solide flex flex-col gap-7 divide-y divide-input border-b border-input">
            {lastNews.map((news, index) =>
              index < 2 ? (
                <NewsItem key={news.slug} news={news} className="pb-7" />
              ) : (
                <NewsItemLight key={news.slug} news={news} className="pb-7" />
              ),
            )}
          </div>
        </LayoutSection>
      </LayoutMain>
    </>
  );
}
