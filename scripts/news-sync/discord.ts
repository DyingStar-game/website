import { logger } from "@lib/logger";
import type { APIAttachment, APIMessage } from "discord.js";
import { MessageType, REST, Routes } from "discord.js";
import fs from "fs/promises";

export type NewsImage = {
  url: string;
  contentType: string;
  filename: string;
};

export type NewsMessage = {
  id: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  // Discord-flavoured markdown, with mentions/emojis already normalised
  content: string;
  images: NewsImage[];
};

export type NewsGroup = {
  firstMessageId: string;
  authorId: string;
  authorName: string;
  date: Date;
  messages: NewsMessage[];
};

const PAGE_SIZE = 100;

export const createRest = (token: string) =>
  new REST({ version: "10" }).setToken(token);

const normalizeContent = (message: APIMessage): string => {
  let content = message.content;
  for (const user of message.mentions) {
    const name = user.global_name ?? user.username;
    content = content.replaceAll(`<@${user.id}>`, `@${name}`);
    content = content.replaceAll(`<@!${user.id}>`, `@${name}`);
  }
  return content
    .replace(/<a?:(\w+):\d+>/g, ":$1:")
    .replace(/@(everyone|here)\b/g, "")
    .trim();
};

const isImage = (attachment: APIAttachment) =>
  attachment.content_type?.startsWith("image/") ?? false;

const toNewsMessage = (message: APIMessage): NewsMessage => {
  const skipped = message.attachments.filter((a) => !isImage(a));
  if (skipped.length > 0) {
    logger.warn(
      `Message ${message.id}: ignoring non-image attachment(s): ${skipped
        .map((a) => a.filename)
        .join(", ")}`,
    );
  }
  return {
    id: message.id,
    authorId: message.author.id,
    authorName: message.author.global_name ?? message.author.username,
    createdAt: new Date(message.timestamp),
    content: normalizeContent(message),
    images: message.attachments.filter(isImage).map((a) => ({
      url: a.url,
      contentType: a.content_type ?? "",
      filename: a.filename,
    })),
  };
};

/**
 * Fetches every message posted after `since`, oldest first.
 * Discord returns newest first, so we page backwards with `before` and stop
 * as soon as a page crosses `since`.
 */
export const fetchMessagesSince = async (
  rest: REST,
  channelId: string,
  since: Date,
): Promise<NewsMessage[]> => {
  const collected: APIMessage[] = [];
  let before: string | undefined;

  for (;;) {
    const query = new URLSearchParams({ limit: String(PAGE_SIZE) });
    if (before) query.set("before", before);
    const page = (await rest.get(Routes.channelMessages(channelId), {
      query,
    })) as APIMessage[];
    if (page.length === 0) break;

    const recent = page.filter((m) => new Date(m.timestamp) > since);
    collected.push(...recent);
    if (recent.length < page.length || page.length < PAGE_SIZE) break;
    before = page[page.length - 1].id;
  }

  if (collected.length > 0 && collected.every((m) => m.content === "")) {
    logger.warn(
      "Every message has an empty content: check that the bot has the “Message Content Intent” enabled in the Discord Developer Portal.",
    );
  }

  return collected
    .filter(
      (m) => m.type === MessageType.Default || m.type === MessageType.Reply,
    )
    .map(toNewsMessage)
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
};

// Consecutive messages from the same author, closer than `gapMs`, form one news
export const groupMessages = (
  messages: NewsMessage[],
  gapMs: number,
): NewsGroup[] => {
  const groups: NewsGroup[] = [];
  for (const message of messages) {
    const current = groups.at(-1);
    const previous = current?.messages.at(-1);
    const sameAuthor = current?.authorId === message.authorId;
    const closeEnough =
      previous !== undefined &&
      message.createdAt.getTime() - previous.createdAt.getTime() < gapMs;

    if (current && sameAuthor && closeEnough) {
      current.messages.push(message);
    } else {
      groups.push({
        firstMessageId: message.id,
        authorId: message.authorId,
        authorName: message.authorName,
        date: message.createdAt,
        messages: [message],
      });
    }
  }
  return groups;
};

// Attachment URLs are signed and expire, so download in the same run
export const downloadImage = async (
  url: string,
  destination: string,
): Promise<void> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: HTTP ${response.status}`);
  }
  await fs.writeFile(destination, Buffer.from(await response.arrayBuffer()));
};
