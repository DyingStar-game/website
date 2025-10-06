import { resolveActionResult } from "@lib/actions/actions-utils";
import { githubFactory } from "@lib/tanstack/queryKey";

import { GetPaginatedIssuesAction } from "./getPaginatedIssues.action";
import type { GetPaginatedIssuesType } from "./getPaginatedIssues.model";

export const paginatedIssuesQueryOptions = ({
  page = 1,
  query = "",
  projects = [],
  pageSize = 6,
}: Partial<GetPaginatedIssuesType> = {}) => {
  return {
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
  };
};
