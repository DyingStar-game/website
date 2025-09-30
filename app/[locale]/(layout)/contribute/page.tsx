import { getQueryClient } from "@feat/api/get-query-client";
import { octokit } from "@feat/api/github/githubApi";
import { fetchProjectsOptions } from "@feat/api/github/hooks/useGitHubData";
import type { ProjectsType } from "@feat/api/github/schema/project.model";
import { projectsSchema } from "@feat/api/github/schema/project.model";
import type { ProjectItemsType } from "@feat/api/github/schema/projectItem.model";
import { projectItemsSchema } from "@feat/api/github/schema/projectItem.model";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import Tasks from "./tasks";

export default async function ContributePage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(fetchProjectsOptions());

  // const data = await octokit.paginate("GET /orgs/{orgs}/projectsV2", {
  //   orgs: "DyingStar-game",
  //   per_page: 2,
  //   headers: {
  //     "X-GitHub-Api-Version": "2022-11-28",
  //   },
  // });

  // const projects: ProjectsType = projectsSchema.parse(data);

  // const projectItemsData = await octokit.paginate(
  //   "GET /orgs/{org}/projectsV2/{project_number}/items",
  //   {
  //     project_number: 13,
  //     org: "DyingStar-game",
  //     per_page: 2,
  //     // q: "is:issue",
  //     headers: {
  //       "X-GitHub-Api-Version": "2022-11-28",
  //     },
  //   },
  // );

  // console.log(projectItemsData);

  // const projectItems: ProjectItemsType =
  //   projectItemsSchema.parse(projectItemsData);

  // console.log(projectItems);

  const fields = await octokit.request(
    "GET /orgs/{org}/projectsV2/{project_number}/fields",
    {
      project_number: 13,
      org: "DyingStar-game",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );

  console.log(fields);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* {projects.map((project) => (
        <div key={project.id}>{project.id}</div>
      ))} */}
      <Tasks />
    </HydrationBoundary>
  );
}
