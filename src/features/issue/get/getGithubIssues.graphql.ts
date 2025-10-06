import type {
  GraphqlProjectIssuesResponseType,
  ProjectIssuesType,
} from "@feat/api/github/schema/projectIssues.model";
import {
  type GraphqlPaginatedProjectIssuesType,
  graphqlPaginatedProjectIssuesSchema,
  graphqlProjectIssuesResponseSchema,
} from "@feat/api/github/schema/projectIssues.model";
import { env } from "@lib/env/server";
import { githubGraphql } from "@lib/github/githubApi";

import { GITHUB_ISSUE_FRAGMENT } from "./githubIssueFragments.graphql";
import { GraphqlProjectIssueResponseToProjectIssuesTypeMapper } from "./graphqlProjectIssueResponseToProjectIssuesType.mapper";

export const GetGithubIssues = async (
  cursor?: string,
): Promise<GraphqlPaginatedProjectIssuesType> => {
  const QUERY = `
  query GetIssues($q: String!, $searchPageSize: Int = 5, $cursor: String) {
    search(first: $searchPageSize, after: $cursor, query: $q, type: ISSUE) {
      issueCount
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
      }
      nodes {
        ${GITHUB_ISSUE_FRAGMENT}
      }
    }
  }
  `;

  const response = await githubGraphql<GraphqlProjectIssuesResponseType>(
    QUERY,
    {
      q: `org:${env.GITHUB_REPO} is:issue is:open`,
      searchPageSize: 30,
      cursor,
    },
  );

  const projectIssues = graphqlProjectIssuesResponseSchema.parse(response);

  const allIssues: ProjectIssuesType = [];

  for (const project of projectIssues.search.nodes) {
    if (project.projectItems.nodes.length === 0) {
      continue;
    }

    const projectIssues =
      GraphqlProjectIssueResponseToProjectIssuesTypeMapper(project);

    allIssues.push(...projectIssues.flat());
  }

  const paginateProjectIssues: GraphqlPaginatedProjectIssuesType = {
    pageInfo: projectIssues.search.pageInfo,
    issues: allIssues,
  };

  return graphqlPaginatedProjectIssuesSchema.parse(paginateProjectIssues);
};
