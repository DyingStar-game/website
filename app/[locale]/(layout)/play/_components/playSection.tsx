import { ServerMdx } from "@feat/markdown/serverMdx";
import { LayoutSection } from "@feat/page/layout";
import fs from "fs";
import type { Locale } from "next-intl";
import path from "path";

type PlaySectionProps = {
  locale: Locale;
};

export const PlaySection = async ({ locale }: PlaySectionProps) => {
  const markdownPath = path.join(
    process.cwd(),
    `content`,
    locale,
    `projectPlay.${locale}.md`,
  );
  const markdown = fs.readFileSync(markdownPath, "utf8");

  return (
    <LayoutSection size="container" className="gap-6">
      <ServerMdx source={markdown} />
    </LayoutSection>
  );
};
