import { githubGraphql } from "@feat/api/github/githubApi";
import type {
  GraphqlProjectIssuesResponseType,
  ProjectIssuesType,
} from "@feat/api/github/schema/projectIssues.model";
import { graphqlProjectIssueResponseSchema } from "@feat/api/github/schema/projectIssues.model";

import { GraphqlProjectIssueResponseToProjectIssuesTypeMapper } from "./graphqlProjectIssueResponseToProjectIssuesType.mapper";

export const GetGithubIssue = async (
  issueId: string,
): Promise<ProjectIssuesType> => {
  const QUERY = `
  query GetIssue($issueId: ID!) {
  node(id: $issueId) {
      ... on Issue {
        id
        title
        projectItems(first: 1){
          nodes {
            id
            project {
              title
              number
            }
            content {
                ... on Issue {
                  id
                  title
                  url
                  state
                  createdAt
                  updatedAt
                  labels(first: 5) {
                    nodes {
                      name
                    }
                  }
                  assignees(first: 10) {
                    nodes {
                      login
                      avatarUrl
                    }
                  }
                }
              }
            fieldValues(first: 10) {
                nodes {
                  ... on ProjectV2ItemFieldTextValue {
                    text
                    field {
                      ... on ProjectV2Field {
                        name
                      }
                    }
                  }
                  ... on ProjectV2ItemFieldNumberValue {
                    number
                    field {
                      ... on ProjectV2Field {
                        name
                      }
                    }
                  }
                  ... on ProjectV2ItemFieldSingleSelectValue {
                    name
                    color
                    field {
                      ... on ProjectV2SingleSelectField {
                        name
                      }
                    }
                  }
                }
              }
          }
      }
    }
}
  }
  `;

  const response: GraphqlProjectIssuesResponseType =
    await githubGraphql<GraphqlProjectIssuesResponseType>(QUERY, {
      issueId,
    });

  const projectIssue = graphqlProjectIssueResponseSchema.safeParse(response);

  if (!projectIssue.success) throw new Error("Failed to fetch project issue");

  return GraphqlProjectIssueResponseToProjectIssuesTypeMapper(
    projectIssue.data.node,
  );
};
