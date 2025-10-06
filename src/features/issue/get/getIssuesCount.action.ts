"use server";

import {
  getIssuesCount,
  getIssuesWithAssigneeCount,
  getProjectCount,
} from "@feat/api/github/hooks/indexedProjectIssues";
import { action } from "@lib/actions/safe-actions";

import { IssuesCountSchema } from "./IssuesCount.model";

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
