"use server";

import {
  getIssuesCount,
  getIssuesWithAssigneeCount,
  getProjectCount,
} from "@feat/api/github/hooks/indexedProjectIssues";
import { IssuesCountSchema } from "@feat/issue/get/IssuesCount.model";
import { action } from "@lib/actions/safeActions";

export const GetIssuesCountAction = action
  .outputSchema(IssuesCountSchema)
  .action(async () => {
    const openIssueCount = await getIssuesCount();
    const openIssueWithAssigneeCount = await getIssuesWithAssigneeCount();
    const countByProject = await getProjectCount();

    return IssuesCountSchema.parse({
      openIssueCount,
      openIssueWithAssigneeCount,
      countByProject,
    });
  });
