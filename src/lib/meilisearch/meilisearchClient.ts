import { env } from "@lib/env/server";
import { Meilisearch } from "meilisearch";

if (!env.MEILI_URL) {
  throw new Error("Missing environment variable: MEILI_URL");
}

if (!env.MEILI_MASTER_KEY) {
  throw new Error("Missing environment variable: MEILI_MASTER_KEY");
}

export const meili = new Meilisearch({
  host: env.MEILI_URL,
  apiKey: env.MEILI_MASTER_KEY,
});
