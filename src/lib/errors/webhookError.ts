import { ApplicationError } from "@lib/errors/applicationError";

export class WebhookError extends ApplicationError {
  constructor(
    message: string,
    public statusCode = 403,
  ) {
    super(message);
    this.name = "WebhookError";
  }
}
