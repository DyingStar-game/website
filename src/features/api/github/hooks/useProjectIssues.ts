import { queryOptions } from "@tanstack/react-query";

import { projectIssuesSchema } from "../schema/projectIssues.model";

export function projectIssuesQueryOptions() {
  return queryOptions({
    queryKey: ["github_projects"],
    queryFn: async () => {
      const res = await fetch("/api/github/project-issues", {});
      if (!res.ok) {
        throw new Error("Erreur récupération issues");
      }

      const data = await res.json();

      return projectIssuesSchema.parse(data);
    },
  });
}
