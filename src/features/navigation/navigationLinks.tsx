"use client";

import { Typography } from "@components/DS/typography";
import { useCurrentPath } from "@hooks/useCurrentPath";
import { cn } from "@lib/utils";
import { LayoutGroup, motion } from "framer-motion";
import Link from "next/link";

import type {
  GeneratedNavigationLink,
  GeneratedNavigationLinksGroup,
  GeneratedNavigationLinksGroups,
  GeneratedNavigationLinks as GeneratedNavigationLinksSchema,
} from "./navigation.model";

const MotionLink = motion(Link);

export const NavigationLinks = ({
  navigation,
}: {
  navigation: GeneratedNavigationLinksGroups;
}) => {
  const links: GeneratedNavigationLinksSchema = navigation
    .flatMap((group: GeneratedNavigationLinksGroup) => group.links)
    .filter((l) => !l.hidden);

  const currentPath = useCurrentPath(links);

  return (
    <LayoutGroup>
      <nav className="mt-4 grid items-start px-2 text-sm font-medium lg:px-4">
        {navigation.map(
          (group: GeneratedNavigationLinksGroup, groupIndex: number) =>
            group.links.length > 0 && (
              <div
                className="mb-6 flex flex-col gap-2 px-1"
                key={group.title + groupIndex}
              >
                <div className="group flex items-center justify-between">
                  <Typography variant="small">{group.title}</Typography>
                </div>
                {group.links.map(
                  (link: GeneratedNavigationLink, index: number) => (
                    <MotionLink
                      key={index}
                      href={link.href}
                      className={cn(
                        `relative flex items-center gap-3 rounded-lg px-3 py-2 transition`,
                        {
                          "text-muted-foreground hover:text-foreground":
                            currentPath !== link.href,
                        },
                      )}
                    >
                      {currentPath === link.href && (
                        <motion.div
                          layoutId={"motion-link"}
                          className="absolute inset-0 rounded-lg bg-accent"
                        ></motion.div>
                      )}
                      <div className="relative flex w-full items-center gap-x-1.5 text-left">
                        {link.Icon && <link.Icon className="size-4" />}
                        {link.label}
                      </div>
                    </MotionLink>
                  ),
                )}
              </div>
            ),
        )}
      </nav>
    </LayoutGroup>
  );
};
