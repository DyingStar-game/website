import { getQueryClient } from "@feat/api/get-query-client";
import {
  fetchProjectItemsOptions,
  fetchProjectsOptions,
} from "@feat/api/github/hooks/useGitHubData";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import Tasks from "./tasks";

export default async function ContributePage() {
  const queryClient = getQueryClient();

  const projects = await queryClient.fetchQuery(fetchProjectsOptions());

  await Promise.all([
    ...projects.map(async (project) =>
      queryClient.prefetchQuery(fetchProjectItemsOptions(project.number, 1)),
    ),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Tasks />
    </HydrationBoundary>
  );
}
