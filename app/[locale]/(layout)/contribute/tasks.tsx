"use client";

import { useState } from "react";

import {
  fetchProjectItemsOptions,
  fetchProjectsOptions,
} from "@feat/api/github/hooks/useGitHubData";
import { useQueries, useSuspenseQuery } from "@tanstack/react-query";

export default function Tasks() {
  const [page, setPage] = useState(1);
  const { data: projects } = useSuspenseQuery(fetchProjectsOptions());

  const { data: projectItems, errors } = useQueries({
    queries: projects.map((project) =>
      fetchProjectItemsOptions(project.number, page),
    ),
    combine: (results) => {
      const allItems = results
        .map((result) => {
          // console.log(result.data);
          return result.data;
        })
        .filter(Boolean)
        .flat();

      return {
        data: allItems,
        isLoading: results.some((result) => result.isLoading),
        isError: results.some((result) => result.isError),
        errors: results
          .filter((result) => result.isError)
          .map((result) => result.error),
      };
    },
  });

  // console.log(errors);

  return (
    <>
      Page : {page}
      <div>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Précédent
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage((p) => p + 1)}>Suivant</button>
      </div>
      <ul>
        {projectItems.map(
          (projectItem) =>
            projectItem && (
              <li key={projectItem.id}>
                {projectItem.content.title} | {projectItem.project_number} |{" "}
                {projectItem.content.number}
              </li>
            ),
        )}
      </ul>
    </>
  );
}
