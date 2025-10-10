import { GetGithubIssue } from "@feat/issue/get/getGithubIssue.graphql";
import { getGithubIssues } from "@feat/issue/get/getGithubIssues.graphql";
import { meili } from "@lib/meilisearch/meilisearchClient";
import type { FacetHit } from "meilisearch";

import { IssueStatus } from "../schema/issueField.status.graphql";
import type {
  PaginateIndexedProjectIssuesType,
  ProjectIssueType,
  ProjectIssuesType,
} from "../schema/projectIssues.model";

const ISSUES_INDEX = "gh_issues";

const DEFAULT_FILTER = `${filterableAttribute("status")} = "${IssueStatus.TODO}" OR ${filterableAttribute("status")} = "${IssueStatus.IN_PROGRESS}"`;

const SORTABLE_ATTRIBUTES = [
  "updatedAt",
] as const satisfies (keyof ProjectIssueType)[];

type SortableAttributeType = (typeof SORTABLE_ATTRIBUTES)[number];

function sortableAttribute<K extends SortableAttributeType>(key: K): K {
  return key;
}

const FILTERABLE_ATTRIBUTES = [
  "projectName",
  "hasAssignees",
  "status",
] as const satisfies (keyof ProjectIssueType)[];

type FilterableAttributeType = (typeof FILTERABLE_ATTRIBUTES)[number];

function filterableAttribute<K extends FilterableAttributeType>(key: K): K {
  return key;
}

export async function updateProjectIssues() {
  const allIssues = await fetchAllProjectIssues();

  await meili.deleteIndexIfExists(ISSUES_INDEX);

  const createTask = await meili.createIndex(ISSUES_INDEX, {
    primaryKey: "id",
  });
  await meili.tasks.waitForTask(createTask.taskUid);

  const filterTask = await meili
    .index(ISSUES_INDEX)
    .updateFilterableAttributes(FILTERABLE_ATTRIBUTES);
  await meili.tasks.waitForTask(filterTask.taskUid);

  const sortableTask = await meili
    .index(ISSUES_INDEX)
    .updateSortableAttributes(SORTABLE_ATTRIBUTES);
  await meili.tasks.waitForTask(sortableTask.taskUid);

  const addTask = await meili.index(ISSUES_INDEX).addDocuments(allIssues);
  await meili.tasks.waitForTask(addTask.taskUid);
}

async function fetchAllProjectIssues(
  issues: ProjectIssuesType = [],
  cursor?: string,
) {
  const response = await getGithubIssues(cursor);

  if (response.pageInfo.endCursor) {
    return fetchAllProjectIssues(
      response.issues.concat(issues),
      response.pageInfo.endCursor,
    );
  }

  return issues.concat(response.issues);
}

export const deleteProjectIssue = async (issueId: string) => {
  const deleteTask = await meili.index(ISSUES_INDEX).deleteDocument(issueId);
  await meili.tasks.waitForTask(deleteTask.taskUid);
};

export const updateProjectIssue = async (issueId: string) => {
  const issue = await GetGithubIssue(issueId);

  const updateTask = await meili.index(ISSUES_INDEX).updateDocuments(issue);

  await meili.tasks.waitForTask(updateTask.taskUid);
};

export async function searchProjectIssues(
  page: number,
  query: string | null,
  projects: string[] | null,
  pageSize = 6,
) {
  const filter = [DEFAULT_FILTER];
  if (projects) {
    filter.push(
      projects
        .map(
          (project) => `${filterableAttribute("projectName")} = "${project}"`,
        )
        .join(" OR "),
    );
  }

  const res = await meili.index<ProjectIssueType>(ISSUES_INDEX).search(query, {
    hitsPerPage: pageSize,
    page,
    filter,
    sort: [`${sortableAttribute("updatedAt")}:desc`],
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
  const res = await meili.index<ProjectIssueType>(ISSUES_INDEX).search(null, {
    filter: [DEFAULT_FILTER],
  });

  return res.estimatedTotalHits;
}

export async function getIssuesWithAssigneeCount(): Promise<number> {
  const res = await meili.index<ProjectIssueType>(ISSUES_INDEX).search("", {
    filter: [`${filterableAttribute("hasAssignees")} = true`, DEFAULT_FILTER],
  });

  const uniqueAssignees = Array.from(
    new Set(res.hits.flatMap((hit) => hit.assignees.map((a) => a.login))),
  );

  return uniqueAssignees.length;
}

export async function getProjectCount(): Promise<FacetHit[]> {
  const filter = [DEFAULT_FILTER];
  const res = await meili
    .index<ProjectIssueType>(ISSUES_INDEX)
    .searchForFacetValues({
      filter,
      facetName: filterableAttribute("projectName"),
    });

  return res.facetHits;
}

//TODO: Refactor this file
