import {
  type GraphqlProjectIssueResponseType,
  graphqlProjectIssueSchema,
} from "@feat/api/github/schema/issue.graphql.model";
import type { ProjectIssuesType } from "@feat/api/github/schema/projectIssues.model";
import { githubGraphql } from "@lib/github/githubApi";

import { GITHUB_ISSUE_FRAGMENT } from "./githubIssueFragments.graphql";
import { GraphqlProjectIssueResponseToProjectIssuesTypeMapper } from "./graphqlProjectIssueResponseToProjectIssuesType.mapper";

export const GetGithubIssue = async (
  issueId: string,
): Promise<ProjectIssuesType> => {
  const QUERY = `
  query GetIssue($issueId: ID!) {
    node(id: $issueId) {
      ${GITHUB_ISSUE_FRAGMENT}  
    }
  }
  `;

  const response = await githubGraphql<GraphqlProjectIssueResponseType>(QUERY, {
    issueId,
  });

  const projectIssue = graphqlProjectIssueSchema.safeParse(response.node);

  if (!projectIssue.success)
    throw new Error("Failed to map project issue", {
      cause: projectIssue.error,
    });

  return GraphqlProjectIssueResponseToProjectIssuesTypeMapper(
    projectIssue.data,
  );
};
