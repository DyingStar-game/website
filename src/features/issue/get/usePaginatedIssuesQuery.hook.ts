import { useQuery } from "@tanstack/react-query";

import type { GetPaginatedIssuesType } from "./getPaginatedIssues.model";
import { paginatedIssuesQueryOptions } from "./paginatedIssuesQuery.options";

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
