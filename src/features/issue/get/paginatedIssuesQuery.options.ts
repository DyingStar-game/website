import { GetPaginatedIssuesAction } from "@feat/issue/get/getPaginatedIssues.action";
import type { GetPaginatedIssuesType } from "@feat/issue/get/getPaginatedIssues.model";
import { resolveActionResult } from "@lib/actions/actionsUtils";
import { githubFactory } from "@lib/tanstack/queryKey";

export const paginatedIssuesQueryOptions = ({
  page = 1,
  query = "",
  projects = [],
  pageSize = 12,
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
