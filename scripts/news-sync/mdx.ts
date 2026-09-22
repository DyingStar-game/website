import fm from "front-matter";
import fs from "fs/promises";
import path from "path";
import prettier from "prettier";
import { Document, YAMLMap } from "yaml";

export type ExistingNews = {
  // `discordMessageId` values already imported (FR side is the source of truth)
  discordIds: Set<string>;
  // Most recent `date` found in FR news, used as the default `--since`
  maxDate: Date | undefined;
  // File basenames (without .mdx) of both locales, used to avoid collisions
  fileNames: Set<string>;
};

type ScannedAttributes = {
  date?: Date | string;
  discordMessageId?: string | number;
};

const listMdx = async (directory: string): Promise<string[]> => {
  const entries = await fs.readdir(directory);
  return entries.filter((entry) => entry.endsWith(".mdx"));
};

export const scanExistingNews = async (
  contentDir: string,
): Promise<ExistingNews> => {
  const frDir = path.join(contentDir, "fr", "news");
  const enDir = path.join(contentDir, "en", "news");
  const [frFiles, enFiles] = await Promise.all([
    listMdx(frDir),
    listMdx(enDir),
  ]);

  const discordIds = new Set<string>();
  let maxDate: Date | undefined;

  const frContents = await Promise.all(
    frFiles.map(async (fileName) =>
      fs.readFile(path.join(frDir, fileName), "utf8"),
    ),
  );
  for (const content of frContents) {
    const { attributes } = fm<ScannedAttributes>(content);
    if (attributes.discordMessageId !== undefined) {
      discordIds.add(String(attributes.discordMessageId));
    }
    const date =
      attributes.date instanceof Date
        ? attributes.date
        : attributes.date
          ? new Date(attributes.date)
          : undefined;
    if (date && !Number.isNaN(date.getTime())) {
      if (!maxDate || date > maxDate) maxDate = date;
    }
  }

  const fileNames = new Set(
    [...frFiles, ...enFiles].map((fileName) => fileName.replace(/\.mdx$/, "")),
  );

  return { discordIds, maxDate, fileNames };
};

export const toSlug = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/, "");

export type NewsFileNames = { fr: string; en: string };

/**
 * Picks the FR and EN basenames for a news published on `datePrefix` (YYYYMMDD).
 * Convention: `YYYYMMDD-<slug>` when the day is free, `YYYYMMDD-N-<slug>` otherwise.
 * `reserved` is mutated so several news on the same day get consistent suffixes.
 */
export const allocateFileNames = (
  datePrefix: string,
  frSlug: string,
  enSlug: string,
  reserved: Set<string>,
): NewsFileNames => {
  const sameDay = [...reserved].filter((name) =>
    name.startsWith(`${datePrefix}-`),
  );
  let index = 0;
  if (sameDay.length > 0) {
    const suffixes = sameDay.map((name) =>
      Number(/^\d{8}-(\d+)-/.exec(name)?.[1] ?? 1),
    );
    index = Math.max(1, ...suffixes) + 1;
  }

  for (;;) {
    const prefix = index === 0 ? datePrefix : `${datePrefix}-${index}`;
    const fr = `${prefix}-${frSlug}`;
    const en = `${prefix}-${enSlug}`;
    if (!reserved.has(fr) && !reserved.has(en)) {
      reserved.add(fr);
      reserved.add(en);
      return { fr, en };
    }
    index += 1;
  }
};

// `YYYY-MM-DDTHH:mm:ss` in the given timezone, without offset (matches existing news)
export const formatDateForFrontmatter = (date: Date, timeZone: string) =>
  new Intl.DateTimeFormat("sv-SE", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
    .format(date)
    .replace(" ", "T");

export const toDatePrefix = (frontmatterDate: string) =>
  frontmatterDate.slice(0, 10).replaceAll("-", "");

export type FrontmatterAttributes = {
  title: string;
  titleIcon: string;
  category: string;
  description: string;
  keywords: string[];
  tags: string[];
  coverUrl: string;
  date: string;
  author: string;
  authorRoles: string[];
  alternates: Record<string, string>;
  discordMessageId: string;
};

export const renderMdx = (
  attributes: FrontmatterAttributes,
  body: string,
): string => {
  const doc = new Document(attributes);
  const alternates = doc.get("alternates", true);
  if (alternates instanceof YAMLMap) alternates.flow = true;
  const frontmatter = doc.toString({ lineWidth: 0 });
  return `---\n${frontmatter}---\n\n${body.trim()}\n`;
};

export const formatMdx = async (
  filePath: string,
  content: string,
): Promise<string> => {
  const options = await prettier.resolveConfig(filePath);
  return prettier.format(content, { ...options, filepath: filePath });
};

export const writeMdx = async (
  filePath: string,
  content: string,
): Promise<void> => {
  await fs.writeFile(filePath, content, "utf8");
};
