import { getChangelog } from "@feat/changelog/changelogManager";
import { LINKS } from "@feat/navigation/Links";
import { getLastNews } from "@feat/news/newsManager";
import { LOCALES } from "@i18n/config";
import { createLocalizedUrl } from "@lib/serverUrl";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import "server-only";
import { SiteConfig } from "siteConfig";

/**
 * llms.txt format (https://llmstxt.org):
 * - H1 with the site name (required)
 * - blockquote summary
 * - free markdown paragraphs (no headings)
 * - H2 sections containing lists of `- [name](url): notes`
 * - an "Optional" H2 section, which agents may skip when context is limited
 */
type LlmsLink = {
  title: string;
  url: string;
  notes?: string;
};

type LlmsSection = {
  title: string;
  links: LlmsLink[];
};

// Older news stay reachable through the news page and the RSS feed
const RECENT_NEWS_LIMIT = 10;

const formatDate = (date: Date) => date.toISOString().slice(0, 10);

const renderLink = ({ title, url, notes }: LlmsLink) =>
  `- [${title}](${url})${notes ? `: ${notes}` : ""}`;

const renderSection = ({ title, links }: LlmsSection) =>
  [`## ${title}`, "", ...links.map(renderLink)].join("\n");

const generateProjectSection = async (locale: Locale): Promise<LlmsSection> => {
  const t = await getTranslations({ locale });

  return {
    title: t("Llms.Sections.project"),
    links: [
      {
        title: t("Links.Project.Project"),
        url: createLocalizedUrl(locale, LINKS.Project.Project.href()),
        notes: t("Project.Metadata.description"),
      },
      {
        title: t("Links.Project.Play"),
        url: createLocalizedUrl(locale, LINKS.Project.Play.href()),
        notes: t("Play.Metadata.description"),
      },
      {
        title: t("Links.Project.Launcher"),
        url: LINKS.Project.Launcher.href(),
        notes: t("Llms.Project.launcher"),
      },
      {
        title: t("Links.Project.Contribute"),
        url: createLocalizedUrl(locale, LINKS.Project.Contribute.href()),
        notes: t("Issue.Metadata.description"),
      },
      {
        title: t("Links.Project.Changelog"),
        url: createLocalizedUrl(locale, LINKS.Project.Changelog.href()),
        notes: t("Changelog.Metadata.description"),
      },
      {
        title: t("Links.News.All"),
        url: createLocalizedUrl(locale, LINKS.News.All.href()),
        notes: t("News.Metadata.description"),
      },
    ],
  };
};

const generateNewsSection = async (
  locale: Locale,
): Promise<LlmsSection | null> => {
  const t = await getTranslations({ locale, namespace: "Llms.Sections" });
  const news = await getLastNews(locale, RECENT_NEWS_LIMIT);

  if (news.length === 0) return null;

  return {
    title: t("news"),
    links: news.map((newsItem) => ({
      title: newsItem.attributes.title,
      url: createLocalizedUrl(
        locale,
        LINKS.News.Detail.href({ newsSlug: newsItem.slug }),
      ),
      notes: `${formatDate(newsItem.attributes.date)} - ${newsItem.attributes.description}`,
    })),
  };
};

const generateChangelogSection = async (
  locale: Locale,
): Promise<LlmsSection | null> => {
  const t = await getTranslations({ locale, namespace: "Llms" });
  const changelog = await getChangelog(locale);

  const links = (changelog ?? []).flatMap((component) => {
    // Releases are sorted by date desc
    const latestRelease = component.releases.at(0);
    if (!latestRelease) return [];

    return [
      {
        title: `${component.name} ${latestRelease.version}`,
        url: createLocalizedUrl(locale, LINKS.Project.Changelog.href()),
        notes: t("latestRelease", { date: formatDate(latestRelease.date) }),
      },
    ];
  });

  if (links.length === 0) return null;

  return { title: t("Sections.changelog"), links };
};

const generateCommunitySection = async (
  locale: Locale,
): Promise<LlmsSection> => {
  const t = await getTranslations({ locale });

  return {
    title: t("Llms.Sections.community"),
    links: [
      {
        title: t("Links.Community.Discord"),
        url: LINKS.Community.Discord.href(),
        notes: t("Llms.Community.discord"),
      },
      {
        title: t("Links.Community.Github"),
        url: LINKS.Community.Github.href(),
        notes: t("Llms.Community.github"),
      },
      {
        title: t("Links.Community.Rss"),
        url: createLocalizedUrl(locale, LINKS.Community.Rss.href()),
        notes: t("RSS.description"),
      },
    ],
  };
};

const generateOptionalSection = async (
  locale: Locale,
): Promise<LlmsSection> => {
  const t = await getTranslations({ locale });

  const alternateLocales = LOCALES.filter((other) => other !== locale);

  return {
    // "Optional" is a keyword of the llms.txt spec, it must not be translated
    title: "Optional",
    links: [
      {
        title: t("Links.Legal.privacy"),
        url: createLocalizedUrl(locale, LINKS.Legal.privacy.href()),
        notes: t("Privacy.Metadata.description"),
      },
      {
        title: t("Links.Legal.terms"),
        url: createLocalizedUrl(locale, LINKS.Legal.terms.href()),
        notes: t("Terms.Metadata.description"),
      },
      ...alternateLocales.map((alternateLocale) => ({
        title: `llms.txt (${alternateLocale})`,
        url: createLocalizedUrl(alternateLocale, "/llms.txt"),
        notes: t("Llms.alternateLocale", { locale: alternateLocale }),
      })),
    ],
  };
};

export const generateLlmsTxt = async (locale: Locale): Promise<string> => {
  const t = await getTranslations({ locale, namespace: "Llms" });

  const sections = await Promise.all([
    generateProjectSection(locale),
    generateNewsSection(locale),
    generateChangelogSection(locale),
    generateCommunitySection(locale),
    generateOptionalSection(locale),
  ]);

  return [
    `# ${SiteConfig.title}`,
    `> ${t("summary")}`,
    t("details"),
    ...sections
      .filter((section) => section !== null)
      .map((section) => renderSection(section)),
  ]
    .join("\n\n")
    .concat("\n");
};
