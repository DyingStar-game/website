import { ProjectDescriptionSection } from "@app/[locale]/(layout)/project/_components/projectDescriptionSection";
import { LayoutHeader, LayoutMain, LayoutTitle } from "@feat/page/layout";
import { LOCALES } from "@i18n/config";
import type { ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";

import { FaqSection } from "./_components/faqSection";
import { combineWithParentMetadata } from "@lib/metadata";
import { LINKS } from "@feat/navigation/Links";

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
    </LayoutMain>
  );
};

export default ProjectPage;
