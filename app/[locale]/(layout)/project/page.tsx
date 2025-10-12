import { ProjectDescriptionSection } from "@app/[locale]/(layout)/project/_components/projectDescriptionSection";
import { LayoutHeader, LayoutMain, LayoutTitle } from "@feat/page/layout";
import { LOCALES } from "@i18n/config";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SiteConfig } from "siteConfig";

import { FaqSection } from "./_components/faqSection";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: `${SiteConfig.title} - Project`,
  description: "Project",
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
