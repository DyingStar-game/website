import {
  CHANGELOG_CHANNELS,
  type ChangelogChannel,
  type ChangelogFingerprints,
  getFingerprintKey,
} from "@feat/changelog/changelog.model";
import { DEFAULT_LOCALE } from "@i18n/config";
import { logger } from "@lib/logger";
import { createHash } from "crypto";
import type { Locale } from "next-intl";
import "server-only";
import { z } from "zod";

const CHANGELOG_URL =
  "https://raw.githubusercontent.com/DyingStar-game/changelog/refs/heads/main/global.json";

// raw.githubusercontent.com caches the file for 5 minutes, refetching more often is useless
const CHANGELOG_REVALIDATE_SECONDS = 300;

const LocalizedEntriesSchema = z.partialRecord(z.string(), z.array(z.string()));

const ChangelogComponentSchema = z.object({
  unreleased: LocalizedEntriesSchema,
  releases: z.array(
    z.object({
      version: z.string(),
      date: z.string(),
      entries: LocalizedEntriesSchema,
    }),
  ),
});

const ChangelogSchema = z.object({
  generated_at: z.string(),
  components: z.record(z.string(), ChangelogComponentSchema),
});

export type ChangelogEntry = {
  title: string;
  details: string[];
};

export type ChangelogRelease = {
  version: string;
  date: Date;
  entries: ChangelogEntry[];
};

export type ChangelogComponent = {
  key: string;
  name: string;
  unreleased: ChangelogEntry[];
  releases: ChangelogRelease[];
  /**
   * Content hash per channel, used to detect unseen changes on the client.
   * Computed on every locale so switching language doesn't flag anything as new.
   */
  fingerprints: Partial<Record<ChangelogChannel, string>>;
};

const COMPONENT_NAMES: Record<string, string> = {
  DyingStar: "Dying Star",
  horizonserver: "Horizon server",
  launcher: "Launcher",
};

/**
 * "services/resourcesDynamic" -> "Resources dynamic"
 */
const getComponentName = (key: string) => {
  if (key in COMPONENT_NAMES) return COMPONENT_NAMES[key];

  const name = (key.split("/").pop() ?? key)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase();

  return name.charAt(0).toUpperCase() + name.slice(1);
};

/**
 * An entry is a headline followed by indented detail lines:
 * "Headline\n  Detail 1\n  Detail 2"
 */
const parseEntry = (entry: string): ChangelogEntry => {
  const [title, ...details] = entry
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return { title, details };
};

const getLocalizedEntries = (
  entries: z.infer<typeof LocalizedEntriesSchema>,
  locale: Locale,
): ChangelogEntry[] => {
  const localized = entries[locale]?.length
    ? entries[locale]
    : (entries[DEFAULT_LOCALE] ?? []);

  return localized.filter((entry) => entry.trim()).map(parseEntry);
};

const getFingerprint = (data: unknown) =>
  createHash("sha1").update(JSON.stringify(data)).digest("hex").slice(0, 12);

const fetchChangelog = async () => {
  try {
    const response = await fetch(CHANGELOG_URL, {
      next: { revalidate: CHANGELOG_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      logger.error(
        `Unable to fetch changelog: ${response.status} ${response.statusText}`,
      );
      return null;
    }

    return ChangelogSchema.parse(await response.json());
  } catch (error) {
    logger.error("Unable to fetch changelog", error);
    return null;
  }
};

/**
 * Returns the localized changelog of every component, or null if it can't be fetched
 */
export const getChangelog = async (
  locale: Locale,
): Promise<ChangelogComponent[] | null> => {
  const changelog = await fetchChangelog();

  if (!changelog) return null;

  return Object.entries(changelog.components).map(([key, component]) => {
    const unreleased = getLocalizedEntries(component.unreleased, locale);
    const releases = component.releases
      .map((release) => ({
        version: release.version,
        date: new Date(release.date),
        entries: getLocalizedEntries(release.entries, locale),
      }))
      .filter((release) => release.entries.length > 0)
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    return {
      key,
      name: getComponentName(key),
      unreleased,
      releases,
      fingerprints: {
        ...(unreleased.length > 0 && {
          testing: getFingerprint(component.unreleased),
        }),
        ...(releases.length > 0 && {
          release: getFingerprint(component.releases),
        }),
      },
    };
  });
};

export const getChangelogFingerprints = (
  components: ChangelogComponent[],
): ChangelogFingerprints =>
  Object.fromEntries(
    components.flatMap((component) =>
      CHANGELOG_CHANNELS.flatMap((channel) => {
        const fingerprint = component.fingerprints[channel];
        return fingerprint
          ? [[getFingerprintKey(channel, component.key), fingerprint]]
          : [];
      }),
    ),
  );

export const hasChannelEntries = (
  component: ChangelogComponent,
  channel: ChangelogChannel,
) => component.fingerprints[channel] !== undefined;
