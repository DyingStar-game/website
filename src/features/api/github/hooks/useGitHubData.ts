import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import { githubApi } from "../githubApi";
import type { ProjectsType } from "../schema/project.model";
import { projectsSchema } from "../schema/project.model";
import type {
  PageParamType,
  PaginatedProjectItemsType,
} from "../schema/projectItem.model";
import { paginatedProjectItemsSchema } from "../schema/projectItem.model";

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
  pageParam?: PageParamType,
): Promise<PaginatedProjectItemsType> {
  const searchParams = new URLSearchParams({
    per_page: "5",
    q: "is:issue",
  });

  // Ajout des paramètres de pagination si présents
  if (pageParam?.after) {
    searchParams.set("after", pageParam.after);
  }
  if (pageParam?.before) {
    searchParams.set("before", pageParam.before);
  }

  const response = await githubApi.get(
    `orgs/${process.env.NEXT_PUBLIC_GITHUB_REPO}/projectsV2/${projectNumber}/items?${searchParams.toString()}`,
  );

  const linkHeader = response.headers.get("Link");
  const pagination = parseLinkHeader(linkHeader);

  const data = await response.json();

  return paginatedProjectItemsSchema.parse({ data, pagination });
}

export const fetchProjectItemsInfiniteOptions = (projectNumber: number) => {
  return infiniteQueryOptions({
    queryKey: ["github_project_items", { projectNumber }],
    queryFn: async ({ pageParam }) =>
      fetchProjectItems(projectNumber, pageParam),
    initialPageParam: undefined as PageParamType | undefined,
    getNextPageParam: (lastPage): PageParamType | undefined =>
      lastPage.pagination.hasNext && lastPage.pagination.cursors.after
        ? { after: lastPage.pagination.cursors.after }
        : undefined,
    getPreviousPageParam: (firstPage): PageParamType | undefined => {
      return firstPage.pagination.hasPrevious &&
        firstPage.pagination.cursors.before
        ? { before: firstPage.pagination.cursors.before }
        : undefined;
    },
  });
};

function parseLinkHeader(linkHeader: string | null) {
  const cursors: { before?: string; after?: string } = {};
  let hasNext = false;
  let hasPrevious = false;

  if (!linkHeader) {
    return { cursors, hasNext, hasPrevious };
  }

  const links = linkHeader.split(",");

  for (const link of links) {
    const [url, rel] = link.split(";").map((s) => s.trim());

    const cleanUrl = url.slice(1, -1);
    const relMatch = rel.match(/rel="(\w+)"/);

    if (relMatch) {
      const relation = relMatch[1];
      const urlObj = new URL(cleanUrl);

      if (relation === "next") {
        hasNext = true;
        cursors.after = urlObj.searchParams.get("after") ?? undefined;
      } else if (relation === "prev") {
        hasPrevious = true;
        cursors.before = urlObj.searchParams.get("before") ?? undefined;
      }
    }
  }

  return { cursors, hasNext, hasPrevious };
}
