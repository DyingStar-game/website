import {
  deleteProjectIssue,
  updateProjectIssue,
} from "@feat/api/github/hooks/indexedProjectIssues";
import { IssuesWebhookSchema } from "@feat/issue/get/issuesWebhook.model";
import { env } from "@lib/env/server";
import { handleGithubWebhook } from "@lib/github/webhook";
import {
  logWebhookMiddleware,
  validateWebhookSecretMiddleware,
} from "@lib/middleware/webhook";
import { route } from "@lib/zodRoute";
import { NextResponse } from "next/server";
import { z } from "zod";

export const POST = route
  .query(
    z.object({
      secret: z.string(),
    }),
  )
  .body(IssuesWebhookSchema)
  .use(validateWebhookSecretMiddleware)
  .use(logWebhookMiddleware)
  .handler(async (request, { body }) => {
    if (env.GH_WEBHOOK_SECRET) {
      await handleGithubWebhook(request, JSON.stringify(body));
    }

    if (body.action === "deleted") {
      await deleteProjectIssue(body.issue.node_id);
    } else {
      await updateProjectIssue(body.issue.node_id);
    }

    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  });
