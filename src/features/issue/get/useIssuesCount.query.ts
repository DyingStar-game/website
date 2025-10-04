import { resolveActionResult } from "@lib/actions/actions-utils";
import { useQuery } from "@tanstack/react-query";

import { GetIssuesCountAction } from "./getIssuesCount.action";

export const useIssuesCountQuery = () => {
  const queryHook = useQuery({
    queryKey: ["github_project_count"], //TODO: Github.keyFactory
    queryFn: async () => {
      const data = await resolveActionResult(GetIssuesCountAction());

      return data;
    },
  });

  return queryHook;
};
