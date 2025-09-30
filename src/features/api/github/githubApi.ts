import ky from "ky";
import { App, Octokit } from "octokit";

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
        const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
  },
});

export const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
});
