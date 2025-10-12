import { z } from "zod";

export const labelSchema = z.object({
  name: z.string(),
});
