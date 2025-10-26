import { updateProjectIssues } from "@feat/api/github/hooks/indexedProjectIssues";
import { IssuesWebhookSchema } from "@feat/issue/get/issuesWebhook.model";
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
  .body(IssuesWebhookSchema)
  .handler(async (req, { query, body }) => {
    if (query.secret !== env.GH_WEBHOOK_SECRET)
      return NextResponse.json({ message: "Invalid Access" }, { status: 403 });

    logger.info("Webhook received", body);

    try {
      // if (body.action === "deleted")
      //   await deleteProjectIssue(body.projects_v2_item.node_id);
      // else await updateProjectIssue(body.projects_v2_item.node_id);
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

//   if (typedBody.action === "deleted") {
//     await deleteProjectIssue(typedBody.projects_v2_item.node_id);
//   } else {
//     await updateProjectIssue(typedBody.projects_v2_item.node_id);
//   }

//   return NextResponse.json({ message: "Webhook received" }, { status: 200 });
// }
