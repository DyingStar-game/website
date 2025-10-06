import type {
  GraphqlProjectIssuesResponseType,
  ProjectIssuesType,
} from "@feat/api/github/schema/projectIssues.model";
import { graphqlProjectIssueSchema } from "@feat/api/github/schema/projectIssues.model";
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

  const response = await githubGraphql<GraphqlProjectIssuesResponseType>(
    QUERY,
    {
      issueId,
    },
  );

  const projectIssue = graphqlProjectIssueSchema.safeParse(response);

  if (!projectIssue.success)
    throw new Error("Failed to map project issue", {
      cause: projectIssue.error,
    });

  return GraphqlProjectIssueResponseToProjectIssuesTypeMapper(
    projectIssue.data,
  );
};
