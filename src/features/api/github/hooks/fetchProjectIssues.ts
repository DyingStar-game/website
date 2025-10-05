import { env } from "@lib/env/client";

import { githubGraphql } from "../githubApi";
import type {
  GraphqlPaginatedProjectIssuesType,
  GraphqlProjectIssueType,
  IssueSize,
} from "../schema/projectIssues.model";
import {
  type GraphqlProjectIssuesResponseType,
  type ProjectIssuesType,
  graphqlPaginatedProjectIssuesSchema,
  graphqlProjectIssueResponseSchema,
  graphqlProjectIssuesResponseSchema,
} from "../schema/projectIssues.model";

export async function fetchProjectIssues(
  cursor?: string,
): Promise<GraphqlPaginatedProjectIssuesType> {
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
      q: `org:${env.NEXT_PUBLIC_GITHUB_REPO} is:issue is:open`,
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
      .map((item) => {
        const statusField = item.fieldValues.nodes.find(
          (field) => field.field && field.field.name === "Status",
        );

        const priorityField = item.fieldValues.nodes.find(
          (field) => field.field && field.field.name === "Priority",
        );

        const teamField = item.fieldValues.nodes.find(
          (field) => field.field && field.field.name === "Team",
        );

        const sizeField = item.fieldValues.nodes.find(
          (field) => field.field && field.field.name === "Size",
        );

        const discordField = item.fieldValues.nodes.find(
          (field) => field.field && field.field.name === "Post Discord",
        );

        return {
          title: item.content.title,
          id: item.content.id,
          url: item.content.url,
          createdAt: item.content.createdAt,
          updatedAt: item.content.updatedAt,
          project_name: item.project.title
            .replace(/\p{Extended_Pictographic}/gu, "")
            .trim(),
          project_number: item.project.number,
          status: statusField?.name ?? null,
          priority: priorityField?.name ?? null,
          team: teamField?.name ?? null,
          labels: item.content.labels.nodes.map((label) => label.name),
          has_assignees: item.content.assignees.nodes.length > 0,
          assignees: item.content.assignees.nodes.map((assignee) => ({
            login: assignee.login,
            avatar_url: assignee.avatarUrl,
          })),
          size: sizeField?.name as IssueSize | null,
          discord_url: discordField?.text ?? null,
        };
      });

    allIssues.push(...projectIssues);
  }

  const paginateProjectIssues: GraphqlPaginatedProjectIssuesType = {
    pageInfo: projectIssues.search.pageInfo,
    issues: allIssues,
  };

  return graphqlPaginatedProjectIssuesSchema.parse(paginateProjectIssues);
}

export async function fetchProjectIssue(
  issueId: string,
): Promise<ProjectIssuesType> {
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
}

const GraphqlProjectIssueResponseToProjectIssuesTypeMapper = (
  projectIssue: GraphqlProjectIssueType,
): ProjectIssuesType =>
  projectIssue.projectItems.nodes
    .filter((item) => Object.keys(item.content).length > 0)
    .map((item) => {
      const statusField = item.fieldValues.nodes.find(
        (field) => field.field && field.field.name === "Status",
      );

      const priorityField = item.fieldValues.nodes.find(
        (field) => field.field && field.field.name === "Priority",
      );

      const teamField = item.fieldValues.nodes.find(
        (field) => field.field && field.field.name === "Team",
      );

      const sizeField = item.fieldValues.nodes.find(
        (field) => field.field && field.field.name === "Size",
      );

      const discordField = item.fieldValues.nodes.find(
        (field) => field.field && field.field.name === "Post Discord",
      );

      return {
        title: item.content.title,
        id: item.content.id,
        url: item.content.url,
        createdAt: item.content.createdAt,
        updatedAt: item.content.updatedAt,
        project_name: item.project.title
          .replace(/\p{Extended_Pictographic}/gu, "")
          .trim(),
        project_number: item.project.number,
        status: statusField?.name ?? null,
        priority: priorityField?.name ?? null,
        team: teamField?.name ?? null,
        labels: item.content.labels.nodes.map((label) => label.name),
        has_assignees: item.content.assignees.nodes.length > 0,
        assignees: item.content.assignees.nodes.map((assignee) => ({
          login: assignee.login,
          avatar_url: assignee.avatarUrl,
        })),
        size: sizeField?.name as IssueSize | null,
        discord_url: discordField?.text ?? null,
      };
    });

//TODO: split this file into multiple files
