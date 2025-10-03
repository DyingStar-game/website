import { queryOptions } from "@tanstack/react-query";

import { paginateIndexedProjectIssuesSchema } from "../schema/projectIssues.model";

export function projectIssuesQueryOptions(pageIndex: number, query?: string) {
  return queryOptions({
    queryKey: ["github_project_issues", { pageIndex, query }],
    queryFn: async ({ signal }) => {
      const params = new URLSearchParams();
      if (pageIndex) params.set("page", pageIndex.toString());
      if (query) params.set("query", query);

      const qs = params.toString();

      const res = await fetch(
        `/api/github/project-issues${qs ? `?${qs}` : ""}`,
        {
          signal,
        },
      );
      if (!res.ok) {
        throw new Error("Erreur récupération issues");
      }

      const data = await res.json();

      return paginateIndexedProjectIssuesSchema.parse(data);
    },
  });
}
