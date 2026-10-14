import { Typography } from "@components/DS/typography";
import type {
  ChangelogChannel,
  ChangelogFingerprints,
} from "@feat/changelog/changelog.model";
import type { ChangelogComponent } from "@feat/changelog/changelogManager";
import { LINKS } from "@feat/navigation/Links";
import { cn } from "@lib/utils";
import { getTranslations } from "next-intl/server";

import { ChangelogSidebarLink } from "./changelogSidebarLink";

type ChangelogSidebarProps = {
  components: ChangelogComponent[];
  channel: ChangelogChannel;
  currentComponent: string;
  fingerprints: ChangelogFingerprints;
};

export const ChangelogSidebar = async ({
  components,
  channel,
  currentComponent,
  fingerprints,
}: ChangelogSidebarProps) => {
  const t = await getTranslations("Changelog");

  return (
    <nav className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Typography variant="small" className="uppercase">
          {t("title")}
        </Typography>
        <Typography variant="muted">{t(`Sidebar.${channel}`)}</Typography>
      </div>

      {components.map((component) => {
        const isActive = component.key === currentComponent;
        const href = {
          pathname: LINKS.Project.Changelog.href(),
          query: { channel, component: component.key },
        };
        const unseen = { channel, componentKey: component.key, fingerprints };

        return (
          <div key={component.key} className="flex flex-col gap-2">
            <Typography
              variant="muted"
              className={cn("font-medium uppercase", {
                "text-primary": channel === "release" && isActive,
              })}
            >
              {component.name}
            </Typography>
            {channel === "testing"
              ? // What's new, then a link per version its builds lead to; the
                // first one carries the selection and the indicator
                [
                  ...(component.unreleased.length > 0
                    ? [{ hash: "unreleased", label: t("Sidebar.unreleased") }]
                    : []),
                  ...component.devVersions.map((devVersion) => ({
                    hash: `v${devVersion.version}`,
                    label: t(
                      devVersion.released ? "version" : "versionInProgress",
                      { version: devVersion.version },
                    ),
                  })),
                ].map((link, index) => (
                  <ChangelogSidebarLink
                    key={link.hash}
                    href={index === 0 ? href : { ...href, hash: link.hash }}
                    isActive={isActive && index === 0}
                    unseen={index === 0 ? unseen : undefined}
                  >
                    {link.label}
                  </ChangelogSidebarLink>
                ))
              : component.releases.map((release, index) => (
                  <ChangelogSidebarLink
                    key={release.version}
                    href={{ ...href, hash: release.version }}
                    isActive={false}
                    // The indicator goes on the latest version only
                    unseen={index === 0 ? unseen : undefined}
                  >
                    {release.version}
                  </ChangelogSidebarLink>
                ))}
          </div>
        );
      })}
    </nav>
  );
};
