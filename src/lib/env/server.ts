import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    MEILI_URL: z.string(),
    MEILI_MASTER_KEY: z.string(),

    GH_WEBHOOK_SECRET: z.string(),
    GITHUB_TOKEN: z.string(),

    LAST_YOUTUBE_ID: z.string().optional(),
  },
  experimental__runtimeEnv: process.env,
});
