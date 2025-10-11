import { Issues } from "@app/[locale]/(layout)/contribute/_components/issues";
import Hero from "@components/DS/hero/hero";
import { paginatedIssuesQueryOptions } from "@feat/issue/get/paginatedIssuesQuery.options";
import { LayoutMain } from "@feat/page/layout";
import { getQueryClient } from "@lib/tanstack/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SiteConfig } from "siteConfig";

// TODO : Refactor
export const metadata: Metadata = {
  title: `${SiteConfig.title}'s contribute`,
  description: SiteConfig.description,
  keywords: ["contribute"],
  openGraph: {
    title: `${SiteConfig.title}'s contribute`,
    description: SiteConfig.description,
    url: SiteConfig.prodUrl,
    type: "article",
  },
};

const ContributePage = async () => {
  const queryClient = getQueryClient();
  const t = await getTranslations("Issue.Hero");

  void queryClient.prefetchQuery(paginatedIssuesQueryOptions());

  return (
    <>
      <Hero title={t("title")} description={t("description")} />
      <LayoutMain>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Issues />
        </HydrationBoundary>
      </LayoutMain>
    </>
  );
};

export default ContributePage;
