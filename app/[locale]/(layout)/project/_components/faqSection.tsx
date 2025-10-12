import { ServerMdx } from "@feat/markdown/serverMdx";
import { LayoutSection } from "@feat/page/layout";
import fs from "fs";
import { getLocale } from "next-intl/server";
import path from "path";

export const FaqSection = async () => {
  const locale = await getLocale();

  const markdownPath = path.join(
    process.cwd(),
    "content/faq",
    `faq.${locale}.md`,
  );
  const markdown = fs.readFileSync(markdownPath, "utf-8");

  return (
    <LayoutSection size="container">
      <ServerMdx source={markdown} />
    </LayoutSection>
  );
};
