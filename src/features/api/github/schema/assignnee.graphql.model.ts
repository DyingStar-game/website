import { z } from "zod";

export const assigneeSchema = z.object({
  login: z.string(),
  avatarUrl: z.string().nullish(),
});
