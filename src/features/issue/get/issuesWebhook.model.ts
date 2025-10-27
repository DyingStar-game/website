import { z } from "zod";

export enum ActionEnum {
  ISSUES = "issues",
  SUB_ISSUES = "sub_issues",
  ISSUE_DEPENDENCIES = "issue_dependencies",
  PROJECTS_V2_ITEM = "projects_v2_item",
}

const issue_actions = [
  // "assigned",
  "closed",
  "deleted",
  "edited",
  // "labeled",
  "locked",
  "opened",
  "pinned",
  "reopened",
  "typed",
  // "unassigned",
  // "unlabeled",
  "unlocked",
  "unpinned",
  "untyped",
] as const;

const issue_dependencies_actions = [
  "blocked_by_added",
  "blocked_by_removed",
  "blocking_added",
  "blocking_removed",
] as const;

const sub_issues_actions = [
  "parent_issue_added",
  "parent_issue_removed",
] as const;

const projects_v2_item_actions = [
  "created",
  "deleted",
  "edited",
  "restored",
] as const;

const projects_v2_status_update_actions = [
  "created",
  "deleted",
  "edited",
] as const;

export const issueBodySchema = z.object({
  action: z.enum([...issue_actions]),
  issue: z.object({
    node_id: z.string(),
  }),
});
export const issueDependenciesBodySchema = z.object({
  action: z.enum([...issue_dependencies_actions]),
  blocked_issue: z.object({
    node_id: z.string(),
  }),
  blocking_issue: z.object({
    node_id: z.string(),
  }),
});
export const subIssueciesBodySchema = z.object({
  action: z.enum([...sub_issues_actions]),
  sub_issue: z.object({
    node_id: z.string(),
  }),
});
export const projectsV2BodySchema = z.object({
  action: z.enum([
    ...projects_v2_item_actions,
    ...projects_v2_status_update_actions,
  ]),
  projects_v2_item: z.object({
    content_node_id: z.string(),
  }),
});

export const webhookActionSchema = z.object({
  action: z.string(),
  node_id: z.string(),
  secondary_node_id: z.string().nullish(),
});

export type WebhookActionType = z.infer<typeof webhookActionSchema>;
