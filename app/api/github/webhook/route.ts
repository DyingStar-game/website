import {
  deleteProjectIssue,
  updateProjectIssue,
} from "@feat/api/github/hooks/indexedProjectIssues";
import { IssuesWebhookSchema } from "@feat/api/github/schema/issuesWebhook.model";
import { env } from "@lib/env/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const secret = request.nextUrl.searchParams.get("secret");
    if (secret !== env.GH_WEBHOOK_SECRET) {
      return NextResponse.json({ ok: false }, { status: 403 });
    }

    const raw = await request.text();
    const body = JSON.parse(raw);

    const parseResult = IssuesWebhookSchema.safeParse(body);

    if (!parseResult.success) return NextResponse.json(null, { status: 202 });

    if (parseResult.data.action === "deleted")
      await deleteProjectIssue(parseResult.data.issue.node_id);
    else await updateProjectIssue(parseResult.data.issue.node_id);

    return NextResponse.json(null, { status: 200 });
  } catch (e: unknown) {
    console.error("🚀 ~ POST ~ e:", e);
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
