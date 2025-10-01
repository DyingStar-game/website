import { getQueryClient } from "@feat/api/get-query-client";
import { fetchProjectIssuesOptions } from "@feat/api/github/hooks/useGitHubData";
import { LayoutMain } from "@feat/page/layout";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import Tasks from "./tasks";

export default async function ContributePage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(fetchProjectIssuesOptions());

  return (
    <LayoutMain>
      <HydrationBoundary state={dehydrate(queryClient)}>
        {/* {projects.map((project) => (
        <div key={project.id}>{project.id}</div>
      ))} */}
        <Tasks />
      </HydrationBoundary>
    </LayoutMain>
  );
}
