import z from "zod";

export const GetPaginatedIssuesSchema = z.object({
  page: z.number(),
  pageSize: z.number().default(9).optional(),
  query: z.string(),
  projects: z.array(z.string()),
});

export type GetPaginatedIssuesType = z.infer<typeof GetPaginatedIssuesSchema>;
