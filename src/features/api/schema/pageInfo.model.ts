import { z } from "zod";

export const pageInfoSchema = z.object({
  totalPages: z.number(),
  currentPage: z.number(),
  previousPage: z.number().nullish(),
  nextPage: z.number().nullish(),
});

export type PageInfoType = z.infer<typeof pageInfoSchema>;
