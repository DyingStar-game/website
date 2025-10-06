"use server";

import { searchProjectIssues } from "@feat/api/github/hooks/indexedProjectIssues";
import { PaginateIndexedProjectIssuesSchema } from "@feat/api/github/schema/projectIssues.model";
import { action } from "@lib/actions/safe-actions";

import { GetPaginatedIssuesSchema } from "./getPaginatedIssues.type";

export const GetPaginatedIssuesAction = action
  .inputSchema(GetPaginatedIssuesSchema)
  .outputSchema(PaginateIndexedProjectIssuesSchema)
  .action(async ({ parsedInput: { page, pageSize, projects, query } }) => {
    const result = await searchProjectIssues(page, query, projects, pageSize);

    return PaginateIndexedProjectIssuesSchema.parse(result);
  });
