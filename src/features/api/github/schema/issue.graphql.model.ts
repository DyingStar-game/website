import { assigneeSchema } from "@feat/api/github/schema/assignnee.graphql.model";
import { labelSchema } from "@feat/api/github/schema/label.graphql.model";
import { graphqlPageInfoSchema } from "@feat/api/github/schema/pageInfo.graphql.model";
import { z } from "zod";

const nodesSchema = <T extends z.ZodTypeAny>(schema: T) => {
  return z.object({
    nodes: z.array(schema),
  });
};

const contentSchema = z.object({
  id: z.string(),
  assignees: nodesSchema(assigneeSchema),
  title: z.string(),
  url: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  labels: nodesSchema(labelSchema),
});

const itemFieldValue = z.union([
  z.object({
    text: z.string().optional(),
    name: z.string().optional(),
    color: z.string().optional(),
    field: z
      .object({
        name: z.string(),
      })
      .optional(),
  }),
  z.object({}).strict(),
]);

const issueSchema = z.object({
  id: z.string(),
  project: z.object({
    title: z.string(),
    number: z.number(),
  }),
  content: contentSchema,
  fieldValues: nodesSchema(itemFieldValue),
});

export const graphqlProjectIssueSchema = z.object({
  id: z.string(),
  projectItems: nodesSchema(issueSchema),
});

export type GraphqlProjectIssueType = z.infer<typeof graphqlProjectIssueSchema>;

export const graphqlProjectIssuesResponseSchema = z.object({
  search: nodesSchema(graphqlProjectIssueSchema).extend({
    issueCount: z.number(),
    pageInfo: graphqlPageInfoSchema,
  }),
});

export const graphqlProjectIssueResponseSchema = z.object({
  node: graphqlProjectIssueSchema,
});

export type GraphqlProjectIssuesResponseType = z.infer<
  typeof graphqlProjectIssuesResponseSchema
>;

export type GraphqlProjectIssueResponseType = z.infer<
  typeof graphqlProjectIssueResponseSchema
>;
