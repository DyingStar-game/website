import { meili } from "@feat/api/meilisearch";

import type {
  PaginateIndexedProjectIssuesType,
  ProjectIssueType,
  ProjectIssuesType,
} from "../schema/projectIssues.model";
import { fetchProjectIssues } from "./fetchProjectIssues";

const ISSUES_INDEX = "gh_issues";

export async function updateProjectIssues() {
  const allIssues = await fetchAllProjectIssues();

  await meili.deleteIndexIfExists(ISSUES_INDEX);
  await meili.createIndex(ISSUES_INDEX, { primaryKey: "id" });
  await meili
    .index(ISSUES_INDEX)
    .updateFilterableAttributes(["project_name", "has_assignees"]);
  await meili.index(ISSUES_INDEX).addDocuments(allIssues);
}

async function fetchAllProjectIssues(
  issues: ProjectIssuesType = [],
  cursor?: string,
) {
  const response = await fetchProjectIssues(cursor);

  if (response.pageInfo.endCursor) {
    return fetchAllProjectIssues(
      response.issues.concat(issues),
      response.pageInfo.endCursor,
    );
  }

  return issues.concat(response.issues);
}

export async function searchProjectIssues(
  query: string,
  page: number,
  project?: string,
) {
  const filter = [];
  if (project) {
    filter.push([`project_name = "${project}"`]);
  }

  const res = await meili.index<ProjectIssueType>(ISSUES_INDEX).search(query, {
    hitsPerPage: 9,
    page,
    filter,
  });

  const pageResponse: PaginateIndexedProjectIssuesType = {
    issueCount: res.totalHits,
    issues: res.hits,
    pageInfo: {
      currentPage: res.page,
      totalPages: res.totalPages,
      previousPage: res.page > 1 ? res.page - 1 : undefined,
      nextPage: res.page < res.totalPages ? res.page + 1 : undefined,
    },
  };

  return pageResponse;
}

export async function getIssuesCount(): Promise<number> {
  const res = await meili.index<ProjectIssueType>(ISSUES_INDEX).search(null);

  return res.estimatedTotalHits;
}

export async function getIssuesWithAssigneeCount(): Promise<number> {
  const res = await meili.index<ProjectIssueType>(ISSUES_INDEX).search("", {
    filter: "has_assignees = true",
  });

  const uniqueAssignees = Array.from(
    new Set(res.hits.flatMap((hit) => hit.assignees.map((a) => a.login))),
  );

  return uniqueAssignees.length;
}
