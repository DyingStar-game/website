import { queryOptions } from "@tanstack/react-query";

import { paginateProjectIssuesSchema } from "../schema/projectIssues.model";

export function projectIssuesQueryOptions(cursor?: string) {
  return queryOptions({
    queryKey: ["github_project_issues", { cursor: cursor }],
    queryFn: async ({ signal }) => {
      const res = await fetch(
        `/api/github/project-issues${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ""}`,
        { signal },
      );
      if (!res.ok) {
        throw new Error("Erreur récupération issues");
      }

      const data = await res.json();

      return paginateProjectIssuesSchema.parse(data);
    },
  });
}
