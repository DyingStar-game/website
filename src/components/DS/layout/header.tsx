"use client";

import { useState } from "react";

import { HeaderBase } from "@components/DS/layout/headerBase";
import NavLink from "@components/DS/layout/navLink";
import {
  useChangelogFingerprints,
  useChangelogSeen,
} from "@feat/changelog/useChangelogSeen";
import { LINKS } from "@feat/navigation/Links";
import type { buttonVariants } from "@ui/button";
import type { VariantProps } from "class-variance-authority";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useTranslations } from "next-intl";

export const Header = () => {
  const [size, setSize] =
    useState<VariantProps<typeof buttonVariants>["size"]>("lg");

  const { scrollY } = useScroll();
  const t = useTranslations("Changelog");
  const { hasUnread } = useChangelogSeen(useChangelogFingerprints());
  const hasUnreadChangelog = hasUnread();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setSize(latest < 100 ? "lg" : "default");
  });

  return (
    <HeaderBase
      menuIndicator={hasUnreadChangelog}
      start={
        <>
          <NavLink link={LINKS.Project.Project} size={size} />
          <NavLink link={LINKS.Project.Features} size={size} />
          <NavLink link={LINKS.Project.Contribute} size={size} />
        </>
      }
      end={
        <>
          <NavLink link={LINKS.News.All} size={size} />
          <NavLink
            link={LINKS.Project.Changelog}
            size={size}
            indicator={hasUnreadChangelog && t("unread")}
          />
          <NavLink link={LINKS.Project.Play} size={size} variant="outline" />
        </>
      }
    />
  );
};
