"use client";

import { useState } from "react";

import {
  fetchProjectItemsInfiniteOptions,
  fetchProjectsOptions,
} from "@feat/api/github/hooks/useGitHubData";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Button } from "@ui/button";

export default function Tasks() {
  // const { data: projects } = useQuery(fetchProjectsOptions());

  const {
    data: paginatedProjectItems,
    error,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery(fetchProjectItemsInfiniteOptions(13)); // 13 is Project Number

  // console.log(projectItems, error);

  return (
    <>
      Page
      <div>
        <Button
          onClick={async () => fetchPreviousPage()}
          disabled={!hasPreviousPage}
        >
          Précédent
        </Button>
        <Button onClick={async () => fetchNextPage()} disabled={!hasNextPage}>
          Suivant
        </Button>
      </div>
      <ul>
        {paginatedProjectItems?.pages.map((paginatedProjectItem) =>
          paginatedProjectItem.data.map((projectItem) => (
            <li key={projectItem.content.id}>
              {projectItem.content.title} | {projectItem.content.number}
            </li>
          )),
        )}
      </ul>
    </>
  );
}
