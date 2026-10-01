import {
  getChangelog,
  getChangelogFingerprints,
} from "@feat/changelog/changelogManager";
import { DEFAULT_LOCALE } from "@i18n/config";
import { route } from "@lib/zodRoute";
import { NextResponse } from "next/server";

export const GET = route.handler(async () => {
  // Fingerprints are computed on every locale, any locale gives the same result
  const changelog = await getChangelog(DEFAULT_LOCALE);

  if (!changelog) {
    return NextResponse.json(
      { message: "Changelog unavailable" },
      { status: 503 },
    );
  }

  return NextResponse.json(getChangelogFingerprints(changelog));
});
