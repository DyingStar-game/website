export const CHANGELOG_CHANNELS = ["release", "testing"] as const;
export type ChangelogChannel = (typeof CHANGELOG_CHANNELS)[number];

export type ChangelogFingerprints = Record<string, string>;

export const getFingerprintKey = (
  channel: ChangelogChannel,
  componentKey: string,
) => `${channel}:${componentKey}`;
