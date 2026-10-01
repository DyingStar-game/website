"use client";

import type { ComponentProps } from "react";

import { PulseIndicator } from "@components/DS/pulseIndicator";
import type {
  ChangelogChannel,
  ChangelogFingerprints,
} from "@feat/changelog/changelog.model";
import { useChangelogSeen } from "@feat/changelog/useChangelogSeen";
import { Link } from "@i18n/navigation";
import { cn } from "@lib/utils";
import { useTranslations } from "next-intl";

type ChangelogSidebarLinkProps = {
  href: Exclude<ComponentProps<typeof Link>["href"], string>;
  isActive: boolean;
  /** When set, shows an indicator if this channel/component has unseen changes */
  unseen?: {
    channel: ChangelogChannel;
    componentKey: string;
    fingerprints: ChangelogFingerprints;
  };
  children: string;
};

export const ChangelogSidebarLink = ({
  href,
  isActive,
  unseen,
  children,
}: ChangelogSidebarLinkProps) => {
  const t = useTranslations("Changelog");
  const { isUnread } = useChangelogSeen(unseen?.fingerprints);
  const hasIndicator = unseen && isUnread(unseen.channel, unseen.componentKey);

  return (
    <Link
      href={href}
      className={cn(
        "relative rounded-md border border-transparent px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground",
        {
          "border-primary text-primary hover:text-primary": isActive,
        },
      )}
    >
      {children}
      {hasIndicator && (
        <PulseIndicator
          className="top-1/2 right-3 -translate-y-1/2"
          label={t("unread")}
        />
      )}
    </Link>
  );
};
