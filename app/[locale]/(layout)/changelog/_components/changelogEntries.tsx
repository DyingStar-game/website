import type { ChangelogEntry } from "@feat/changelog/changelogManager";
import { ClientMarkdown } from "@feat/markdown/clientMarkdown";
import { cn } from "@lib/utils";

type ChangelogEntriesProps = {
  entries: ChangelogEntry[];
  className?: string;
};

/**
 * Renders entries as a markdown list: the headline as an item, the details as a nested list
 */
const toMarkdown = (entries: ChangelogEntry[]) =>
  entries
    .map((entry) =>
      [
        `- ${entry.title}`,
        ...entry.details.map((detail) => `  - ${detail}`),
      ].join("\n"),
    )
    .join("\n");

export const ChangelogEntries = ({
  entries,
  className,
}: ChangelogEntriesProps) => {
  return (
    <ClientMarkdown
      className={cn(
        "max-w-none prose-dyingstar",
        "prose-li:text-primary prose-li:marker:text-primary",
        "[&_li_li]:my-1 [&_li_li]:text-muted-foreground [&_li_ul]:my-2 [&_li_ul]:list-none [&_li_ul]:ps-4",
        className,
      )}
      // Without it, the single <ul> is rendered unwrapped and the className is lost
      options={{ forceWrapper: true }}
    >
      {toMarkdown(entries)}
    </ClientMarkdown>
  );
};
