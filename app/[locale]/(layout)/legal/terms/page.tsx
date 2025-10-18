import { ServerMdx } from "@feat/markdown/serverMdx";
import {
  LayoutHeader,
  LayoutMain,
  LayoutSection,
  LayoutTitle,
} from "@feat/page/layout";
import type { Metadata } from "next";
import { SiteConfig } from "siteConfig";

const markdown = `Terms demo`;

export const metadata: Metadata = {
  title: `${SiteConfig.title} - Terms`,
  description: "Terms of service",
};

export const dynamic = "force-static";

const TermsPage = () => {
  return (
    <LayoutMain>
      <LayoutHeader>
        <LayoutTitle>Terms</LayoutTitle>
      </LayoutHeader>
      <LayoutSection>
        <ServerMdx source={markdown} />
      </LayoutSection>
    </LayoutMain>
  );
};

export default TermsPage;
