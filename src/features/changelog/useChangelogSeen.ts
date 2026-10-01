"use client";

import { useCallback, useEffect } from "react";

import type {
  ChangelogChannel,
  ChangelogFingerprints,
} from "@feat/changelog/changelog.model";
import { getFingerprintKey } from "@feat/changelog/changelog.model";
import { useChangelogSeenStore } from "@feat/changelog/changelogSeen.store";
import { useQuery } from "@tanstack/react-query";

export const useChangelogSeen = (fingerprints?: ChangelogFingerprints) => {
  // null until the localStorage is read, so no indicator is shown before that
  const seen = useChangelogSeenStore((state) =>
    state.hasHydrated ? state.seen : null,
  );
  const markAsSeen = useChangelogSeenStore((state) => state.markAsSeen);

  useEffect(() => {
    if (!useChangelogSeenStore.persist.hasHydrated()) {
      void useChangelogSeenStore.persist.rehydrate();
    }
  }, []);

  const isUnread = useCallback(
    (channel: ChangelogChannel, componentKey: string) => {
      if (!seen || !fingerprints) return false;
      const key = getFingerprintKey(channel, componentKey);
      return key in fingerprints && seen[key] !== fingerprints[key];
    },
    [seen, fingerprints],
  );

  const hasUnread = useCallback(
    (channel?: ChangelogChannel) => {
      if (!seen || !fingerprints) return false;
      return Object.entries(fingerprints).some(
        ([key, fingerprint]) =>
          (!channel || key.startsWith(`${channel}:`)) &&
          seen[key] !== fingerprint,
      );
    },
    [seen, fingerprints],
  );

  return { isUnread, hasUnread, markAsSeen };
};

export const useChangelogFingerprints = () => {
  const { data } = useQuery({
    queryKey: ["changelog", "fingerprints"],
    queryFn: async (): Promise<ChangelogFingerprints> => {
      const response = await fetch("/api/changelog/fingerprints");
      if (!response.ok) throw new Error("Unable to fetch changelog");
      return (await response.json()) as ChangelogFingerprints;
    },
    staleTime: 5 * 60 * 1000,
  });

  return data;
};
