import { z } from "zod";

const assigneesSchema = z.object({
  nodes: z.array(
    z.object({
      login: z.string(),
      avatarUrl: z.string().nullish(),
    }),
  ),
});

const itemLabelsSchema = z.object({
  nodes: z.array(
    z.object({
      name: z.string(),
    }),
  ),
});

const itemContentSchema = z.object({
  assignees: assigneesSchema,
  id: z.string(),
  title: z.string(),
  url: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  labels: itemLabelsSchema,
});

const itemFieldValues = z.object({
  nodes: z.array(
    z.union([
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
    ]),
  ),
});

const projectItemsSchema = z.object({
  nodes: z.array(
    z.object({
      id: z.string(),
      project: z.object({
        title: z.string(),
        number: z.number(),
      }),
      content: itemContentSchema,
      fieldValues: itemFieldValues,
    }),
  ),
});

const graphqlPageInfoSchema = z.object({
  hasNextPage: z.boolean(),
  endCursor: z.string().nullish(),
});

export type GraphqlPageInfoType = z.infer<typeof graphqlPageInfoSchema>;

export const graphqlProjectIssueSchema = z.object({
  id: z.string(),
  projectItems: projectItemsSchema,
});
export type GraphqlProjectIssueType = z.infer<typeof graphqlProjectIssueSchema>;

export const graphqlProjectIssuesResponseSchema = z.object({
  search: z.object({
    issueCount: z.number(),
    pageInfo: graphqlPageInfoSchema,
    nodes: z.array(graphqlProjectIssueSchema),
  }),
});

export type GraphqlProjectIssuesResponseType = z.infer<
  typeof graphqlProjectIssuesResponseSchema
>;

export const graphqlProjectIssueResponseSchema = z.object({
  node: graphqlProjectIssueSchema,
});

export type GraphqlProjectIssueResponseType = z.infer<
  typeof graphqlProjectIssueResponseSchema
>;

export enum IssueSize {
  XS = "XS",
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
}

export const isValidIssueSize = (value: string): value is IssueSize => {
  return Object.values(IssueSize).includes(value as IssueSize);
};

export const sizeToVariant: Record<
  IssueSize,
  "veryEasy" | "easy" | "moderate" | "advance" | "expert"
> = {
  [IssueSize.XS]: "veryEasy",
  [IssueSize.S]: "easy",
  [IssueSize.M]: "moderate",
  [IssueSize.L]: "advance",
  [IssueSize.XL]: "expert",
};

export const projectIssueSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
  project_name: z.string(),
  project_number: z.number(),
  status: z.string().nullish(),
  priority: z.string().nullish(),
  team: z.string().nullish(),
  size: z.enum(IssueSize).nullish(),
  discord_url: z.string().nullish(),
  has_assignees: z.boolean(),
  assignees: z.array(
    z.object({
      login: z.string(),
      avatar_url: z.string().nullish(),
    }),
  ),
  labels: z.array(z.string()),
  created_at: z.string(),
  updated_at: z.string(),
});

export const projectIssuesSchema = z.array(projectIssueSchema);
export type ProjectIssueType = z.infer<typeof projectIssueSchema>;
export type ProjectIssuesType = z.infer<typeof projectIssuesSchema>;

export const graphqlPaginatedProjectIssuesSchema = z.object({
  pageInfo: graphqlPageInfoSchema,
  issues: projectIssuesSchema,
});

export type GraphqlPaginatedProjectIssuesType = z.infer<
  typeof graphqlPaginatedProjectIssuesSchema
>;

const pageInfoSchema = z.object({
  totalPages: z.number(),
  currentPage: z.number(),
  previousPage: z.number().nullish(),
  nextPage: z.number().nullish(),
});

export type PageInfoType = z.infer<typeof pageInfoSchema>;

export const PaginateIndexedProjectIssuesSchema = z.object({
  issueCount: z.number(),
  pageInfo: pageInfoSchema,
  issues: projectIssuesSchema,
});
export type PaginateIndexedProjectIssuesType = z.infer<
  typeof PaginateIndexedProjectIssuesSchema
>;
