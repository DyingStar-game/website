import type { GetPaginatedIssuesType } from "@feat/issue/get/getPaginatedIssues.model";
import { paginatedIssuesQueryOptions } from "@feat/issue/get/paginatedIssuesQuery.options";
import { useQuery } from "@tanstack/react-query";

export const usePaginatedIssuesQuery = ({
  page,
  query,
  projects,
  pageSize,
}: GetPaginatedIssuesType) => {
  const queryHook = useQuery(
    paginatedIssuesQueryOptions({ page, query, projects, pageSize }),
  );

  return queryHook;
};
