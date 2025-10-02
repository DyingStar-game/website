import { fetchOpenIssueWithAssigneeCount } from "@feat/api/github/hooks/fetchOpenIssueWithAssigneeCount";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const openIssueWithAssigneeCount = await fetchOpenIssueWithAssigneeCount();
    return NextResponse.json(
      { openIssueWithAssigneeCount: openIssueWithAssigneeCount },
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
