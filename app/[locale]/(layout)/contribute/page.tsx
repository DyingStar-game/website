import { getQueryClient } from "@feat/api/get-query-client";
import { fetchProjectsOptions } from "@feat/api/github/hooks/useGitHubData";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import Tasks from "./tasks";

export default async function ContributePage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(fetchProjectsOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Tasks />
    </HydrationBoundary>
  );
}
