import { queryOptions } from "@tanstack/react-query";

import { projectCountSchema } from "../schema/projectCount.model";

export function projectCountQueryOptions() {
  return queryOptions({
    queryKey: ["github_project_count"],
    queryFn: async ({ signal }) => {
      const res = await fetch(`/api/github/project-count`, { signal });
      if (!res.ok) {
        throw new Error("Erreur récupération count project");
      }

      const data = await res.json();

      return projectCountSchema.parse(data);
    },
  });
}
