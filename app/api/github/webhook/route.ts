import { updateProjectIssues } from "@feat/api/github/hooks/indexedProjectIssues";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const secret = request.nextUrl.searchParams.get("secret");
    if (secret !== process.env.GH_WEBHOOK_SECRET) {
      return NextResponse.json({ ok: false }, { status: 403 });
    }

    await updateProjectIssues();

    return NextResponse.json({ ok: true }, { status: 200 });
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
