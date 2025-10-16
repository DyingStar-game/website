import { env } from "@lib/env/server";
import { WebhookError } from "@lib/errors/webhookError";
import { logger } from "@lib/logger";
import type { MiddlewareFunction } from "next-zod-route";

export const validateWebhookSecretMiddleware: MiddlewareFunction = async ({
  request,
  next,
}) => {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");

  if (secret !== env.GH_WEBHOOK_SECRET) {
    logger.warn("Invalid webhook secret attempt");
    throw new WebhookError("Invalid Access", 403);
  }

  logger.debug("Webhook secret validated");

  return next();
};

type LoggingContext = {
  startTime: number;
};

export const logWebhookMiddleware: MiddlewareFunction<
  Record<string, unknown>,
  LoggingContext
> = async ({ request, next }) => {
  const startTime = performance.now();

  logger.info("Webhook received", {
    url: request.url,
    method: request.method,
    github: {
      event: request.headers.get("x-github-event"),
      delivery: request.headers.get("x-github-delivery"),
      hookId: request.headers.get("x-github-hook-id"),
    },
    request: {
      contentType: request.headers.get("content-type"),
      userAgent: request.headers.get("user-agent"),
      contentLength: request.headers.get("content-length"),
    },
  });

  const response = await next({
    ctx: { startTime },
  });

  const duration = performance.now() - startTime;
  logger.info("Webhook processed", {
    duration: `${Math.round(duration)}ms`,
    status: response.status,
  });

  return response;
};
