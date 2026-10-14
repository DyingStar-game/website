import { Typography } from "@components/DS/typography";
import type { ChangelogBuild as ChangelogBuildData } from "@feat/changelog/changelogManager";
import { cn } from "@lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { ChevronRight } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";

import { ChangelogEntries } from "./changelogEntries";

type ChangelogBuildProps = {
  build: ChangelogBuildData;
  open?: boolean;
  className?: string;
};

/**
 * A dev release (a Universe Testing build), folded under its build time:
 * the visitor opens the ones they want to read.
 */
export const ChangelogBuild = async ({
  build,
  open = false,
  className,
}: ChangelogBuildProps) => {
  const t = await getTranslations("Changelog");
  const format = await getFormatter();

  const title = build.builtAt
    ? t("build", {
        time: format.dateTime(build.builtAt, {
          dateStyle: "long",
          timeStyle: "short",
          timeZone: "UTC",
        }),
      })
    : t("version", { version: build.version });

  return (
    <Card
      id={build.version}
      className={cn("scroll-mt-28 py-0 xl:scroll-mt-40", className)}
    >
      <details open={open} className="group">
        <summary className="flex cursor-pointer list-none items-center gap-2 py-6 [&::-webkit-details-marker]:hidden">
          <CardHeader className="flex flex-1 items-center gap-2">
            <ChevronRight className="size-5 shrink-0 text-primary transition-transform group-open:rotate-90" />
            <CardTitle className="text-base text-primary">{title}</CardTitle>
            <Typography variant="muted" className="ms-auto">
              {build.version}
            </Typography>
          </CardHeader>
        </summary>
        <CardContent className="pb-6">
          <ChangelogEntries groups={build.groups} />
        </CardContent>
      </details>
    </Card>
  );
};
