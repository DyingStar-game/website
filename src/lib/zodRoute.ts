import { ApplicationError } from "@lib/errors/applicationError";
import { WebhookError } from "@lib/errors/webhookError";
import { ZodRouteError } from "@lib/errors/zodRouteError";
import { logger } from "@lib/logger";
import { createZodRoute } from "next-zod-route";
import { NextResponse } from "next/server";

/**
 * Base route handler with automatic error handling and validation
 *
 * @example
 * ```ts
 * export const POST = route
 *   .params(z.object({ id: z.string() }))
 *   .body(z.object({ name: z.string() }))
 *   .handler(async (req, { params, body }) => {
 *     return { success: true };
 *   });
 * ```
 */
export const route = createZodRoute({
  handleServerError: (e: Error) => {
    if (e instanceof ZodRouteError) {
      logger.debug("[DEV] - ZodRouteError", e);
      return NextResponse.json(
        { message: e.message },
        {
          status: e.status,
        },
      );
    }

    if (e instanceof WebhookError) {
      logger.debug("[DEV] - WebhookError", e);
      return NextResponse.json(
        { message: e.message },
        { status: e.statusCode },
      );
    }

    if (e instanceof ApplicationError) {
      logger.debug("[DEV] - ApplicationError", e);
      return NextResponse.json({ message: e.message }, { status: 400 });
    }

    logger.info("Unknown Error", e);

    if (process.env.NODE_ENV === "development") {
      return NextResponse.json({ message: e.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  },
});
