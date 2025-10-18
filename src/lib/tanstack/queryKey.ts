import type { GetPaginatedIssuesType } from "@feat/issue/get/getPaginatedIssues.model";

export const githubFactory = {
  PaginatedIssuesPrefix: ["github_paginated_issues"] as const,
  PaginatedIssues: ({
    page,
    projects,
    query,
    pageSize,
  }: GetPaginatedIssuesType) =>
    [
      ...githubFactory.PaginatedIssuesPrefix,
      { page, query, projects, pageSize },
    ] as const,

  ProjectCountPrefix: ["github_project_count"] as const,
};
