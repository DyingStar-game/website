import { LINKS } from "@feat/navigation/Links";
import type {
  GeneratedNavigationLinksGroups,
  NavigationLink,
  NavigationLinksGroup,
  NavigationLinksGroups,
} from "@feat/navigation/navigation.model";

const FOOTER_LINKS: NavigationLinksGroups = [
  {
    title: "Layout.Footer.Project",
    links: [LINKS.Project.Project, LINKS.Project.Contribute, LINKS.News.All],
  },
  {
    title: "Layout.Footer.Lore",
    links: [LINKS.Lore.History],
  },
  {
    title: "Layout.Footer.Community",
    links: [
      LINKS.Community.Discord,
      LINKS.Community.Github,
      LINKS.Community.Rss,
    ],
  },
];

export const getFooterLinks = (): GeneratedNavigationLinksGroups =>
  FOOTER_LINKS.map((group: NavigationLinksGroup) => ({
    ...group,
    links: group.links
      .filter((link: NavigationLink) => !link.hidden)
      .map((link: NavigationLink) => ({
        ...link,
        href: link.href(),
      })),
  }));
