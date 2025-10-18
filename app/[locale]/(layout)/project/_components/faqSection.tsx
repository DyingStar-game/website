import { ServerMdx } from "@feat/markdown/serverMdx";
import { LayoutSection } from "@feat/page/layout";
import fs from "fs";
import type { Locale } from "next-intl";
import path from "path";

type FaqSectionProps = {
  locale: Locale;
};
export const FaqSection = async ({ locale }: FaqSectionProps) => {
  const markdownPath = path.join(
    process.cwd(),
    `content`,
    locale,
    `faq.${locale}.md`,
  );
  const markdown = fs.readFileSync(markdownPath, "utf8");

  return (
    <LayoutSection size="container">
      <ServerMdx source={markdown} />
    </LayoutSection>
  );
};
