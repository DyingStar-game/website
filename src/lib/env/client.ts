import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

import { version } from "../../../package.json";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_SITE_URL: z.url(),
    NEXT_PUBLIC_APP_VERSION: z.string(),
    NEXT_PUBLIC_DISCORD_INVITE_ID: z.string(),
    NEXT_PUBLIC_GITHUB_REPO: z.string(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_APP_VERSION: version,
    NEXT_PUBLIC_DISCORD_INVITE_ID: process.env.NEXT_PUBLIC_DISCORD_INVITE_ID,
    NEXT_PUBLIC_GITHUB_REPO: process.env.NEXT_PUBLIC_GITHUB_REPO,
  },
});
