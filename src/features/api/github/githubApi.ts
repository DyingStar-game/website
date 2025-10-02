import { graphql } from "@octokit/graphql";
import type { Query, RequestParameters } from "@octokit/graphql/types";
import ky from "ky";
import "server-only";

import { cacheResponse } from "../caching";

export const githubApi = ky.extend({
  prefixUrl: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github+json",
    "User-Agent": "dying-star-contrib",
    "X-GitHub-Api-Version": "2022-11-28",
  },
  timeout: 60000,
  retry: {
    limit: 2,
    methods: ["get"],
  },
  hooks: {
    beforeRequest: [
      async (request) => {
        const token = process.env.NEXT_GITHUB_TOKEN;
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
  },
});

export const githubGraphql = graphql.defaults({
  headers: {
    authorization: `token ${process.env.NEXT_GITHUB_TOKEN}`,
  },
});

export async function cachedGithubGraphql<T>(
  query: Query,
  parameters?: RequestParameters,
  ttl = 300, // default ttl of 5min
): Promise<T> {
  return cacheResponse(async () => githubGraphql(query, parameters), {
    cacheKey: `gh:${JSON.stringify(parameters)}`,
    ttl,
  });
}
