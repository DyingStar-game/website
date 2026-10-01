"use client";

import { useEffect } from "react";

import { useChangelogSeen } from "@feat/changelog/useChangelogSeen";

type ChangelogMarkAsSeenProps = {
  fingerprintKey: string;
  fingerprint: string;
};

export const ChangelogMarkAsSeen = ({
  fingerprintKey,
  fingerprint,
}: ChangelogMarkAsSeenProps) => {
  const { markAsSeen } = useChangelogSeen();

  useEffect(() => {
    markAsSeen(fingerprintKey, fingerprint);
  }, [markAsSeen, fingerprintKey, fingerprint]);

  return null;
};
