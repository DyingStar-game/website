import { z } from "zod";

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

const projectsV2BodySchema = z.object({
  action: z.enum([
    ...projects_v2_item_actions,
    ...projects_v2_status_update_actions,
  ]),
  projects_v2_item: z.object({
    node_id: z.string(),
  }),
});

const issueBodySchema = z.object({
  action: z.enum(issue_actions),
  issue: z.object({
    node_id: z.string(),
  }),
});

export const IssuesWebhookSchema = z.union([
  projectsV2BodySchema,
  issueBodySchema,
]);

export type IssuesWebhookType = z.infer<typeof IssuesWebhookSchema>;
