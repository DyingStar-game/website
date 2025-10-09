import { pageInfoSchema } from "@feat/api/schema/pageInfo.model";
import { z } from "zod";

import { IssueSize } from "./issueField.size.graphql";
import { graphqlPageInfoSchema } from "./pageInfo.graphql.model";

export const projectIssueSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
  projectName: z.string(),
  projectNumber: z.number(),
  status: z.string().nullable(),
  priority: z.string().nullable(),
  team: z.string().nullable(),
  size: z.enum(IssueSize).nullable(),
  discordUrl: z.string().nullable(),
  hasAssignees: z.boolean(),
  assignees: z.array(
    z.object({
      login: z.string(),
      avatarUrl: z.string().nullable(),
    }),
  ),
  labels: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ProjectIssueType = z.infer<typeof projectIssueSchema>;

export const projectIssuesSchema = z.array(projectIssueSchema);

export type ProjectIssuesType = z.infer<typeof projectIssuesSchema>;

export const graphqlPaginatedProjectIssuesSchema = z.object({
  pageInfo: graphqlPageInfoSchema,
  issues: projectIssuesSchema,
});

export type GraphqlPaginatedProjectIssuesType = z.infer<
  typeof graphqlPaginatedProjectIssuesSchema
>;

export const PaginateIndexedProjectIssuesSchema = z.object({
  issueCount: z.number(),
  pageInfo: pageInfoSchema,
  issues: projectIssuesSchema,
});
export type PaginateIndexedProjectIssuesType = z.infer<
  typeof PaginateIndexedProjectIssuesSchema
>;
