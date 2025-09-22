import { Typography } from "@components/DS/typography";
import { Layout, LayoutContent } from "@feat/page/layout";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import { SiteConfig } from "site-config";

const markdown = `Terms demo`;

export const metadata: Metadata = {
  title: `${SiteConfig.title} - Terms`,
  description: "Terms of service",
};

export const dynamic = "force-static";

export default function page() {
  return (
    <div>
      <div className="bg-card flex w-full items-center justify-center p-8 lg:p-12">
        <Typography variant="h1">Terms</Typography>
      </div>
      <Layout>
        <LayoutContent className="prose dark:prose-invert m-auto mb-8">
          <MDXRemote source={markdown} />
        </LayoutContent>
      </Layout>
    </div>
  );
}
