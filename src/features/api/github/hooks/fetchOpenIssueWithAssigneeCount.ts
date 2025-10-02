import { githubGraphql } from "../githubApi";
import {
  type GraphqlOpenIssueWithAssigneeCountResponseType,
  graphqlOpenIssueWithAssigneeCountResponseSchema,
} from "../schema/projectCount.model";

export async function fetchOpenIssueWithAssigneeCount(): Promise<number> {
  const QUERY = `
    query GetOpenIssueWithAssigneeCount($q: String!) {
      search(first:100, query: $q, type: ISSUE) {
        issueCount
        nodes {
          ... on Issue {
            assignees(first: 1) {
                totalCount
            }
          }
        }
      }
    }
  `;

  const response: GraphqlOpenIssueWithAssigneeCountResponseType =
    await githubGraphql<GraphqlOpenIssueWithAssigneeCountResponseType>(QUERY, {
      q: `org:${process.env.NEXT_PUBLIC_GITHUB_REPO} is:issue is:open assignee:*`,
    });

  const openIssueWithAssigneeCount =
    graphqlOpenIssueWithAssigneeCountResponseSchema.parse(response);

  let count = 0;

  for (const issue of openIssueWithAssigneeCount.search.nodes) {
    count += issue.assignees.totalCount;
  }

  return count;
}
