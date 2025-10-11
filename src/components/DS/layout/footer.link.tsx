import { LINKS } from "@feat/navigation/Links";
import type {
  GeneratedNavigationLinksGroups,
  NavigationLink,
  NavigationLinksGroup,
  NavigationLinksGroups,
} from "@feat/navigation/navigation.model";

const FOOTER_LINKS: NavigationLinksGroups = [
  {
    title: "Project",
    links: [LINKS.Project.Vision, LINKS.Project.Contribute, LINKS.News.All],
  },
  {
    title: "Lore",
    links: [LINKS.Lore.History],
  },
  {
    title: "Community",
    links: [LINKS.Community.Discord, LINKS.Community.Github],
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
