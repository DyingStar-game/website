"use server";

import { searchProjectIssues } from "@feat/api/github/hooks/indexedProjectIssues";
import { PaginateIndexedProjectIssuesSchema } from "@feat/api/github/schema/projectIssues.model";
import { GetPaginatedIssuesSchema } from "@feat/issue/get/getPaginatedIssues.model";
import { action } from "@lib/actions/safeActions";

export const GetPaginatedIssuesAction = action
  .inputSchema(GetPaginatedIssuesSchema)
  .outputSchema(PaginateIndexedProjectIssuesSchema)
  .action(async ({ parsedInput: { page, pageSize, projects, query } }) => {
    const result = await searchProjectIssues(page, query, projects, pageSize);

    return PaginateIndexedProjectIssuesSchema.parse(result);
  });
