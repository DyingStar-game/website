import { ProjectDescriptionSection } from "@app/[locale]/(layout)/project/_components/projectDescriptionSection";
import { LayoutHeader, LayoutMain, LayoutTitle } from "@feat/page/layout";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SiteConfig } from "siteConfig";

import { FaqSection } from "./_components/faqSection";

export const metadata: Metadata = {
  title: `${SiteConfig.title} - Project`,
  description: "Project",
};

const ProjectPage = async () => {
  const t = await getTranslations("Landing.ProjectDescription");
  return (
    <LayoutMain>
      <LayoutHeader>
        <LayoutTitle>{t("title")}</LayoutTitle>
      </LayoutHeader>
      <ProjectDescriptionSection />
      <LayoutHeader>
        {/* Text en dure ok*/}
        <LayoutTitle>F.A.Q</LayoutTitle>
      </LayoutHeader>
      <FaqSection />
    </LayoutMain>
  );
};

export default ProjectPage;
