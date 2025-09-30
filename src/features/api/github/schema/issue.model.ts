import { z } from "zod";

import { simpleUserSchema } from "./simpleUser.model";

const baseIssueSchema = z.object({
  id: z.number(),
  title: z.string().nullish(),
  body: z.string().nullable(),
  number: z.number().nullish(),
});

export const issueSchema = baseIssueSchema.extend({
  title: z.string(),
  body: z.string().nullable(),
  url: z.string(),
  state: z.string(),
  assignees: z.array(simpleUserSchema),
});

export const draftIssueSchema = baseIssueSchema;

export const issuesSchema = z.array(issueSchema);

export type IssueType = z.infer<typeof issueSchema>;
export type IssuesType = z.infer<typeof issuesSchema>;
