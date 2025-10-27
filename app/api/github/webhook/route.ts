import {
  deleteProjectIssue,
  updateProjectIssue,
  updateProjectIssues,
} from "@feat/api/github/hooks/indexedProjectIssues";
import type { WebhookActionType } from "@feat/issue/get/issuesWebhook.model";
import {
  ActionEnum,
  issueBodySchema,
  issueDependenciesBodySchema,
  projectsV2BodySchema,
  subIssueciesBodySchema,
} from "@feat/issue/get/issuesWebhook.model";
import { env } from "@lib/env/server";
import { logger } from "@lib/logger";
import { route } from "@lib/zodRoute";
import { NextResponse } from "next/server";
import z from "zod";

export const POST = route //TODO: Create a webhook middleware to handle the webhook
  .query(
    z.object({
      secret: z.string(),
    }),
  )
  // .body(IssuesWebhookSchema)
  .handler(async ({ headers }, { query, body }) => {
    if (query.secret !== env.GH_WEBHOOK_SECRET)
      return NextResponse.json({ message: "Invalid Access" }, { status: 403 });

    const event = headers.get("x-github-event");

    let webhookAction: WebhookActionType;
    try {
      switch (event) {
        case ActionEnum.ISSUES:
          webhookAction = {
            action: issueBodySchema.parse(body).action,
            node_id: issueBodySchema.parse(body).issue.node_id,
          };
          break;
        case ActionEnum.ISSUE_DEPENDENCIES:
          webhookAction = {
            action: issueDependenciesBodySchema.parse(body).action,
            node_id:
              issueDependenciesBodySchema.parse(body).blocked_issue.node_id,
            secondary_node_id:
              issueDependenciesBodySchema.parse(body).blocking_issue.node_id,
          };
          break;
        case ActionEnum.PROJECTS_V2_ITEM:
          webhookAction = {
            action: projectsV2BodySchema.parse(body).action,
            node_id:
              projectsV2BodySchema.parse(body).projects_v2_item.content_node_id,
          };
          break;
        case ActionEnum.SUB_ISSUES:
          webhookAction = {
            action: subIssueciesBodySchema.parse(body).action,
            node_id: subIssueciesBodySchema.parse(body).sub_issue.node_id,
          };
          break;

        default:
          return NextResponse.json(
            { message: "Webhook not supported" },
            { status: 204 },
          );
      }

      logger.info("Webhook received", webhookAction);

      if (webhookAction.action === "deleted")
        await deleteProjectIssue(webhookAction.node_id);
      else await updateProjectIssue(webhookAction.node_id);
    } catch (error) {
      logger.error("Error processing webhook", error);

      await updateProjectIssues();

      return NextResponse.json(
        { message: "Error processing webhook" },
        { status: 500 },
      );
    }
    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  });

// export async function POST(req: NextRequest) {
//   // Parse query params
//   const { searchParams } = new URL(req.url);
//   const secret = searchParams.get("secret");

//   if (secret !== env.GH_WEBHOOK_SECRET) {
//     return NextResponse.json({ message: "Invalid Access" }, { status: 403 });
//   }

//   let body: unknown;
//   try {
//     body = await req.json();
//   } catch {
//     return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
//   }
//   logger.info("Webhook received", body);

//   const parseResult = IssuesWebhookSchema.safeParse(body);
//   if (!parseResult.success) {
//     return NextResponse.json({ message: "Invalid body" }, { status: 400 });
//   }

//   const typedBody = parseResult.data;

//   logger.info("Webhook received", typedBody);

//   // if (typedBody.action === "deleted") {
//   //   await deleteProjectIssue(typedBody.node_id);
//   // } else {
//   //   await updateProjectIssue(typedBody.projects_v2_item.node_id);
//   // }

//   return NextResponse.json({ message: "Webhook received" }, { status: 200 });
// }
