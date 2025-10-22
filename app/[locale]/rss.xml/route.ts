import { LINKS } from "@feat/navigation/Links";
import { getNews } from "@feat/news/newsManager";
import { createLocalizedUrl, getServerUrl } from "@lib/serverUrl";
import { route } from "@lib/zodRoute";
import { Feed } from "feed";
import { getTranslations } from "next-intl/server";
import { SiteConfig } from "siteConfig";

export const GET = route.handler(async (_, { params }) => {
  const locale = params.locale;
  const localizedSiteUrl = getServerUrl(locale);

  const t = await getTranslations("RSS");

  const news = await getNews(locale);

  const feed = new Feed({
    title: t("title"),
    description: t("description"),
    id: localizedSiteUrl,
    link: localizedSiteUrl,
    language: locale,
    image: `${SiteConfig.prodUrl}/icons/icon-144x144.png`,
    favicon: `${SiteConfig.prodUrl}/icons/favicon.ico`,
    copyright: `© ${new Date().getFullYear()} ${SiteConfig.title}`,
    feedLinks: {
      rss2: createLocalizedUrl(locale, LINKS.Community.Rss.href()),
    },
  });

  for (const newsItem of news) {
    feed.addItem({
      id: newsItem.slug,
      title: newsItem.attributes.title,
      date: newsItem.attributes.date,
      link: createLocalizedUrl(
        locale,
        LINKS.News.Detail.href({ newsSlug: newsItem.slug }),
      ),
      author: [{ name: newsItem.attributes.author }],
      description: newsItem.attributes.description,
    });
  }

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
});
