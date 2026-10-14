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

// global.json schema version 2 (ADR 0001 of DyingStar-game/changelog)
const LabelsSchema = z.partialRecord(z.string(), z.string());

const EntrySchema = z.object({
  // null for entries written before types and areas existed
  type: z.string().nullable(),
  area: z.string().nullable(),
  text: z.string(),
});

const LocalizedEntriesSchema = z.partialRecord(
  z.string(),
  z.array(EntrySchema),
);

const ChangelogComponentSchema = z.object({
  areas: z.record(z.string(), LabelsSchema),
  unreleased: z.object({
    url: z.string().nullable(),
    entries: LocalizedEntriesSchema,
  }),
  releases: z.array(
    z.object({
      version: z.string(),
      date: z.string(),
      yanked: z.boolean(),
      url: z.string().nullable(),
      entries: LocalizedEntriesSchema,
    }),
  ),
});

const ChangelogSchema = z.object({
  schema_version: z.literal(2),
  generated_at: z.string(),
  // Types in display order
  types: z.record(z.string(), LabelsSchema),
  components: z.record(z.string(), ChangelogComponentSchema),
});

type Labels = z.infer<typeof LabelsSchema>;

export type ChangelogEntry = {
  /** Localized label of the entry's area, null for older entries */
  area: string | null;
  title: string;
  details: string[];
};

export type ChangelogGroup = {
  /** Localized label of the type ("Added", "Fixed"…), null for older entries */
  label: string | null;
  entries: ChangelogEntry[];
};

export type ChangelogRelease = {
  version: string;
  date: Date;
  yanked: boolean;
  /** Compare link of the version on GitHub, when the component tags releases */
  url: string | null;
  groups: ChangelogGroup[];
};

export type ChangelogComponent = {
  key: string;
  name: string;
  unreleased: ChangelogGroup[];
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

const getLabel = (labels: Labels | undefined, locale: Locale) =>
  labels?.[locale] ?? labels?.[DEFAULT_LOCALE];

/**
 * Groups the localized entries by type, in the order of `types`, the entries
 * without a type last. An entry's text is a headline followed by detail lines:
 * "Headline\nDetail 1\nDetail 2"
 */
const getLocalizedGroups = (
  entries: z.infer<typeof LocalizedEntriesSchema>,
  changelog: z.infer<typeof ChangelogSchema>,
  areas: Record<string, Labels>,
  locale: Locale,
): ChangelogGroup[] => {
  const localized = (
    entries[locale]?.length ? entries[locale] : (entries[DEFAULT_LOCALE] ?? [])
  ).filter((entry) => entry.text.trim());

  return [...Object.keys(changelog.types), null].flatMap((type) => {
    const groupEntries = localized
      .filter((entry) => entry.type === type)
      .map((entry): ChangelogEntry => {
        const [title, ...details] = entry.text
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        const area = entry.area
          ? (getLabel(areas[entry.area], locale) ?? entry.area)
          : null;

        return { area, title, details };
      });

    if (groupEntries.length === 0) return [];
    const label = type
      ? (getLabel(changelog.types[type], locale) ?? type)
      : null;

    return [{ label, entries: groupEntries }];
  });
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
    const getGroups = (entries: z.infer<typeof LocalizedEntriesSchema>) =>
      getLocalizedGroups(entries, changelog, component.areas, locale);

    const unreleased = getGroups(component.unreleased.entries);
    const releases = component.releases
      .map((release) => ({
        version: release.version,
        date: new Date(release.date),
        yanked: release.yanked,
        url: release.url,
        groups: getGroups(release.entries),
      }))
      .filter((release) => release.groups.length > 0)
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    return {
      key,
      name: getComponentName(key),
      unreleased,
      releases,
      fingerprints: {
        ...(unreleased.length > 0 && {
          testing: getFingerprint(component.unreleased.entries),
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
