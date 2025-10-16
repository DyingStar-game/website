import { env } from "@lib/env/server";
import { WebhookError } from "@lib/errors/webhookError";
import { logger } from "@lib/logger";
import { Webhooks } from "@octokit/webhooks";
import crypto from "crypto";

const webhooks = new Webhooks({
  secret: env.GH_WEBHOOK_SECRET,
});

export const handleGithubWebhook = async (request: Request, body: string) => {
  const signature = request.headers.get("x-hub-signature-256");

  if (!signature) {
    throw new WebhookError("Missing Webhook signature");
  }

  if (!(await webhooks.verify(body, signature))) {
    if (process.env.NODE_ENV !== "production") {
      const hmac = crypto.createHmac("sha256", env.GH_WEBHOOK_SECRET);
      const signToUse = `sha256=${hmac.update(body).digest("hex")}`;

      logger.debug({
        body,
        secret: env.GH_WEBHOOK_SECRET,
        headerShouldBe: `x-hub-signature-256: sha256=${signToUse}`,
        headerReceive: `x-hub-signature-256: ${signature}`,
      });
    }

    throw new WebhookError("Unauthorized", 401);
  }
};
