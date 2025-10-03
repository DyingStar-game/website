import { searchProjectIssues } from "@feat/api/github/hooks/indexedProjectIssues";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const page = params.get("page") ?? "0";
    const query = params.get("query");
    const projects = params.getAll("projects");

    const issues = await searchProjectIssues(
      parseInt(page, 10),
      query,
      projects,
    );

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
