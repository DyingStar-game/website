import {
  getIssuesCount,
  getIssuesWithAssigneeCount,
} from "@feat/api/github/hooks/indexedProjectIssues";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const openIssueCount = await getIssuesCount();
    const openIssueWithAssigneeCount = await getIssuesWithAssigneeCount();
    return NextResponse.json(
      { openIssueCount, openIssueWithAssigneeCount },
      { status: 200 },
    );
  } catch (e: unknown) {
    const message =
      e instanceof Error
        ? e.message
        : typeof e === "string"
          ? e
          : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch project issues", details: message },
      { status: 500 },
    );
  }
}
