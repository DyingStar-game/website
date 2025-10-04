import {
  deleteProjectIssue,
  updateProjectIssue,
} from "@feat/api/github/hooks/indexedProjectIssues";
import { IssuesWebhookSchema } from "@feat/api/github/schema/issuesWebhook.model";
import { env } from "@lib/env/server";
import { route } from "@lib/zod-route";
import { NextResponse } from "next/server";
import z from "zod";

export const POST = route
  .query(
    z.object({
      secret: z.string(),
    }),
  )
  .handler(async (req, { query }) => {
    if (query.secret !== env.GH_WEBHOOK_SECRET)
      return NextResponse.json({ message: "Invalid Access" }, { status: 403 });

    const raw = await req.text();
    const body = JSON.parse(raw);

    const parseResult = IssuesWebhookSchema.safeParse(body);

    if (!parseResult.success) return NextResponse.json(null, { status: 202 });

    if (parseResult.data.action === "deleted")
      await deleteProjectIssue(parseResult.data.issue.node_id);
    else await updateProjectIssue(parseResult.data.issue.node_id);

    return NextResponse.json(null, { status: 200 });
  });
