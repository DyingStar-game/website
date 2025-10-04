import { Typography } from "@components/DS/typography";
import { getQueryClient } from "@feat/api/get-query-client";
import { Layout, LayoutMain, LayoutSection } from "@feat/page/layout";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

import Tasks from "./tasks";

export default async function ContributePage() {
  const queryClient = getQueryClient();
  const t = await getTranslations("Issue.IssueCTA");

  return (
    <LayoutMain>
      <LayoutSection>
        <Layout asChild padding="default">
          <div className="flex max-w-4xl flex-col justify-center text-center">
            <Typography variant="h1">{t("title")}</Typography>
            <Typography variant="p">{t("description")}</Typography>
          </div>
        </Layout>
      </LayoutSection>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Tasks />
      </HydrationBoundary>
    </LayoutMain>
  );
}
