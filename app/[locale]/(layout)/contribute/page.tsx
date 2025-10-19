import { Issues } from "@app/[locale]/(layout)/contribute/_components/issues";
import Hero from "@components/DS/hero/hero";
import { paginatedIssuesQueryOptions } from "@feat/issue/get/paginatedIssuesQuery.options";
import { LINKS } from "@feat/navigation/Links";
import { LayoutMain } from "@feat/page/layout";
// import { Locale } from "@i18n/config";
import { combineWithParentMetadata } from "@lib/metadata";
import { getQueryClient } from "@lib/tanstack/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";

export const generateMetadata = async (
  props: {
    params: Record<string, string>;
    searchParams?: Record<string, string | string[] | undefined>;
  },
  parent: ResolvingMetadata,
) => {
  const t = await getTranslations("Issue.Metadata");

  const mergeFn = combineWithParentMetadata({
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    openGraph: {
      url: LINKS.Project.Contribute.href(),
      type: "article",
    },
    alternates: {
      canonical: LINKS.Project.Contribute.href(),
    },
  });
  return mergeFn(props, parent);
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
