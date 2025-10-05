import { githubGraphql } from "@feat/api/github/githubApi";
import type {
  GraphqlProjectIssuesResponseType,
  ProjectIssuesType,
} from "@feat/api/github/schema/projectIssues.model";
import {
  type GraphqlPaginatedProjectIssuesType,
  graphqlPaginatedProjectIssuesSchema,
  graphqlProjectIssueResponseSchema,
  graphqlProjectIssuesResponseSchema,
} from "@feat/api/github/schema/projectIssues.model";
import { env } from "@lib/env/server";

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
        ... on Issue {
          id
          projectItems(first: 1) {
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
  }
  `;

  const response: GraphqlProjectIssuesResponseType =
    await githubGraphql<GraphqlProjectIssuesResponseType>(QUERY, {
      q: `org:${env.GITHUB_REPO} is:issue is:open`,
      searchPageSize: 30,
      cursor,
    });

  const projectIssues = graphqlProjectIssuesResponseSchema.parse(response);

  const allIssues: ProjectIssuesType = [];

  for (const project of projectIssues.search.nodes) {
    if (project.projectItems.nodes.length === 0) {
      continue;
    }

    const projectIssues = project.projectItems.nodes
      .filter((item) => Object.keys(item.content).length > 0)
      .map((node) => {
        const projectIssue = graphqlProjectIssueResponseSchema.safeParse(node);

        if (!projectIssue.success)
          throw new Error("Failed to fetch project issue");
        const issue = GraphqlProjectIssueResponseToProjectIssuesTypeMapper(
          projectIssue.data.node,
        );

        return issue;
      });

    allIssues.push(...projectIssues.flat());
  }

  const paginateProjectIssues: GraphqlPaginatedProjectIssuesType = {
    pageInfo: projectIssues.search.pageInfo,
    issues: allIssues,
  };

  return graphqlPaginatedProjectIssuesSchema.parse(paginateProjectIssues);
};
