import { logger } from "@lib/logger";
import { resolveAuthor } from "@scripts/news-sync/authors";
import {
  type ClaudeInput,
  type GeneratedNews,
  MAX_TAGS,
  generateNews,
} from "@scripts/news-sync/claude";
import {
  type NewsGroup,
  type NewsImage,
  createRest,
  downloadImage,
  fetchMessagesSince,
  groupMessages,
} from "@scripts/news-sync/discord";
import {
  CONTENT_DIR,
  DEFAULT_COVER_URL,
  GROUP_GAP_MS,
  IMAGES_DIR,
  IMAGES_URL_PREFIX,
  NEWS_TIMEZONE,
  loadEnv,
} from "@scripts/news-sync/env";
import {
  type ExistingNews,
  type FrontmatterAttributes,
  allocateFileNames,
  formatDateForFrontmatter,
  formatMdx,
  renderMdx,
  scanExistingNews,
  toDatePrefix,
  toSlug,
  writeMdx,
} from "@scripts/news-sync/mdx";
import { DiscordAPIError } from "discord.js";
import fs from "fs/promises";
import path from "path";
import { parseArgs } from "util";

type CliOptions = {
  since?: Date;
  dryRun: boolean;
  limit?: number;
};

const USAGE = `Usage: pnpm news:sync [--since=YYYY-MM-DD] [--dry-run] [--limit=N]

  --since    Only import Discord messages posted after this date
             (default: date of the most recent news in content/fr/news)
  --dry-run  Generate the articles and print them, write nothing on disk
  --limit    Import at most N news
`;

const parseCliOptions = (argv: string[]): CliOptions => {
  const { values } = parseArgs({
    args: argv,
    options: {
      since: { type: "string" },
      "dry-run": { type: "boolean", default: false },
      limit: { type: "string" },
      help: { type: "boolean", default: false },
    },
  });

  if (values.help) {
    process.stdout.write(USAGE);
    process.exit(0);
  }

  const since = values.since ? new Date(values.since) : undefined;
  if (since && Number.isNaN(since.getTime())) {
    throw new Error(`Invalid --since date: ${values.since}`);
  }
  const limit = values.limit ? Number(values.limit) : undefined;
  if (limit !== undefined && (!Number.isInteger(limit) || limit < 0)) {
    throw new Error(`Invalid --limit: ${values.limit}`);
  }

  return { since, dryRun: values["dry-run"], limit };
};

const EXTENSION_BY_CONTENT_TYPE: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

const imageExtension = (image: NewsImage): string =>
  EXTENSION_BY_CONTENT_TYPE[image.contentType] ??
  (path.extname(image.filename).replace(".", "").toLowerCase() || "png");

// Images are named `<YYYYMMDD>-<n>.<ext>`, continuing after the ones already present
const nextImageIndex = async (datePrefix: string): Promise<number> => {
  const files = await fs.readdir(IMAGES_DIR);
  const pattern = new RegExp(`^${datePrefix}-(\\d+)\\.`);
  const indexes = files.map((file) => Number(pattern.exec(file)?.[1] ?? 0));
  return Math.max(0, ...indexes) + 1;
};

type PlannedImage = NewsImage & { fileName: string; publicUrl: string };

type ImagePlan = {
  coverUrl: string;
  images: PlannedImage[];
  // Markdown lines to insert after the message that carried each image
  bodyImagesByMessage: Map<string, string[]>;
};

const planImages = async (
  group: NewsGroup,
  datePrefix: string,
): Promise<ImagePlan> => {
  let index = await nextImageIndex(datePrefix);
  const images: PlannedImage[] = [];
  const bodyImagesByMessage = new Map<string, string[]>();

  for (const message of group.messages) {
    for (const image of message.images) {
      const fileName = `${datePrefix}-${index}.${imageExtension(image)}`;
      const publicUrl = `${IMAGES_URL_PREFIX}/${fileName}`;
      images.push({ ...image, fileName, publicUrl });
      // The first image is the cover; the others are embedded in the body
      if (images.length > 1) {
        const lines = bodyImagesByMessage.get(message.id) ?? [];
        lines.push(`![${path.parse(image.filename).name}](${publicUrl})`);
        bodyImagesByMessage.set(message.id, lines);
      }
      index += 1;
    }
  }

  return {
    coverUrl: images[0]?.publicUrl ?? DEFAULT_COVER_URL,
    images,
    bodyImagesByMessage,
  };
};

const buildRawMarkdown = (group: NewsGroup, plan: ImagePlan): string =>
  group.messages
    .map((message) =>
      [message.content, ...(plan.bodyImagesByMessage.get(message.id) ?? [])]
        .filter((part) => part !== "")
        .join("\n\n"),
    )
    .filter((part) => part !== "")
    .join("\n\n");

// Claude must keep every body image; append any it dropped so nothing is lost
const ensureImages = (body: string, imageLines: string[]): string => {
  const missing = imageLines.filter((line) => !body.includes(line));
  if (missing.length === 0) return body;
  logger.warn(
    `${missing.length} image(s) were missing from the body, appended`,
  );
  return `${body.trim()}\n\n${missing.join("\n\n")}`;
};

type ImportContext = {
  existing: ExistingNews;
  options: CliOptions;
};

const importGroup = async (
  group: NewsGroup,
  { existing, options }: ImportContext,
): Promise<void> => {
  const date = formatDateForFrontmatter(group.date, NEWS_TIMEZONE);
  const datePrefix = toDatePrefix(date);
  const author = resolveAuthor(group.authorId, group.authorName);
  const plan = await planImages(group, datePrefix);
  const bodyImageLines = [...plan.bodyImagesByMessage.values()].flat();

  logger.info(
    `Generating news from ${group.messages.length} message(s) by ${author.author} (${date})…`,
  );

  const input: ClaudeInput = {
    author: author.author,
    authorRolesFr: author.roles.fr,
    date,
    bodyImages: bodyImageLines,
    rawMarkdown: buildRawMarkdown(group, plan),
  };
  const generated: GeneratedNews = await generateNews(input);

  const frSlug = toSlug(generated.fr.slug) || toSlug(generated.fr.title);
  const enSlug = toSlug(generated.en.slug) || toSlug(generated.en.title);
  const names = allocateFileNames(
    datePrefix,
    frSlug,
    enSlug,
    existing.fileNames,
  );

  const common = {
    category: "test",
    keywords: ["news"],
    coverUrl: plan.coverUrl,
    date,
    author: author.author,
    discordMessageId: group.firstMessageId,
  };
  const frAttributes: FrontmatterAttributes = {
    title: generated.fr.title,
    titleIcon: generated.fr.titleIcon,
    ...common,
    description: generated.fr.description,
    tags: generated.fr.tags.slice(0, MAX_TAGS),
    authorRoles: author.roles.fr,
    alternates: { en: names.en },
  };
  const enAttributes: FrontmatterAttributes = {
    title: generated.en.title,
    titleIcon: generated.fr.titleIcon,
    ...common,
    description: generated.en.description,
    tags: generated.en.tags.slice(0, MAX_TAGS),
    authorRoles:
      author.roles.en.length > 0 ? author.roles.en : generated.en.authorRoles,
    alternates: { fr: names.fr },
  };

  const frPath = path.join(CONTENT_DIR, "fr", "news", `${names.fr}.mdx`);
  const enPath = path.join(CONTENT_DIR, "en", "news", `${names.en}.mdx`);
  const frMdx = await formatMdx(
    frPath,
    renderMdx(frAttributes, ensureImages(generated.fr.body, bodyImageLines)),
  );
  const enMdx = await formatMdx(
    enPath,
    renderMdx(enAttributes, ensureImages(generated.en.body, bodyImageLines)),
  );

  if (options.dryRun) {
    const imageList = plan.images
      .map((image) => `  ${image.fileName} ← ${image.url}`)
      .join("\n");
    process.stdout.write(
      `\n===== [dry-run] ${frPath}\n${frMdx}\n===== [dry-run] ${enPath}\n${enMdx}\n===== [dry-run] images\n${imageList || "  (none)"}\n`,
    );
    return;
  }

  // Download only once Claude succeeded, so a failure leaves no orphan files
  await Promise.all(
    plan.images.map(async (image) =>
      downloadImage(image.url, path.join(IMAGES_DIR, image.fileName)),
    ),
  );
  await writeMdx(frPath, frMdx);
  await writeMdx(enPath, enMdx);
  existing.discordIds.add(group.firstMessageId);
  logger.info(`Created ${path.relative(process.cwd(), frPath)}`);
  logger.info(`Created ${path.relative(process.cwd(), enPath)}`);
};

const main = async () => {
  const options = parseCliOptions(process.argv.slice(2));
  const env = loadEnv();
  const existing = await scanExistingNews(CONTENT_DIR);

  const since = options.since ?? existing.maxDate ?? new Date(0);
  logger.info(`Fetching #news messages since ${since.toISOString()}…`);

  const rest = createRest(env.DISCORD_BOT_TOKEN);
  const messages = await fetchMessagesSince(
    rest,
    env.DISCORD_NEWS_CHANNEL_ID,
    since,
  );
  const allGroups = groupMessages(messages, GROUP_GAP_MS);
  const groups = allGroups
    .filter((group) => !existing.discordIds.has(group.firstMessageId))
    .filter((group) =>
      group.messages.some((m) => m.content !== "" || m.images.length > 0),
    )
    .slice(0, options.limit);

  logger.info(
    `${messages.length} message(s) → ${allGroups.length} group(s), ${groups.length} to import${options.dryRun ? " (dry-run)" : ""}`,
  );
  if (groups.length === 0) return;

  for (const group of groups) {
    await importGroup(group, { existing, options });
  }
};

main().catch((error: unknown) => {
  if (error instanceof DiscordAPIError && error.status === 401) {
    logger.error(
      "Discord rejected DISCORD_BOT_TOKEN (401): use the bot token from the Developer Portal (Bot → Reset Token), not the application id or client secret.",
    );
  } else if (error instanceof DiscordAPIError && error.status === 403) {
    logger.error(
      "Discord refused access to the channel (403): invite the bot to the server with the View Channels and Read Message History permissions.",
    );
  } else {
    logger.error({ error });
  }
  process.exit(1);
});
