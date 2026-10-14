import type { ChangelogGroup } from "@feat/changelog/changelogManager";
import { ClientMarkdown } from "@feat/markdown/clientMarkdown";
import { cn } from "@lib/utils";
import { useLocale, useTranslations } from "next-intl";

type ChangelogEntriesProps = {
  groups: ChangelogGroup[];
  className?: string;
};

/**
 * Renders the groups as markdown: a heading per type, then its entries as a
 * list, the area in bold before the headline and the details as a nested list.
 * Older entries have no type: without typed entries next to them, no heading.
 */
const toMarkdown = (
  groups: ChangelogGroup[],
  uncategorized: string,
  areaSeparator: string,
) =>
  groups
    .map((group) =>
      [
        ...(group.label === null && groups.length === 1
          ? []
          : [`#### ${group.label ?? uncategorized}`, ""]),
        ...group.entries.map((entry) =>
          [
            `- ${entry.area ? `**${entry.area}**${areaSeparator}` : ""}${entry.title}`,
            ...entry.details.map((detail) => `  - ${detail}`),
          ].join("\n"),
        ),
      ].join("\n"),
    )
    .join("\n\n");

export const ChangelogEntries = ({
  groups,
  className,
}: ChangelogEntriesProps) => {
  const t = useTranslations("Changelog");
  const locale = useLocale();

  return (
    <ClientMarkdown
      className={cn(
        "max-w-none prose-dyingstar",
        "prose-h4:mb-2 prose-h4:text-muted-foreground prose-h4:uppercase prose-h4:first:mt-0",
        "prose-li:text-primary prose-li:marker:text-primary",
        "[&_li_li]:my-1 [&_li_li]:text-muted-foreground [&_li_ul]:my-2 [&_li_ul]:list-none [&_li_ul]:ps-4",
        className,
      )}
      // Without it, a single block is rendered unwrapped and the className is lost
      options={{ forceWrapper: true }}
    >
      {toMarkdown(
        groups,
        t("uncategorized"),
        // French typography: a space before the colon
        locale === "fr" ? " : " : ": ",
      )}
    </ClientMarkdown>
  );
};
