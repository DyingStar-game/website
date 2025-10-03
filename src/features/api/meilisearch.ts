import { MeiliSearch } from "meilisearch";

export const meili = new MeiliSearch({
  host: process.env.MEILI_URL ?? "meilisearch:7700",
  apiKey: process.env.MEILI_MASTER_KEY ?? "", // or search key in production
});
