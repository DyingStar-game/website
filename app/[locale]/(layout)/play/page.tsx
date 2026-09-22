import { JsonLd } from "@components/DS/jsonLd";
import { Button } from "@components/ui/button";
import { LINKS } from "@feat/navigation/Links";
import { LayoutHeader, LayoutMain, LayoutTitle } from "@feat/page/layout";
import { LOCALES } from "@i18n/config";
import { Link } from "@i18n/navigation";
import { combineWithParentMetadata } from "@lib/metadata";
import { createLocalizedUrl } from "@lib/serverUrl";
import type { ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Article, WithContext } from "schema-dts";

import { PlaySection } from "./_components/playSection";

export const dynamic = "force-static";

export const generateMetadata = async (
  props: {
    params: Record<string, string>;
    searchParams?: Record<string, string | string[] | undefined>;
  },
  parent: ResolvingMetadata,
) => {
  const t = await getTranslations("Play.Metadata");

  const mergeFn = combineWithParentMetadata({
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    openGraph: {
      url: LINKS.Project.Play.href(),
      type: "article",
    },
    alternates: {
      canonical: LINKS.Project.Play.href(),
    },
  });
  return mergeFn(props, parent);
};

export const generateStaticParams = async () => {
  return LOCALES.map((locale) => ({
    locale,
  }));
};

const PlayPage = async (props: PageProps<"/[locale]/play">) => {
  const { locale } = await props.params;
  const t = await getTranslations("Play");

  const playPageJsonLd: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: t("title"),
    inLanguage: locale,
    url: createLocalizedUrl(locale, LINKS.Project.Play.href()),
  };

  return (
    <LayoutMain>
      <LayoutHeader>
        <LayoutTitle>{t("title")}</LayoutTitle>
      </LayoutHeader>
      <PlaySection locale={locale} />

      <div className="grid md:grid-cols-3">
        <Button asChild variant="default" className="md:col-start-2">
          <Link href="https://github.com/DyingStar-game/launcher/releases/latest">
            {t("action")}
          </Link>
        </Button>
      </div>
      <JsonLd data={playPageJsonLd} />
    </LayoutMain>
  );
};

export default PlayPage;
