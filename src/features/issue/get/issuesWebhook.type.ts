import { z } from "zod";

export const IssuesWebhookSchema = z.object({
  action: z.enum([
    "assigned",
    "closed",
    "deleted",
    "edited",
    "labeled",
    "opened",
    "reopened",
    "transferred",
    "unassigned",
    "unlabeled",
    "unlocked",
    "unpinned",
  ]),
  issue: z.object({
    node_id: z.string(),
  }),
});

export type IssuesWebhookType = z.infer<typeof IssuesWebhookSchema>;
