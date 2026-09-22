import { config } from "dotenv";
import path from "path";
import { z } from "zod";

// `override`: the file on disk wins over stale values injected by docker-compose
config({ path: [".env.local", ".env"], quiet: true, override: true });

const EnvSchema = z.object({
  DISCORD_BOT_TOKEN: z.string().min(1),
  DISCORD_NEWS_CHANNEL_ID: z.string().regex(/^\d{17,20}$/),
});

export type ScriptEnv = z.infer<typeof EnvSchema>;

export const loadEnv = (): ScriptEnv => {
  const result = EnvSchema.safeParse(process.env);
  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `  ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `Missing or invalid environment variables (set them in .env.local, see .env.sample):\n${details}`,
    );
  }
  return result.data;
};

// Existing news dates are written in French local time
export const NEWS_TIMEZONE = "Europe/Paris";

// Consecutive messages from the same author closer than this form one news
export const GROUP_GAP_MS = 10 * 60_000;

export const CONTENT_DIR = path.join(process.cwd(), "content");
export const IMAGES_DIR = path.join(
  process.cwd(),
  "public",
  "assets",
  "images",
  "news",
);
export const IMAGES_URL_PREFIX = "/assets/images/news";
export const DEFAULT_COVER_URL = `${IMAGES_URL_PREFIX}/sample.png`;
