import { Typography } from "@components/DS/typography";
import { getQueryClient } from "@feat/api/get-query-client";
import { Layout, LayoutMain, LayoutSection } from "@feat/page/layout";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

import { Issues } from "./_components/issues";

export default async function ContributePage() {
  const queryClient = getQueryClient();
  const t = await getTranslations("Issue.IssueCTA");

  return (
    <>
      <LayoutSection>
        <Layout asChild padding="none">
          <div className="flex max-w-4xl flex-col justify-center pt-15 text-center md:pt-20 lg:pt-22">
            <Typography variant="h1">{t("title")}</Typography>
            <Typography variant="p">{t("description")}</Typography>
          </div>
        </Layout>
      </LayoutSection>
      <LayoutMain>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Issues />
        </HydrationBoundary>
      </LayoutMain>
    </>
  );
}
