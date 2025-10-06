import type { GeneratedNavigationLinks } from "@feat/navigation/navigation.model";
import { usePathname } from "next/navigation";

export const useCurrentPath = (links: GeneratedNavigationLinks) => {
  const currentPath = usePathname().split("/").filter(Boolean);

  const linkMatchCounts = links.map((link) => {
    return {
      url: link.href,
      matchCount: link.href
        .split("/")
        .filter(Boolean)
        .filter((segment, index) => segment === currentPath[index]).length,
    };
  });

  const mostMatchingLink = linkMatchCounts.reduce(
    (maxMatchLink, currentLink) =>
      currentLink.matchCount > maxMatchLink.matchCount
        ? currentLink
        : maxMatchLink,
    { url: "", matchCount: 0 },
  );

  return mostMatchingLink.url || links[0].href;
};
