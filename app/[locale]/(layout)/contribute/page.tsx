import Hero from "@components/DS/hero/hero";
import { getQueryClient } from "@feat/api/get-query-client";
import { LayoutMain } from "@feat/page/layout";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

import { Issues } from "./_components/issues";

export default async function ContributePage() {
  const queryClient = getQueryClient();
  const t = await getTranslations("Issue.IssueCTA");

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
}
