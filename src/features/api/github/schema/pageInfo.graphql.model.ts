import { z } from "zod";

export const graphqlPageInfoSchema = z.object({
  hasNextPage: z.boolean(),
  endCursor: z.string().nullish(),
});

export type GraphqlPageInfoType = z.infer<typeof graphqlPageInfoSchema>;
