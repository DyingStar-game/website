"use client";

import type {
  ChangelogChannel,
  ChangelogFingerprints,
} from "@feat/changelog/changelog.model";
import { useChangelogSeen } from "@feat/changelog/useChangelogSeen";
import { LINKS } from "@feat/navigation/Links";
import { Link } from "@i18n/navigation";
import { Button } from "@ui/button";
import { useTranslations } from "next-intl";

type ChangelogChannelButtonProps = {
  channel: ChangelogChannel;
  isActive: boolean;
  fingerprints: ChangelogFingerprints;
};

export const ChangelogChannelButton = ({
  channel,
  isActive,
  fingerprints,
}: ChangelogChannelButtonProps) => {
  const t = useTranslations("Changelog");
  const { hasUnread } = useChangelogSeen(fingerprints);

  return (
    <Button
      asChild
      variant={isActive ? "default" : "outline"}
      className="w-full"
      indicator={hasUnread(channel) && t("unread")}
    >
      <Link
        href={{
          pathname: LINKS.Project.Changelog.href(),
          query: { channel },
        }}
      >
        {t(`Channel.${channel}`)}
      </Link>
    </Button>
  );
};
