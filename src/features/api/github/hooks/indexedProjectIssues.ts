import { meili } from "@feat/api/meilisearch";

import type {
  PaginateIndexedProjectIssuesType,
  PaginateProjectIssuesType,
  ProjectIssueType,
} from "../schema/projectIssues.model";
import { fetchOpenIssueWithAssigneeCount } from "./fetchOpenIssueWithAssigneeCount";
import { fetchProjectIssues } from "./fetchProjectIssues";

type AllProjectIssues = PaginateProjectIssuesType["issues"];

const ISSUES_INDEX = "gh_issues";
const ISSUES_COUNT_INDEX = "gh_issues_count";

export type IndexedIssueCount = {
  id: number;
  issueWithAssigneeCount: number;
};

export async function updateProjectIssues() {
  const allIssues = await fetchAllProjectIssues();
  const issueWithAssigneeCount = await fetchOpenIssueWithAssigneeCount();

  await meili.deleteIndexIfExists(ISSUES_INDEX);
  await meili.createIndex(ISSUES_INDEX, { primaryKey: "id" });
  await meili.index(ISSUES_INDEX).updateFilterableAttributes(["project_name"]);
  await meili.index(ISSUES_INDEX).addDocuments(allIssues);

  await meili.deleteIndexIfExists(ISSUES_COUNT_INDEX);
  await meili.createIndex(ISSUES_COUNT_INDEX, { primaryKey: "id" });
  await meili.index<IndexedIssueCount>(ISSUES_COUNT_INDEX).addDocuments([
    {
      id: 1,
      issueWithAssigneeCount,
    },
  ]);
}

async function fetchAllProjectIssues(
  issues: AllProjectIssues = [],
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
    hitsPerPage: 20,
    page,
    filter,
  });

  const pageResponse: PaginateIndexedProjectIssuesType = {
    issueCount: res.totalHits,
    issues: res.hits,
    hasNextPage: res.page < res.totalPages,
  };

  return pageResponse;
}

export async function getIssuesCount(): Promise<number> {
  const doc = await meili
    .index<IndexedIssueCount>(ISSUES_COUNT_INDEX)
    .getDocument(1);

  return doc.issueWithAssigneeCount;
}
