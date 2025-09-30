import { CtaWithButton } from "@components/DS/CTA/ctaWithButton";
import { Typography } from "@components/DS/typography";
import { LogoDiscordSvg } from "@components/svg/logoDiscord";
import { LINKS } from "@feat/navigation/Links";
import NewsItem from "@feat/news/NewsItem";
import NewsItemLight from "@feat/news/NewsItemLight";
import { getLastNews } from "@feat/news/news-manager";
import {
  LayoutContentTitle,
  LayoutMain,
  LayoutSection,
} from "@feat/page/layout";
import TaskCard from "@feat/task/TaskCard";
import type { Locale } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("Landing");

  return (
    <>
      <CtaWithButton
        title={t("CTA.contribute.title")}
        action={{ label: t("CTA.contribute.action"), href: "#" }} //TODO: href
      />

      <LayoutMain size="full">
        <NewsSection />
        <ProjectDescriptionSection />
        <TaskSection />
        <CtaWithButton
          title={t("CTA.discord.title")}
          action={{
            label: t("CTA.discord.action"),
            icon: <LogoDiscordSvg />,
            href: `https://discord.gg/${process.env.DISCORD_INVITE_ID ?? "K4a2mwwBAM"}`,
            target: "_blank",
          }}
        />
        {/* <YoutubeSection /> */}
      </LayoutMain>
    </>
  );
}

const NewsSection = async () => {
  const t = await getTranslations("Landing.News");
  const locale = await getLocale();
  const lastNews = await getLastNews(locale as Locale, 5);
  return (
    <LayoutSection className="gap-14" size="container">
      <LayoutContentTitle
        title={t("title")}
        action={{ label: t("action"), href: LINKS.News.All.href() }}
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
  );
};

const ProjectDescriptionSection = async () => {
  const t = await getTranslations("Landing.ProjectDescription");
  return (
    <LayoutSection size="container" className="gap-6">
      <LayoutContentTitle title={t("title")} />
      <Typography variant="p">{t("content")}</Typography>
    </LayoutSection>
  );
};

const TaskSection = async () => {
  const t = await getTranslations("Landing.Task");

  return (
    <LayoutSection className="gap-14" size="container">
      <LayoutContentTitle
        title={t("title")}
        action={{ label: t("action"), href: "#" }}
      />
      <div className="gap-4 *:mb-4 xl:columns-2 2xl:columns-3">
        <TaskCard
          className="break-inside-avoid"
          title="Pipeline d'intégration avec un titre sur deux lignes ou trois si vraiment y a un soucis."
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum
          suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan
          lacus vel facilisis."
        />
        <TaskCard
          className="break-inside-avoid"
          title="Pipeline d'intégration avec un titre"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do commodo viverra maecenas accumsan commodo viverra maecenas accumsan commodo viverra maecenas accumsan
          lacus vel facilisis."
        />
        <TaskCard
          className="break-inside-avoid"
          title="Pipeline d'intégration"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit
          lacus vel facilisis."
        />
        <TaskCard
          className="break-inside-avoid"
          title="Pipeline d'intégration"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit Risus commodo viverra maecenas accumsan
          lacus vel facilisis."
        />
        <TaskCard
          title="Pipeline d'intégration"
          className="break-inside-avoid"
        />
      </div>
    </LayoutSection>
  );
};

// const YoutubeSection = async () => {
//   return (
//     <LayoutSection size="container">
//       <iframe
//         className="aspect-video"
//         src={`https://www.youtube.com/embed/${process.env.LAST_YOUTUBE_ID ?? "rB1vgn3QwoY"}`}
//         allowFullScreen
//       />
//     </LayoutSection>
//   );
// };
