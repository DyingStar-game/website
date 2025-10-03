import { z } from "zod";

export const projectCountSchema = z.object({
  openIssueCount: z.number(),
  openIssueWithAssigneeCount: z.number(),
});

export type ProjectCountSchemaType = z.infer<typeof projectCountSchema>;
