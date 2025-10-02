import { NextResponse } from "next/server";

import { fetchProjectIssues } from "../../../../src/features/api/github/hooks/useGitHubData";

export async function GET() {
  try {
    const issues = await fetchProjectIssues();
    return NextResponse.json(issues, { status: 200 });
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
