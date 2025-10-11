import {
  deleteProjectIssue,
  updateProjectIssue,
} from "@feat/api/github/hooks/indexedProjectIssues";
import { IssuesWebhookSchema } from "@feat/issue/get/issuesWebhook.model";
import { env } from "@lib/env/server";
import { logger } from "@lib/logger";
import { route } from "@lib/zod-route";
import { NextResponse } from "next/server";
import { z } from "zod";

export const POST = route //TODO: Create a webhook middleware to handle the webhook
  .query(
    z.object({
      secret: z.string(),
    }),
  )
  .body(IssuesWebhookSchema)
  .handler(async (req, { query, body }) => {
    if (query.secret !== env.GH_WEBHOOK_SECRET)
      return NextResponse.json({ message: "Invalid Access" }, { status: 403 });

    logger.info("Webhook received", body);

    if (body.action === "deleted") await deleteProjectIssue(body.issue.node_id);
    else await updateProjectIssue(body.issue.node_id);

    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  });
