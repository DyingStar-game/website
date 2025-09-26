import { ServerMdx } from "@feat/markdown/server-mdx";
import {
  LayoutHeader,
  LayoutMain,
  LayoutSection,
  LayoutTitle,
} from "@feat/page/layout";
import type { Metadata } from "next";
import { SiteConfig } from "site-config";

const markdown = `Terms demo`;

export const metadata: Metadata = {
  title: `${SiteConfig.title} - Terms`,
  description: "Terms of service",
};

export const dynamic = "force-static";

export default function page() {
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
}
