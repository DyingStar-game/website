import { GetIssuesCountAction } from "@feat/issue/get/getIssuesCount.action";
import { resolveActionResult } from "@lib/actions/actionsUtils";
import { githubFactory } from "@lib/tanstack/queryKey";
import { useQuery } from "@tanstack/react-query";

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
