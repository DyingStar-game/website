import { z } from "zod";

export const graphqlOpenIssueWithAssigneeCountResponseSchema = z.object({
  search: z.object({
    issueCount: z.number(),
    nodes: z.array(
      z.object({
        assignees: z.object({
          totalCount: z.number(),
        }),
      }),
    ),
  }),
});

export type GraphqlOpenIssueWithAssigneeCountResponseType = z.infer<
  typeof graphqlOpenIssueWithAssigneeCountResponseSchema
>;

export const projectCountSchema = z.object({
  openIssueWithAssigneeCount: z.number(),
});

export type ProjectCountSchemaType = z.infer<typeof projectCountSchema>;
