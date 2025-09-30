import { z } from "zod";

export const simpleUserSchema = z.object({
  id: z.number(),
  name: z.string().nullish(),
  login: z.string(),
  avatar_url: z.string(),
});

export type SimpleUserType = z.infer<typeof simpleUserSchema>;
