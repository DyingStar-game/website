"use client";

import {
  fetchProjectItemsOptions,
  fetchProjectsOptions,
} from "@feat/api/github/hooks/useGitHubData";
import { useQuery } from "@tanstack/react-query";

export default function Tasks() {
  const { data: projects } = useQuery(fetchProjectsOptions());
  const { data: projectItems, error } = useQuery(fetchProjectItemsOptions(13));

  console.log(error);

  // const {
  //   data: paginatedProjectItems,
  //   error,
  //   fetchNextPage,
  //   fetchPreviousPage,
  //   hasNextPage,
  //   hasPreviousPage,
  // } = useInfiniteQuery(fetchProjectItemsInfiniteOptions(13)); // 13 is Project Number

  // console.log(projectItems, error);

  return (
    <>
      Page
      <ul>
        {projects?.map((project) => (
          <li key={project.id}>
            {project.number} | {project.title}
          </li>
        ))}
      </ul>
      Project Items
      <ul>
        {projectItems?.map((projectItem) => (
          <li key={projectItem.id}>
            {projectItem.content.id} | {projectItem.content.title}
          </li>
        ))}
      </ul>
    </>
  );
}
