import { env } from "@lib/env/server";
import { graphql } from "@octokit/graphql";
import "server-only";

export const githubGraphql = graphql.defaults({
  headers: {
    authorization: `token ${env.NEXT_GITHUB_TOKEN}`,
  },
});
