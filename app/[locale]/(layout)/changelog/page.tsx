import { JsonLd } from "@components/DS/jsonLd";
import { Typography } from "@components/DS/typography";
import {
  CHANGELOG_CHANNELS,
  type ChangelogChannel,
  getFingerprintKey,
} from "@feat/changelog/changelog.model";
import {
  getChangelog,
  getChangelogFingerprints,
  hasChannelEntries,
} from "@feat/changelog/changelogManager";
import { LINKS } from "@feat/navigation/Links";
import {
  LayoutHeader,
  LayoutMain,
  LayoutSection,
  LayoutTitle,
} from "@feat/page/layout";
import { combineWithParentMetadata } from "@lib/metadata";
import { createLocalizedUrl } from "@lib/serverUrl";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { FileQuestion } from "lucide-react";
import type { ResolvingMetadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";
import type { WebPage, WithContext } from "schema-dts";

import { ChangelogChannelButton } from "./_components/changelogChannelButton";
import { ChangelogEntries } from "./_components/changelogEntries";
import { ChangelogMarkAsSeen } from "./_components/changelogMarkAsSeen";
import { ChangelogSidebar } from "./_components/changelogSidebar";

const DEFAULT_CHANNEL: ChangelogChannel = "testing";

export const generateMetadata = async (
  props: {
    params: Record<string, string>;
    searchParams?: Record<string, string | string[] | undefined>;
  },
  parent: ResolvingMetadata,
) => {
  const t = await getTranslations("Changelog.Metadata");

  const mergeFn = combineWithParentMetadata({
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    openGraph: {
      url: LINKS.Project.Changelog.href(),
      type: "website",
    },
    alternates: {
      canonical: LINKS.Project.Changelog.href(),
    },
  });
  return mergeFn(props, parent);
};

const parseChannel = (channel: unknown): ChangelogChannel =>
  CHANGELOG_CHANNELS.find((c) => c === channel) ?? DEFAULT_CHANNEL;

const ChangelogPage = async (props: PageProps<"/[locale]/changelog">) => {
  const { locale } = await props.params;
  const searchParams = await props.searchParams;

  const t = await getTranslations("Changelog");
  const format = await getFormatter();

  const channel = parseChannel(searchParams.channel);
  const changelog = await getChangelog(locale);
  const fingerprints = getChangelogFingerprints(changelog ?? []);
  const components =
    changelog?.filter((component) => hasChannelEntries(component, channel)) ??
    [];
  const currentComponent =
    components.find((component) => component.key === searchParams.component) ??
    components.at(0);

  const changelogPageJsonLd: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t("JsonLd.name"),
    inLanguage: locale,
    url: createLocalizedUrl(locale, LINKS.Project.Changelog.href()),
  };

  return (
    <LayoutMain>
      <LayoutHeader className="gap-6 lg:flex-row lg:items-center lg:justify-between">
        <LayoutTitle>{t("title")}</LayoutTitle>
        <nav className="flex flex-col gap-2 lg:flex-row">
          {CHANGELOG_CHANNELS.map((c) => (
            <ChangelogChannelButton
              key={c}
              channel={c}
              isActive={c === channel}
              fingerprints={fingerprints}
            />
          ))}
        </nav>
      </LayoutHeader>

      {!currentComponent ? (
        <LayoutSection className="items-center gap-6" padding="default">
          <FileQuestion className="size-20" />
          <Typography variant="h3" className="text-center">
            {changelog
              ? t("empty", { channel: t(`Channel.${channel}`) })
              : t("unavailable")}
          </Typography>
        </LayoutSection>
      ) : (
        <LayoutSection className="gap-8 md:flex-row md:items-start">
          <aside className="shrink-0 md:sticky md:top-28 md:w-56 xl:top-40">
            <ChangelogSidebar
              components={components}
              channel={channel}
              currentComponent={currentComponent.key}
              fingerprints={fingerprints}
            />
          </aside>
          <ChangelogMarkAsSeen
            fingerprintKey={getFingerprintKey(channel, currentComponent.key)}
            fingerprint={
              fingerprints[getFingerprintKey(channel, currentComponent.key)]
            }
          />

          <div className="flex min-w-0 flex-1 flex-col gap-6">
            {channel === "testing" ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">
                    {t("heading", {
                      component: currentComponent.name,
                      channel: t(`Channel.${channel}`),
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChangelogEntries entries={currentComponent.unreleased} />
                </CardContent>
              </Card>
            ) : (
              currentComponent.releases.map((release) => (
                <Card
                  key={release.version}
                  id={release.version}
                  className="scroll-mt-28 xl:scroll-mt-40"
                >
                  <CardHeader>
                    <CardTitle className="text-primary">
                      {currentComponent.name} —{" "}
                      {t("version", { version: release.version })}
                    </CardTitle>
                    <Typography variant="muted">
                      {format.dateTime(release.date, {
                        dateStyle: "long",
                        timeZone: "UTC",
                      })}
                    </Typography>
                  </CardHeader>
                  <CardContent>
                    <ChangelogEntries entries={release.entries} />
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </LayoutSection>
      )}
      <JsonLd data={changelogPageJsonLd} />
    </LayoutMain>
  );
};

export default ChangelogPage;
