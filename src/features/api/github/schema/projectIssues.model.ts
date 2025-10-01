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

const itemsSchema = z.object({
  nodes: z.array(
    z.object({
      content: itemContentSchema,
      fieldValues: itemFieldValues,
    }),
  ),
});

export const graphqlProjectIssuesResponseSchema = z.object({
  organization: z.object({
    projectsV2: z.object({
      nodes: z.array(
        z.object({
          number: z.number(),
          title: z.string(),
          url: z.string(),
          items: itemsSchema,
        }),
      ),
    }),
  }),
});

export enum IssueSize {
  "XS" = "XS",
  "S" = "S",
  "M" = "M",
  "L" = "L",
  "XL" = "XL",
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
  assignees: z.array(
    z.object({
      login: z.string(),
      avatar_url: z.string().nullish(),
    }),
  ),
  labels: z.array(z.string()),
});

export const projectIssuesSchema = z.array(projectIssueSchema);

export type GraphqlProjectIssuesResponseType = z.infer<
  typeof graphqlProjectIssuesResponseSchema
>;

export type ProjectIssueType = z.infer<typeof projectIssueSchema>;
export type ProjectIssuesType = z.infer<typeof projectIssuesSchema>;
