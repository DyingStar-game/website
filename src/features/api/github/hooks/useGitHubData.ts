import { queryOptions } from "@tanstack/react-query";

import { octokit } from "../githubApi";
import type { ProjectsType } from "../schema/project.model";
import { projectsSchema } from "../schema/project.model";
import type { ProjectItemsType } from "../schema/projectItem.model";
import { projectItemsSchema } from "../schema/projectItem.model";

async function fetchProjects(): Promise<ProjectsType> {
  const data = await octokit.paginate("GET /orgs/{orgs}/projectsV2", {
    orgs: "DyingStar-game",
    per_page: 100,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  return projectsSchema.parse(data);
}

export const fetchProjectsOptions = () => {
  return queryOptions({
    queryKey: ["github_projects"],
    queryFn: async () => fetchProjects(),
  });
};

async function fetchProjectItemsOption(
  projectNumber: number,
): Promise<ProjectItemsType> {
  const data = await octokit.paginate(
    "GET /orgs/{org}/projectsV2/{project_number}/items",
    {
      project_number: projectNumber,
      org: "DyingStar-game",
      per_page: 20,
      q: "is:issue status:todo,'In progress' -is:draft",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );

  return projectItemsSchema.parse(data);
}

export const fetchProjectItemsOptions = (projectNumber: number) => {
  return queryOptions({
    queryKey: ["github_projects_items", { projectNumber }],
    queryFn: async () => fetchProjectItemsOption(projectNumber),
  });
};
