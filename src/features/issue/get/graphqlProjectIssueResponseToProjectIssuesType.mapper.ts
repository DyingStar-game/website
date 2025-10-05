import type { ProjectIssueType } from "@feat/api/github/schema/projectIssues.model";
import {
  type GraphqlProjectIssueType,
  type IssueSize,
  type ProjectIssuesType,
  projectIssueSchema,
} from "@feat/api/github/schema/projectIssues.model";

export const GraphqlProjectIssueResponseToProjectIssuesTypeMapper = (
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

      const issue: ProjectIssueType = {
        title: item.content.title,
        id: item.content.id,
        url: item.content.url,
        created_at: item.content.createdAt,
        updated_at: item.content.updatedAt,
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

      return projectIssueSchema.parse(issue);
    });
