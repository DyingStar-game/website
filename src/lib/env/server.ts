import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NEXT_ENV: z.literal("production"),
    LAST_YOUTUBE_ID: z.string().optional(),
    DISCORD_INVITE_ID: z.string(),
    MEILI_URL: z.string(),
    MEILI_MASTER_KEY: z.string(),
    GH_WEBHOOK_SECRET: z.string(),
    GITHUB_TOKEN: z.string(),
    GITHUB_REPO: z.string(),
  },
  experimental__runtimeEnv: process.env,
});
