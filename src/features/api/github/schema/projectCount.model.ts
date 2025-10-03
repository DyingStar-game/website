import { z } from "zod";

export const projectCountSchema = z.object({
  openIssueCount: z.number(),
  openIssueWithAssigneeCount: z.number(),
  countByProject: z.array(
    z.object({
      value: z.string(),
      count: z.number(),
    }),
  ),
});

export type ProjectCountSchemaType = z.infer<typeof projectCountSchema>;
