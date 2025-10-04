import type { FacetHit } from "meilisearch";
import z from "zod";

export const IssuesCountSchema = z.object({
  openIssueCount: z.number(),
  openIssueWithAssigneeCount: z.number(),
  countByProject: z.array(z.custom<FacetHit>()),
});

export type IssuesCountType = z.infer<typeof IssuesCountSchema>;
