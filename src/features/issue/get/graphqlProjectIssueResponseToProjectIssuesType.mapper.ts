import type { GraphqlProjectIssueType } from "@feat/api/github/schema/issue.graphql.model";
import type { IssueSize } from "@feat/api/github/schema/issueField.size.graphql";
import type { ProjectIssueType } from "@feat/api/github/schema/projectIssues.model";
import {
  type ProjectIssuesType,
  projectIssueSchema,
} from "@feat/api/github/schema/projectIssues.model";

export const GraphqlProjectIssueResponseToProjectIssuesTypeMapper = (
  projectIssue: GraphqlProjectIssueType,
): ProjectIssuesType =>
  projectIssue.projectItems.nodes
    .filter((item) => Object.keys(item.content).length > 0)
    .map((item) => {
      const getFieldByName = (name: string) =>
        item.fieldValues.nodes.find(
          (field) => field.field && field.field.name === name,
        ) ?? null;

      const issue: ProjectIssueType = {
        title: item.content.title,
        id: item.content.id,
        url: item.content.url,
        createdAt: item.content.createdAt,
        updatedAt: item.content.updatedAt,
        projectName: item.project.title
          .replace(/\p{Extended_Pictographic}/gu, "")
          .trim(),
        projectNumber: item.project.number,
        status: getFieldByName("Status")?.name?.toLowerCase().trim() ?? null,
        priority: getFieldByName("Priority")?.name?.trim() ?? null,
        team: getFieldByName("Team")?.name?.trim() ?? null,
        labels: item.content.labels.nodes.map((label) => label.name),
        hasAssignees: item.content.assignees.nodes.length > 0,
        assignees: item.content.assignees.nodes.map((assignee) => ({
          login: assignee.login,
          avatarUrl: assignee.avatarUrl ?? null,
        })),
        size: (getFieldByName("Size")?.name?.trim() ??
          null) as IssueSize | null,
        discordUrl: getFieldByName("Post Discord")?.text?.trim() ?? null,
      };

      return projectIssueSchema.parse(issue);
    });
