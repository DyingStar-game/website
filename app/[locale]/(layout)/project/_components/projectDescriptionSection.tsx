import { ServerMdx } from "@feat/markdown/serverMdx";
import { LayoutSection } from "@feat/page/layout";
import fs from "fs";
import { getLocale } from "next-intl/server";
import path from "path";

export const ProjectDescriptionSection = async () => {
  const locale = await getLocale();

  const markdownPath = path.join(
    process.cwd(),
    "content/project",
    `projectDesction.${locale}.md`,
  );
  const markdown = fs.readFileSync(markdownPath, "utf-8");

  return (
    <LayoutSection size="container" className="gap-6">
      <ServerMdx source={markdown} />
    </LayoutSection>
  );
};
