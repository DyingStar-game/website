import { getQueryClient } from "@feat/api/get-query-client";
import { projectIssuesQueryOptions } from "@feat/api/github/hooks/useProjectIssues";
import { LayoutMain } from "@feat/page/layout";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import Tasks from "./tasks";

export default async function ContributePage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(projectIssuesQueryOptions());

  return (
    <LayoutMain>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Tasks />
      </HydrationBoundary>
    </LayoutMain>
  );
}
