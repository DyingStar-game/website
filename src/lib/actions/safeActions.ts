import { ApplicationError } from "@lib/errors/applicationError";
import { logger } from "@lib/logger";
import { createSafeActionClient } from "next-safe-action";

/**
 * Base safe action client with error handling
 *
 * @description
 * The foundation client that provides:
 * - Comprehensive error handling and logging
 * - User-friendly error messages in production
 * - Full error details in development
 * - No authentication or authorization requirements
 *
 * Use this for public actions that don't require user authentication.
 *
 * @example
 * ```ts
 * export const subscribeNewsletter = action
 *   .inputSchema(z.object({
 *     email: z.string().email(),
 *     name: z.string().optional()
 *   }))
 *   .action(async ({ parsedInput: { email, name } }) => {
 *     await addToNewsletter(email, name);
 *     return { subscribed: true };
 *   });
 * ```
 */

const handleServerError = (e: Error) => {
  if (e instanceof ApplicationError) {
    logger.debug("[DEV] - Action Error", e.message);
    return e.message;
  }

  logger.info("Unknown Error", e);

  if (process.env.NODE_ENV === "development") {
    return e.message;
  }

  return "An unexpected error occurred.";
};

export const action = createSafeActionClient({
  handleServerError,
});
