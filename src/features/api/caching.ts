import Valkey from "iovalkey";

const valkey = new Valkey(
  parseInt(process.env.VALKEY_PORT ?? "6379", 10),
  process.env.VALKEY_HOST ?? "localhost",
);

export async function cacheResponse<T>(
  execute: () => Promise<T>,
  {
    cacheKey,
    ttl = 3600,
  }: {
    cacheKey: string;
    ttl?: number;
  },
): Promise<T> {
  const cacheEnabled = process.env.CACHING_ENABLED === "true";
  if (!cacheEnabled) {
    return execute();
  }

  const cached = await valkey.get(cacheKey);

  if (cached) {
    return JSON.parse(cached.toString());
  }

  const data = await execute();

  await valkey.set(cacheKey, JSON.stringify(data), "EX", ttl);

  return data;
}
