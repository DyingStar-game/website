import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { fetchProjectIssues } from "../../../../src/features/api/github/hooks/fetchProjectIssues";

export async function GET(request: NextRequest) {
  try {
    const cursor = request.nextUrl.searchParams.get("cursor") ?? undefined;

    const issues = await fetchProjectIssues(cursor);
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
