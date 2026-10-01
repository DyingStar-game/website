import fm from "front-matter";
import fs from "fs/promises";
import type { Locale } from "next-intl";
import path from "path";
import "server-only";
import { z } from "zod";

const ContentPageAttributesSchema = z.object({
  title: z.string(),
  /**
   * Browser tab title, defaults to `title`
   */
  metaTitle: z.string().optional(),
  description: z.string(),
  keywords: z.array(z.string()),
});

type ContentPageAttributes = z.infer<typeof ContentPageAttributesSchema>;

export type ContentPage = {
  slug: string;
  attributes: ContentPageAttributes;
  content: string;
};

/**
 * Reads `content/<locale>/pages/<slug>.md`, returns null if the page doesn't exist in this locale
 */
export const getContentPage = async (
  slug: string,
  locale: Locale,
): Promise<ContentPage | null> => {
  const filePath = path.join(
    process.cwd(),
    "content",
    locale,
    "pages",
    `${slug}.md`,
  );

  let fileContents: string;
  try {
    fileContents = await fs.readFile(filePath, "utf8");
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }

  const matter = fm(fileContents);

  return {
    slug,
    // Throws on purpose: an invalid frontmatter is a content error to fix
    attributes: ContentPageAttributesSchema.parse(matter.attributes),
    content: matter.body,
  };
};
