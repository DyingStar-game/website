import { logger } from "@lib/logger";
import fm from "front-matter";
import fs from "fs/promises";
import path from "path";
import { z } from "zod";

const docsDirectory = path.join(process.cwd(), "content/docs");

const AttributeSchema = z.object({
  title: z.string(),
  description: z.string(),
  keywords: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  coverUrl: z.string().optional(),
  order: z.number().optional(),
  subcategory: z.string().optional(),
  method: z.string().optional(),
  examples: z.record(z.string(), z.string()).optional(),
  results: z.record(z.string(), z.string()).optional(),
});

type DocAttributes = z.infer<typeof AttributeSchema>;

export type DocType = {
  slug: string;
  attributes: DocAttributes;
  content: string;
};

export async function getDocs(tags?: string[]) {
  try {
    // Check directory existence first to avoid noisy ENOENT errors during build
    try {
      const stat = await fs.stat(docsDirectory);
      if (!stat.isDirectory()) {
        logger.warn(`[docs] Path exists but is not a directory: ${docsDirectory}`);
        return [];
      }
    } catch (err: unknown) {
      const e = err as NodeJS.ErrnoException;
      if (e.code === "ENOENT") {
        // Directory intentionally absent -> return empty list silently (debug-level log only)
        if (process.env.NODE_ENV !== "production") {
          logger.debug(`[docs] Directory not found: ${docsDirectory}`);
        }
        return [];
      }
      logger.error("[docs] Unexpected error accessing docs directory:", e);
      return [];
    }

    const fileNames = await fs.readdir(docsDirectory);
    const docs: DocType[] = [];

    for await (const fileName of fileNames) {
      if (!fileName.endsWith(".mdx")) continue;

      const fullPath = path.join(docsDirectory, fileName);
      let fileContents: string;
      try {
        fileContents = await fs.readFile(fullPath, "utf8");
      } catch (readErr) {
        logger.warn(`[docs] Failed to read file ${fileName}:`, readErr);
        continue;
      }

      const matter = fm(fileContents);
      const result = AttributeSchema.safeParse(matter.attributes);

      if (!result.success) {
        logger.warn(`[docs] Invalid frontmatter in ${fileName}:`, result.error);
        continue;
      }

      if (tags && !result.data.tags?.some((tag) => tags.includes(tag))) {
        continue;
      }

      docs.push({
        slug: fileName.replace(/\.mdx$/i, ""),
        content: matter.body,
        attributes: result.data,
      });
    }

    return docs;
  } catch (error) {
    logger.error("[docs] Error while listing docs:", error);
    return [];
  }
}

export async function getCurrentDoc(slug: string): Promise<DocType | null> {
  try {
    // Early directory existence check (reuse logic from getDocs but simplified)
    try {
      const stat = await fs.stat(docsDirectory);
      if (!stat.isDirectory()) {
        logger.warn(`[docs] Path exists but is not a directory: ${docsDirectory}`);
        return null;
      }
    } catch (err: unknown) {
      const e = err as NodeJS.ErrnoException;
      if (e.code === "ENOENT") {
        return null; // Directory missing -> no doc
      }
      logger.error(`[docs] Unexpected error accessing docs directory for slug ${slug}:`, e);
      return null;
    }

    const filePath = path.join(docsDirectory, `${slug}.mdx`);
    let fileContents: string;
    try {
      fileContents = await fs.readFile(filePath, "utf8");
    } catch (readErr: unknown) {
      const e = readErr as NodeJS.ErrnoException;
      if (e.code !== "ENOENT") {
        logger.warn(`[docs] Failed reading doc ${slug}:`, e);
      }
      return null;
    }

    const matter = fm(fileContents);
    const result = AttributeSchema.safeParse(matter.attributes);
    if (!result.success) {
      logger.warn(`[docs] Invalid frontmatter in ${slug}.mdx:`, result.error);
      return null;
    }

    return {
      slug,
      content: matter.body,
      attributes: result.data,
    };
  } catch (error) {
    logger.error(`[docs] Fatal error getting doc ${slug}:`, error);
    return null;
  }
}
