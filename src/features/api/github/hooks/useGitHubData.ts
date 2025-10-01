import { queryOptions } from "@tanstack/react-query";

import { githubGraphql } from "../githubApi";
import {
  type GraphqlProjectIssuesResponseType,
  type ProjectIssuesType,
  projectIssuesSchema,
} from "../schema/projectIssues.model";

export async function fetchProjectIssues(): Promise<ProjectIssuesType> {
  const QUERY = `
  query GetOrganizationProjectV2Issues($org: String!) {
  organization(login: $org) {
    projectsV2(first: 15) {
      nodes {
        title
        number
        url
        items(first: 50) {
          nodes {
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
                ... on ProjectV2ItemFieldDateValue {
                  date
                  field {
                    ... on ProjectV2Field {
                      name
                    }
                  }
                }
                ... on ProjectV2ItemFieldIterationValue {
                  title
                  startDate
                  duration
                  field {
                    ... on ProjectV2IterationField {
                      name
                    }
                  }
                }
              }
            }
            content {
              ... on Issue {
                id
                title
                url
                state
                createdAt
                updatedAt
                labels(first: 10) {
                  nodes {
                    name
                  }
                }
                assignees(first: 30) {
                  nodes {
                    login
                    avatarUrl
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`;

  const response: GraphqlProjectIssuesResponseType =
    await githubGraphql<GraphqlProjectIssuesResponseType>(QUERY, {
      org: process.env.NEXT_PUBLIC_GITHUB_REPO,
    });

  const allIssues: ProjectIssuesType = [];

  for (const project of response.organization.projectsV2.nodes) {
    if (project.items.nodes.length === 0) {
      continue;
    }

    const projectIssues = project.items.nodes
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
          project_name: project.title,
          project_number: project.number,
          status: statusField?.name ?? null,
          priority: priorityField?.name ?? null,
          team: teamField?.name ?? null,
          labels: item.content.labels.nodes.map((label) => label.name),
          assignees: item.content.assignees.nodes.map((assignee) => ({
            login: assignee.login,
            avatar_url: assignee.avatarUrl,
          })),
          size: sizeField?.name ?? null,
          discord_url: discordField?.text ?? null,
        };
      });

    allIssues.push(...projectIssues);
  }

  return projectIssuesSchema.parse(allIssues);
}

export const fetchProjectIssuesOptions = () => {
  return queryOptions({
    queryKey: ["github_projects"],
    queryFn: async () => fetchProjectIssues(),
  });
};
