import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_CLIENT_ENV_VAR: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_CLIENT_ENV_VAR: process.env.NEXT_PUBLIC_CLIENT_ENV_VAR,
  },
});
