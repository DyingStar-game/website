import { IssueStatus } from "@feat/api/github/schema/issueField.status.graphql";
import type {
  PaginateIndexedProjectIssuesType,
  ProjectIssueType,
  ProjectIssuesType,
} from "@feat/api/github/schema/projectIssues.model";
import { GetGithubIssue } from "@feat/issue/get/getGithubIssue.graphql";
import { getGithubIssues } from "@feat/issue/get/getGithubIssues.graphql";
import { meili } from "@lib/meilisearch/meilisearchClient";
import type { FacetHit } from "meilisearch";

const ISSUES_INDEX = "gh_issues";

const SORTABLE_ATTRIBUTES = [
  "priority",
  "updatedAt",
] as const satisfies (keyof ProjectIssueType)[];

type SortableAttributeType = (typeof SORTABLE_ATTRIBUTES)[number];

const sortableAttribute = <K extends SortableAttributeType>(key: K): K => {
  return key;
};

const FILTERABLE_ATTRIBUTES = [
  "projectName",
  "hasAssignees",
  "status",
] as const satisfies (keyof ProjectIssueType)[];

type FilterableAttributeType = (typeof FILTERABLE_ATTRIBUTES)[number];

const filterableAttribute = <K extends FilterableAttributeType>(key: K): K => {
  return key;
};

const DEFAULT_FILTER = `${filterableAttribute("status")} = "${IssueStatus.TODO}" OR ${filterableAttribute("status")} = "${IssueStatus.IN_PROGRESS}"`;

export const updateProjectIssues = async () => {
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
};

const fetchAllProjectIssues = async (
  issues: ProjectIssuesType = [],
  cursor?: string,
) => {
  const response = await getGithubIssues(cursor);

  if (response.pageInfo.endCursor) {
    return fetchAllProjectIssues(
      response.issues.concat(issues),
      response.pageInfo.endCursor,
    );
  }

  return issues.concat(response.issues);
};

export const deleteProjectIssue = async (issueId: string) => {
  const deleteTask = await meili.index(ISSUES_INDEX).deleteDocument(issueId);
  await meili.tasks.waitForTask(deleteTask.taskUid);
};

export const updateProjectIssue = async (issueId: string) => {
  const issue = await GetGithubIssue(issueId);

  const updateTask = await meili.index(ISSUES_INDEX).updateDocuments(issue);

  await meili.tasks.waitForTask(updateTask.taskUid);
};

export const searchProjectIssues = async (
  page: number,
  query: string | null,
  projects: string[] | null,
  pageSize = 6,
) => {
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
    sort: [
      `${sortableAttribute("priority")}:asc`,
      `${sortableAttribute("updatedAt")}:desc`,
    ],
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
};

export const getIssuesCount = async (): Promise<number> => {
  const res = await meili.index<ProjectIssueType>(ISSUES_INDEX).search(null, {
    filter: [DEFAULT_FILTER],
  });

  return res.estimatedTotalHits;
};

export const getIssuesWithAssigneeCount = async (): Promise<number> => {
  const res = await meili.index<ProjectIssueType>(ISSUES_INDEX).search("", {
    filter: [`${filterableAttribute("hasAssignees")} = true`, DEFAULT_FILTER],
  });

  const uniqueAssignees = Array.from(
    new Set(res.hits.flatMap((hit) => hit.assignees.map((a) => a.login))),
  );

  return uniqueAssignees.length;
};

export const getProjectCount = async (): Promise<FacetHit[]> => {
  const filter = [DEFAULT_FILTER];
  const res = await meili
    .index<ProjectIssueType>(ISSUES_INDEX)
    .searchForFacetValues({
      filter,
      facetName: filterableAttribute("projectName"),
    });

  return res.facetHits;
};

//TODO: Refactor this file
