import { queryOptions } from "@tanstack/react-query";

import { githubApi } from "../githubApi";
import type { ProjectsType } from "../schema/project.model";
import { projectsSchema } from "../schema/project.model";
import type { ProjectItemsType } from "../schema/projectItem.model";
import { projectItemsSchema } from "../schema/projectItem.model";

async function fetchProjects(): Promise<ProjectsType> {
  const response = await githubApi
    .get(`orgs/${process.env.NEXT_PUBLIC_GITHUB_REPO}/projectsV2`)
    .json();

  return projectsSchema.parse(response);
}

export const fetchProjectsOptions = () => {
  return queryOptions({
    queryKey: ["github_projects"],
    queryFn: async () => fetchProjects(),
  });
};

async function fetchProjectItems(
  projectNumber: number,
  page: number,
): Promise<ProjectItemsType> {
  const response = await githubApi
    .get(
      `orgs/${process.env.NEXT_PUBLIC_GITHUB_REPO}/projectsV2/${projectNumber}/items?page=${page}&per_page=2&q=is:issue`,
    )
    .json();

  if (!response || typeof response !== "object") {
    throw new Error("Pas bien");
  }

  const newResponse = (response as ProjectItemsType).map((res) => ({
    ...res,
    project_number: projectNumber,
  }));

  return projectItemsSchema.parse(newResponse);
}

export const fetchProjectItemsOptions = (
  projectNumber: number,
  page: number,
) => {
  return queryOptions({
    queryKey: ["github_project_items", { projectNumber, page }],
    queryFn: async () => fetchProjectItems(projectNumber, page),
  });
};
