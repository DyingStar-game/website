import { env } from "@lib/env/server";
import { MeiliSearch } from "meilisearch";

export const meili = new MeiliSearch({
  host: env.MEILI_URL,
  apiKey: env.MEILI_MASTER_KEY, // or search key in production
});
