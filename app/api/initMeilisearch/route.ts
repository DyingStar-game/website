import { updateProjectIssues } from "@feat/api/github/hooks/indexedProjectIssues";
import {
  logWebhookMiddleware,
  validateWebhookSecretMiddleware,
} from "@lib/middleware/webhook";
import { route } from "@lib/zodRoute";
import { NextResponse } from "next/server";
import { z } from "zod";

//TODO: Il faudrait faire sorte que meilisearch s'initialise tout seul au build de l'app si l'index est vide
export const POST = route
  .query(
    z.object({
      secret: z.string(),
    }),
  )
  .use(validateWebhookSecretMiddleware)
  .use(logWebhookMiddleware)
  .handler(async () => {
    await updateProjectIssues();

    return NextResponse.json({ message: "DB loaded" }, { status: 200 });
  });
