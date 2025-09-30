import { z } from "zod";

import { draftIssueSchema, issueSchema } from "./issue.model";

export enum ContentTypeEnum {
  ISSUE = "Issue",
  PULL_REQUEST = "PullRequest",
  DRAFT_ISSUE = "DraftIssue",
}

const baseProjectItem = z.object({
  id: z.number(),
  project_number: z.number(),
});

export const projectItemSchema = z.discriminatedUnion("content_type", [
  baseProjectItem.extend({
    content_type: z.literal(ContentTypeEnum.ISSUE),
    content: issueSchema,
  }),
  baseProjectItem.extend({
    content_type: z.literal(ContentTypeEnum.DRAFT_ISSUE),
    content: draftIssueSchema,
  }),
]);

export const projectItemsSchema = z.array(projectItemSchema);

export type ProjectItemType = z.infer<typeof projectItemsSchema>;
export type ProjectItemsType = z.infer<typeof projectItemsSchema>;
