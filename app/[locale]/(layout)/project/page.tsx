import { ProjectDescriptionSection } from "@app/[locale]/(layout)/project/_components/projectDescriptionSection";
import { JsonLd } from "@components/DS/jsonLd";
import { LINKS } from "@feat/navigation/Links";
import { LayoutHeader, LayoutMain, LayoutTitle } from "@feat/page/layout";
import { LOCALES } from "@i18n/config";
import { combineWithParentMetadata } from "@lib/metadata";
import { createLocalizedUrl } from "@lib/serverUrl";
import type { ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Article, WithContext } from "schema-dts";

import { FaqSection } from "./_components/faqSection";

export const dynamic = "force-static";

export const generateMetadata = async (
  props: {
    params: Record<string, string>;
    searchParams?: Record<string, string | string[] | undefined>;
  },
  parent: ResolvingMetadata,
) => {
  const t = await getTranslations("Project.Metadata");

  const mergeFn = combineWithParentMetadata({
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    openGraph: {
      url: LINKS.Project.Project.href(),
      type: "article",
    },
    alternates: {
      canonical: LINKS.Project.Project.href(),
    },
  });
  return mergeFn(props, parent);
};

export const generateStaticParams = async () => {
  return LOCALES.map((locale) => ({
    locale,
  }));
};

const ProjectPage = async (props: PageProps<"/[locale]/project">) => {
  const { locale } = await props.params;
  const t = await getTranslations("Landing.ProjectDescription");

  const projectPageJsonLd: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: t("title"),
    inLanguage: locale,
    url: createLocalizedUrl(locale, LINKS.Project.Project.href()),
  };

  return (
    <LayoutMain>
      <LayoutHeader>
        <LayoutTitle>{t("title")}</LayoutTitle>
      </LayoutHeader>
      <ProjectDescriptionSection locale={locale} />
      <LayoutHeader>
        {/* Hardcoded text ok */}
        <LayoutTitle>F.A.Q</LayoutTitle>
      </LayoutHeader>
      <FaqSection locale={locale} />
      <JsonLd data={projectPageJsonLd} />
    </LayoutMain>
  );
};

export default ProjectPage;
