import { queryOptions } from "@tanstack/react-query";

import { paginateIndexedProjectIssuesSchema } from "../schema/projectIssues.model";

export function projectIssuesQueryOptions(pageIndex: number) {
  return queryOptions({
    queryKey: ["github_project_issues", { pageIndex }],
    queryFn: async ({ signal }) => {
      const res = await fetch(`/api/github/project-issues?page=${pageIndex}`, {
        signal,
      });
      if (!res.ok) {
        throw new Error("Erreur récupération issues");
      }

      const data = await res.json();

      return paginateIndexedProjectIssuesSchema.parse(data);
    },
  });
}
