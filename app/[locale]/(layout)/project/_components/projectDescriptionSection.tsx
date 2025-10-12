import { ServerMdx } from "@feat/markdown/serverMdx";
import { LayoutSection } from "@feat/page/layout";
import fs from "fs";
import type { Locale } from "next-intl";
import path from "path";

type ProjectDescriptionSectionProps = {
  locale: Locale;
};

export const ProjectDescriptionSection = async ({
  locale,
}: ProjectDescriptionSectionProps) => {
  const markdownPath = path.join(
    process.cwd(),
    `content`,
    locale,
    `projectDescription.${locale}.md`,
  );
  const markdown = fs.readFileSync(markdownPath, "utf8");

  return (
    <LayoutSection size="container" className="gap-6">
      <ServerMdx source={markdown} />
    </LayoutSection>
  );
};
