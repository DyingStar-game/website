import { resolveActionResult } from "@lib/actions/actions-utils";
import { githubFactory } from "@lib/tanstack/queryKey";
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
    queryKey: githubFactory.PaginatedIssues({
      page,
      query,
      projects,
      pageSize,
    }),
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
