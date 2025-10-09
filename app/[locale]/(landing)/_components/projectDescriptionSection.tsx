import { Typography } from "@components/DS/typography";
import { LayoutContentTitle, LayoutSection } from "@feat/page/layout";
import { getTranslations } from "next-intl/server";

export const ProjectDescriptionSection = async () => {
  const t = await getTranslations("Landing.ProjectDescription");
  return (
    <LayoutSection size="container" className="gap-6">
      <LayoutContentTitle title={t("title")} />
      <Typography variant="p">{t("content")}</Typography>
    </LayoutSection>
  );
};
