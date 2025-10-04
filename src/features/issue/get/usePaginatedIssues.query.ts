import { resolveActionResult } from "@lib/actions/actions-utils";
import { useQuery } from "@tanstack/react-query";

import { GetPaginatedIssuesAction } from "./getPaginatedIssues.action";
import type { GetPaginatedIssuesType } from "./getPaginatedIssues.type";

export const usePaginatedIssuesQuery = ({
  page,
  query,
  projects,
  pageSize,
}: GetPaginatedIssuesType) => {
  const queryHook = useQuery({
    queryKey: ["github_project_issues", { page, query, projects, pageSize }], //TODO: Github.keyFactory
    queryFn: async () => {
      const issues = await resolveActionResult(
        GetPaginatedIssuesAction({
          page,
          query,
          projects,
          pageSize,
        }),
      );

      return issues;
    },
  });

  return queryHook;
};
