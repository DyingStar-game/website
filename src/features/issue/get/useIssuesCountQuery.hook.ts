import { resolveActionResult } from "@lib/actions/actions-utils";
import { githubFactory } from "@lib/tanstack/queryKey";
import { useQuery } from "@tanstack/react-query";

import { GetIssuesCountAction } from "./getIssuesCount.action";

export const useIssuesCountQuery = () => {
  const queryHook = useQuery({
    queryKey: githubFactory.ProjectCountPrefix,
    queryFn: async () => {
      const data = await resolveActionResult(GetIssuesCountAction());

      return data;
    },
  });

  return queryHook;
};
