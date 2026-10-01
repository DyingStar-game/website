"use client";

import type { ChangelogFingerprints } from "@feat/changelog/changelog.model";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const STORAGE_KEY = "changelog-seen";

type ChangelogSeenStore = {
  seen: ChangelogFingerprints;
  /** False until the localStorage is read, so SSR and hydration show no indicator */
  hasHydrated: boolean;

  markAsSeen: (key: string, fingerprint: string) => void;
};

export const useChangelogSeenStore = create<ChangelogSeenStore>()(
  persist(
    (set) => ({
      seen: {},
      hasHydrated: false,

      markAsSeen: (key, fingerprint) =>
        set((state) =>
          state.seen[key] === fingerprint
            ? state
            : { seen: { ...state.seen, [key]: fingerprint } },
        ),
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ seen: state.seen }),
      // Rehydrated after mount (see useChangelogSeen) to avoid hydration mismatches
      skipHydration: true,
      onRehydrateStorage: () => () => {
        useChangelogSeenStore.setState({ hasHydrated: true });
      },
    },
  ),
);

// persist doesn't sync tabs on its own
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) {
      void useChangelogSeenStore.persist.rehydrate();
    }
  });
}
